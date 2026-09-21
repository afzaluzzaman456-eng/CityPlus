from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy.orm import Session
from typing import Annotated, Optional
from database import SessionLocal
from models import Complaints, ServiceRequests, users
from fastapi.responses import JSONResponse
from router.authentication import get_current_user
from passlib.context import CryptContext

router = APIRouter()


# =========================
# PASSWORD HASHING
# =========================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================
# DATABASE
# =========================


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


# =========================================================
# USER SCHEMAS
# =========================================================


class AdminUserCreate(BaseModel):

    email: EmailStr
    username: str = Field(min_length=3)
    firstname: str = Field(min_length=1)
    lastname: str = Field(min_length=1)
    password: str = Field(min_length=6)
    role: str = Field(default="user")


class AdminUserUpdate(BaseModel):

    email: Optional[EmailStr] = None
    username: Optional[str] = Field(default=None, min_length=3)
    firstname: Optional[str] = Field(default=None, min_length=1)
    lastname: Optional[str] = Field(default=None, min_length=1)
    password: Optional[str] = Field(default=None, min_length=6)
    role: Optional[str] = None


# =========================================================
# USER RESPONSE
# =========================================================


def user_response(user_model):

    return {
        "id": user_model.id,
        "email": user_model.email,
        "username": user_model.username,
        "firstname": user_model.firstname,
        "lastname": user_model.lastname,
        "role": user_model.role,
    }


# =========================================================
# GET ALL USERS
# =========================================================


@router.get("/admin/users")
def get_all_users(user: user_dependency, db: db_dependency):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=403, detail="Admin access required")

    users_list = db.query(users).all()

    return {
        "total": len(users_list),
        "users": [user_response(item) for item in users_list],
    }


# =========================================================
# GET SINGLE USER
# =========================================================


@router.get("/admin/users/{user_id}")
def get_single_user(user_id: int, user: user_dependency, db: db_dependency):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=403, detail="Admin access required")

    user_model = db.query(users).filter(users.id == user_id).first()

    if user_model is None:

        raise HTTPException(status_code=404, detail="User not found")

    return user_response(user_model)


# =========================================================
# CREATE USER BY ADMIN
# =========================================================


@router.post("/admin/users", status_code=201)
def create_user_by_admin(
    user_data: AdminUserCreate, user: user_dependency, db: db_dependency
):

    # Only admin can create user
    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=403, detail="Admin access required")

    # Check role
    if user_data.role not in ["admin", "user"]:

        raise HTTPException(status_code=400, detail="Role must be either admin or user")

    # Check username
    existing_username = (
        db.query(users).filter(users.username == user_data.username).first()
    )

    if existing_username:

        raise HTTPException(status_code=400, detail="Username already exists")

    # Check email
    existing_email = db.query(users).filter(users.email == user_data.email).first()

    if existing_email:

        raise HTTPException(status_code=400, detail="Email already exists")

    # Hash password
    hashed_password = pwd_context.hash(user_data.password)

    # Create user
    new_user = users(
        email=user_data.email,
        username=user_data.username,
        firstname=user_data.firstname,
        lastname=user_data.lastname,
        password=hashed_password,
        role=user_data.role,
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {"message": "User created successfully", "user": user_response(new_user)}


# =========================================================
# UPDATE USER
# =========================================================


@router.put("/admin/users/{user_id}")
def update_user(
    user_id: int, user_data: AdminUserUpdate, user: user_dependency, db: db_dependency
):

    # Only admin
    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=403, detail="Admin access required")

    # Find user
    user_model = db.query(users).filter(users.id == user_id).first()

    if user_model is None:

        raise HTTPException(status_code=404, detail="User not found")

    # Get only sent fields
    update_data = user_data.model_dump(exclude_unset=True)

    # Check username
    if "username" in update_data:

        existing_username = (
            db.query(users)
            .filter(users.username == update_data["username"], users.id != user_id)
            .first()
        )

        if existing_username:

            raise HTTPException(status_code=400, detail="Username already exists")

    # Check email
    if "email" in update_data:

        existing_email = (
            db.query(users)
            .filter(users.email == update_data["email"], users.id != user_id)
            .first()
        )

        if existing_email:

            raise HTTPException(status_code=400, detail="Email already exists")

    # Validate role
    if "role" in update_data:

        if update_data["role"] not in ["admin", "user"]:

            raise HTTPException(
                status_code=400, detail="Role must be either admin or user"
            )

    # Hash password if password is updated
    if "password" in update_data:

        update_data["password"] = pwd_context.hash(update_data["password"])

    # Update fields
    for key, value in update_data.items():

        setattr(user_model, key, value)

    db.commit()

    db.refresh(user_model)

    return {"message": "User updated successfully", "user": user_response(user_model)}


# =========================================================
# DELETE USER
# =========================================================


@router.delete("/admin/users/{user_id}")
def delete_user(user_id: int, user: user_dependency, db: db_dependency):

    # Only admin
    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=403, detail="Admin access required")

    # Admin cannot delete himself
    if user.get("id") == user_id:

        raise HTTPException(status_code=400, detail="Admin cannot delete himself")

    # Find user
    user_model = db.query(users).filter(users.id == user_id).first()

    if user_model is None:

        raise HTTPException(status_code=404, detail="User not found")

    # Delete user's complaints
    db.query(Complaints).filter(Complaints.user_id == user_id).delete(
        synchronize_session=False
    )

    # Delete user's service requests
    db.query(ServiceRequests).filter(ServiceRequests.user_id == user_id).delete(
        synchronize_session=False
    )

    # Delete user
    db.delete(user_model)

    db.commit()

    return {"message": "User deleted successfully"}


# =========================================================
# COMPLAINT SCHEMA
# =========================================================


class ComplaintCreate(BaseModel):

    title: str = Field(min_length=1)

    description: str = Field(default="", max_length=500)

    category: str = Field(min_length=1)

    location: str = Field(min_length=1)

    priority: str = Field(default="medium")


class ComplaintUpdate(BaseModel):

    title: Optional[str] = Field(default=None, min_length=1)

    description: Optional[str] = Field(default=None, max_length=500)

    category: Optional[str] = Field(default=None, min_length=1)

    location: Optional[str] = Field(default=None, min_length=1)

    priority: Optional[str] = Field(default=None)

    status: Optional[str] = Field(default=None)


# =========================================================
# SERVICE SCHEMA
# =========================================================


class ServiceCreate(BaseModel):

    title: str = Field(min_length=1)

    description: str = Field(default="", max_length=500)

    category: str = Field(min_length=1)

    location: str = Field(min_length=1)


class ServiceUpdate(BaseModel):

    title: Optional[str] = Field(default=None, min_length=1)

    description: Optional[str] = Field(default=None, max_length=500)

    category: Optional[str] = Field(default=None, min_length=1)

    location: Optional[str] = Field(default=None, min_length=1)

    status: Optional[str] = Field(default=None)


# =========================================================
# CREATE COMPLAINT
# =========================================================


@router.post("/admin/create_complaint")
def create_complaint(
    user: user_dependency, db: db_dependency, new_complaint: ComplaintCreate
):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=401, detail="Failed Authentication")

    if new_complaint.priority not in ["low", "medium", "high"]:

        raise HTTPException(status_code=400, detail="Invalid priority")

    complaint_model = Complaints(
        **new_complaint.model_dump(), user_id=user.get("id"), status="pending"
    )

    db.add(complaint_model)

    db.commit()

    db.refresh(complaint_model)

    return JSONResponse(
        status_code=201, content={"message": "Complaint created successfully"}
    )


# =========================================================
# UPDATE COMPLAINT
# =========================================================


@router.put("/admin/update_complaint/{complaint_id}")
def update_complaint(
    user: user_dependency,
    db: db_dependency,
    update_complaint: ComplaintUpdate,
    complaint_id: int,
):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=401, detail="Failed Authentication")

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:

        raise HTTPException(status_code=404, detail="Complaint not found")

    update_data = update_complaint.model_dump(exclude_unset=True)

    if "priority" in update_data:

        if update_data["priority"] not in ["low", "medium", "high"]:

            raise HTTPException(status_code=400, detail="Invalid priority")

    if "status" in update_data:

        if update_data["status"] not in [
            "pending",
            "in_progress",
            "resolved",
            "rejected",
        ]:

            raise HTTPException(status_code=400, detail="Invalid status")

    for key, value in update_data.items():

        setattr(complaint, key, value)

    db.commit()

    db.refresh(complaint)

    return JSONResponse(
        status_code=200, content={"message": "Complaint updated successfully"}
    )


# =========================================================
# DELETE COMPLAINT
# =========================================================


@router.delete("/admin/delete_complaint/{complaint_id}")
def delete_complaint(user: user_dependency, db: db_dependency, complaint_id: int):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=401, detail="Failed Authentication")

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:

        raise HTTPException(status_code=404, detail="Complaint not found")

    db.query(Complaints).filter(Complaints.id == complaint_id).delete(
        synchronize_session=False
    )

    db.commit()

    return JSONResponse(
        status_code=200, content={"message": "Complaint deleted successfully"}
    )


# =========================================================
# UPDATE COMPLAINT STATUS
# =========================================================


@router.put("/admin/complaint/status/{complaint_id}")
def update_complaint_status(
    user: user_dependency, db: db_dependency, complaint_id: int, status: str
):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=401, detail="Failed Authentication")

    if status not in ["pending", "in_progress", "resolved", "rejected"]:

        raise HTTPException(status_code=400, detail="Invalid status")

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:

        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = status

    db.commit()

    return JSONResponse(
        status_code=200, content={"message": "Complaint status updated successfully"}
    )


# =========================================================
# CREATE SERVICE REQUEST
# =========================================================


@router.post("/admin/create_service")
def create_service(
    user: user_dependency, db: db_dependency, new_service: ServiceCreate
):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=401, detail="Failed Authentication")

    service_model = ServiceRequests(
        **new_service.model_dump(), user_id=user.get("id"), status="pending"
    )

    db.add(service_model)

    db.commit()

    db.refresh(service_model)

    return JSONResponse(
        status_code=201, content={"message": "Service request created successfully"}
    )


# =========================================================
# UPDATE SERVICE REQUEST
# =========================================================


@router.put("/admin/update_service/{service_id}")
def update_service(
    user: user_dependency,
    db: db_dependency,
    update_service: ServiceUpdate,
    service_id: int,
):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=401, detail="Failed Authentication")

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:

        raise HTTPException(status_code=404, detail="Service request not found")

    update_data = update_service.model_dump(exclude_unset=True)

    if "status" in update_data:

        if update_data["status"] not in [
            "pending",
            "in_progress",
            "resolved",
            "rejected",
        ]:

            raise HTTPException(status_code=400, detail="Invalid status")

    for key, value in update_data.items():

        setattr(service, key, value)

    db.commit()

    db.refresh(service)

    return JSONResponse(
        status_code=200, content={"message": "Service request updated successfully"}
    )


# =========================================================
# DELETE SERVICE REQUEST
# =========================================================


@router.delete("/admin/delete_service/{service_id}")
def delete_service(user: user_dependency, db: db_dependency, service_id: int):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=401, detail="Failed Authentication")

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:

        raise HTTPException(status_code=404, detail="Service request not found")

    db.query(ServiceRequests).filter(ServiceRequests.id == service_id).delete(
        synchronize_session=False
    )

    db.commit()

    return JSONResponse(
        status_code=200, content={"message": "Service request deleted successfully"}
    )


# =========================================================
# UPDATE SERVICE STATUS
# =========================================================


@router.put("/admin/service/status/{service_id}")
def update_service_status(
    user: user_dependency, db: db_dependency, service_id: int, status: str
):

    if user is None or user.get("role") != "admin":

        raise HTTPException(status_code=401, detail="Failed Authentication")

    if status not in ["pending", "in_progress", "resolved", "rejected"]:

        raise HTTPException(status_code=400, detail="Invalid status")

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:

        raise HTTPException(status_code=404, detail="Service request not found")

    service.status = status

    db.commit()

    return JSONResponse(
        status_code=200,
        content={"message": "Service request status updated successfully"},
    )
