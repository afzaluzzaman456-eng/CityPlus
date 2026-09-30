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


# =========================================================
# PASSWORD HASHING
# =========================================================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================================================
# DATABASE
# =========================================================


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

user_dependency = Annotated[dict, Depends(get_current_user)]


# =========================================================
# ADMIN CHECK HELPER
# =========================================================


def check_admin(user):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    role = str(user.get("role", "")).strip().lower()

    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


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
        "is_active": user_model.is_active,
    }


# =========================================================
# GET ALL USERS
# ADMIN ONLY
# =========================================================


@router.get("/admin/users")
def get_all_users(user: user_dependency, db: db_dependency):

    check_admin(user)

    users_list = db.query(users).order_by(users.id.desc()).all()

    return {
        "total": len(users_list),
        "users": [user_response(item) for item in users_list],
    }


# =========================================================
# GET SINGLE USER
# ADMIN ONLY
# =========================================================


@router.get("/admin/users/{user_id}")
def get_single_user(user_id: int, user: user_dependency, db: db_dependency):

    check_admin(user)

    user_model = db.query(users).filter(users.id == user_id).first()

    if user_model is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user_response(user_model)


# =========================================================
# CREATE USER BY ADMIN
# ADMIN ONLY
# =========================================================


@router.post("/admin/users", status_code=201)
def create_user_by_admin(
    user_data: AdminUserCreate, user: user_dependency, db: db_dependency
):

    check_admin(user)

    role = user_data.role.strip().lower()

    if role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Role must be either admin or user")

    username = user_data.username.strip()
    email = str(user_data.email).strip().lower()
    firstname = user_data.firstname.strip()
    lastname = user_data.lastname.strip()

    existing_username = db.query(users).filter(users.username == username).first()

    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")

    existing_email = db.query(users).filter(users.email == email).first()

    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user_data.password)

    new_user = users(
        email=email,
        username=username,
        firstname=firstname,
        lastname=lastname,
        # IMPORTANT:
        # models.py uses hash_password
        hash_password=hashed_password,
        is_active=True,
        role=role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "user": user_response(new_user)}


# =========================================================
# UPDATE USER
# ADMIN ONLY
# =========================================================


@router.put("/admin/users/{user_id}")
def update_user(
    user_id: int, user_data: AdminUserUpdate, user: user_dependency, db: db_dependency
):

    check_admin(user)

    user_model = db.query(users).filter(users.id == user_id).first()

    if user_model is None:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_data.model_dump(exclude_unset=True)

    # =====================================================
    # USERNAME CHECK
    # =====================================================

    if "username" in update_data:

        if update_data["username"] is not None:

            username = update_data["username"].strip()

            existing_username = (
                db.query(users)
                .filter(users.username == username, users.id != user_id)
                .first()
            )

            if existing_username:
                raise HTTPException(status_code=400, detail="Username already exists")

            update_data["username"] = username

    # =====================================================
    # EMAIL CHECK
    # =====================================================

    if "email" in update_data:

        if update_data["email"] is not None:

            email = str(update_data["email"]).strip().lower()

            existing_email = (
                db.query(users)
                .filter(users.email == email, users.id != user_id)
                .first()
            )

            if existing_email:
                raise HTTPException(status_code=400, detail="Email already exists")

            update_data["email"] = email

    # =====================================================
    # FIRSTNAME
    # =====================================================

    if "firstname" in update_data:

        if update_data["firstname"] is not None:

            update_data["firstname"] = update_data["firstname"].strip()

    # =====================================================
    # LASTNAME
    # =====================================================

    if "lastname" in update_data:

        if update_data["lastname"] is not None:

            update_data["lastname"] = update_data["lastname"].strip()

    # =====================================================
    # ROLE VALIDATION
    # =====================================================

    if "role" in update_data:

        if update_data["role"] is not None:

            role = str(update_data["role"]).strip().lower()

            if role not in ["admin", "user"]:
                raise HTTPException(
                    status_code=400, detail="Role must be either admin or user"
                )

            update_data["role"] = role

    # =====================================================
    # PASSWORD HASHING
    # =====================================================

    if "password" in update_data:

        password = update_data.pop("password")

        if password:
            update_data["hash_password"] = pwd_context.hash(password)

    # =====================================================
    # UPDATE DATABASE
    # =====================================================

    for key, value in update_data.items():
        setattr(user_model, key, value)

    db.commit()
    db.refresh(user_model)

    return {"message": "User updated successfully", "user": user_response(user_model)}


# =========================================================
# DELETE USER
# ADMIN ONLY
# =========================================================


@router.delete("/admin/users/{user_id}")
def delete_user(user_id: int, user: user_dependency, db: db_dependency):

    check_admin(user)

    # Admin cannot delete himself
    if user.get("id") == user_id:

        raise HTTPException(status_code=400, detail="Admin cannot delete himself")

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
    priority: Optional[str] = None
    status: Optional[str] = None


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
    status: Optional[str] = None


# =========================================================
# CREATE COMPLAINT
# AUTHENTICATED USERS
# =========================================================


@router.post("/complaints", status_code=201)
def create_complaint(
    user: user_dependency, db: db_dependency, new_complaint: ComplaintCreate
):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    priority = new_complaint.priority.strip().lower()

    if priority not in ["low", "medium", "high"]:
        raise HTTPException(status_code=400, detail="Invalid priority")

    user_id = user.get("id")

    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found")

    complaint_model = Complaints(
        title=new_complaint.title.strip(),
        description=new_complaint.description,
        category=new_complaint.category.strip(),
        location=new_complaint.location.strip(),
        priority=priority,
        user_id=user_id,
        status="pending",
    )

    db.add(complaint_model)
    db.commit()
    db.refresh(complaint_model)

    return {
        "message": "Complaint created successfully",
        "complaint": {
            "id": complaint_model.id,
            "title": complaint_model.title,
            "description": complaint_model.description,
            "category": complaint_model.category,
            "location": complaint_model.location,
            "priority": complaint_model.priority,
            "status": complaint_model.status,
            "user_id": complaint_model.user_id,
        },
    }


# =========================================================
# GET MY COMPLAINTS
# NORMAL USER = ONLY OWN COMPLAINTS
# =========================================================


@router.get("/complaints/my")
def get_my_complaints(user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    user_id = user.get("id")

    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found")

    complaints = (
        db.query(Complaints)
        .filter(Complaints.user_id == user_id)
        .order_by(Complaints.id.desc())
        .all()
    )

    return complaints


# =========================================================
# GET ALL COMPLAINTS
# ADMIN ONLY
# =========================================================


@router.get("/complaints/all")
def get_all_complaints(user: user_dependency, db: db_dependency):

    check_admin(user)

    complaints = db.query(Complaints).order_by(Complaints.id.desc()).all()

    return complaints


# =========================================================
# GET COMPLAINTS
#
# ADMIN  -> ALL COMPLAINTS
# USER   -> ONLY OWN COMPLAINTS
# =========================================================


@router.get("/complaints")
def get_complaints(user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    role = str(user.get("role", "")).strip().lower()

    # ADMIN
    if role == "admin":

        return db.query(Complaints).order_by(Complaints.id.desc()).all()

    # NORMAL USER
    user_id = user.get("id")

    if user_id is None:
        raise HTTPException(status_code=401, detail="User ID not found")

    return (
        db.query(Complaints)
        .filter(Complaints.user_id == user_id)
        .order_by(Complaints.id.desc())
        .all()
    )


# =========================================================
# GET SINGLE COMPLAINT
#
# ADMIN  -> ANY COMPLAINT
# USER   -> ONLY OWN COMPLAINT
# =========================================================


@router.get("/complaints/{complaint_id}")
def get_single_complaint(complaint_id: int, user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    role = str(user.get("role", "")).strip().lower()

    # Admin can view any complaint
    if role == "admin":
        return complaint

    # User can view only own complaint
    if complaint.user_id != user.get("id"):

        raise HTTPException(
            status_code=403, detail="You are not authorized to view this complaint"
        )

    return complaint


# =========================================================
# ADMIN CREATE COMPLAINT
# =========================================================


@router.post("/admin/create_complaint", status_code=201)
def create_complaint_by_admin(
    user: user_dependency, db: db_dependency, new_complaint: ComplaintCreate
):

    check_admin(user)

    priority = new_complaint.priority.strip().lower()

    if priority not in ["low", "medium", "high"]:
        raise HTTPException(status_code=400, detail="Invalid priority")

    complaint_model = Complaints(
        title=new_complaint.title.strip(),
        description=new_complaint.description,
        category=new_complaint.category.strip(),
        location=new_complaint.location.strip(),
        priority=priority,
        user_id=user.get("id"),
        status="pending",
    )

    db.add(complaint_model)
    db.commit()
    db.refresh(complaint_model)

    return {
        "message": "Complaint created successfully",
        "complaint": {
            "id": complaint_model.id,
            "title": complaint_model.title,
            "description": complaint_model.description,
            "category": complaint_model.category,
            "location": complaint_model.location,
            "priority": complaint_model.priority,
            "status": complaint_model.status,
            "user_id": complaint_model.user_id,
        },
    }


# =========================================================
# UPDATE COMPLAINT
# ADMIN ONLY
# =========================================================


@router.put("/admin/update_complaint/{complaint_id}")
def update_complaint(
    user: user_dependency,
    db: db_dependency,
    update_complaint: ComplaintUpdate,
    complaint_id: int,
):

    check_admin(user)

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    update_data = update_complaint.model_dump(exclude_unset=True)

    # =====================================================
    # VALIDATE PRIORITY
    # =====================================================

    if "priority" in update_data:

        if update_data["priority"] is not None:

            priority = update_data["priority"].strip().lower()

            if priority not in ["low", "medium", "high"]:
                raise HTTPException(status_code=400, detail="Invalid priority")

            update_data["priority"] = priority

    # =====================================================
    # VALIDATE STATUS
    # =====================================================

    if "status" in update_data:

        if update_data["status"] is not None:

            complaint_status = update_data["status"].strip().lower().replace(" ", "_")

            if complaint_status not in [
                "pending",
                "in_progress",
                "resolved",
                "rejected",
            ]:
                raise HTTPException(status_code=400, detail="Invalid status")

            update_data["status"] = complaint_status

    # =====================================================
    # CLEAN TEXT FIELDS
    # =====================================================

    for field_name in ["title", "category", "location"]:

        if field_name in update_data:

            if update_data[field_name] is not None:

                update_data[field_name] = update_data[field_name].strip()

    # =====================================================
    # UPDATE
    # =====================================================

    for key, value in update_data.items():

        setattr(complaint, key, value)

    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint updated successfully",
        "complaint": {
            "id": complaint.id,
            "title": complaint.title,
            "description": complaint.description,
            "category": complaint.category,
            "location": complaint.location,
            "priority": complaint.priority,
            "status": complaint.status,
            "user_id": complaint.user_id,
        },
    }


# =========================================================
# DELETE COMPLAINT
# ADMIN ONLY
# =========================================================


@router.delete("/admin/delete_complaint/{complaint_id}")
def delete_complaint(user: user_dependency, db: db_dependency, complaint_id: int):

    check_admin(user)

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    db.delete(complaint)
    db.commit()

    return {"message": "Complaint deleted successfully"}


# =========================================================
# UPDATE COMPLAINT STATUS
# ADMIN ONLY
# =========================================================


@router.put("/admin/complaint/status/{complaint_id}")
def update_complaint_status(
    user: user_dependency, db: db_dependency, complaint_id: int, status: str
):

    check_admin(user)

    complaint_status = status.strip().lower().replace(" ", "_")

    allowed_statuses = ["pending", "in_progress", "resolved", "rejected"]

    if complaint_status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=("Invalid status. " f"Allowed values: {allowed_statuses}"),
        )

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = complaint_status

    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint status updated successfully",
        "complaint_id": complaint.id,
        "status": complaint.status,
    }


# =========================================================
# CREATE SERVICE REQUEST
# ADMIN ONLY
# =========================================================


@router.post("/admin/create_service", status_code=201)
def create_service(
    user: user_dependency, db: db_dependency, new_service: ServiceCreate
):

    check_admin(user)

    service_model = ServiceRequests(
        title=new_service.title.strip(),
        description=new_service.description,
        category=new_service.category.strip(),
        location=new_service.location.strip(),
        user_id=user.get("id"),
        status="pending",
    )

    db.add(service_model)
    db.commit()
    db.refresh(service_model)

    return JSONResponse(
        status_code=201, content={"message": "Service request created successfully"}
    )


# =========================================================
# UPDATE SERVICE REQUEST
# ADMIN ONLY
# =========================================================


@router.put("/admin/update_service/{service_id}")
def update_service(
    user: user_dependency,
    db: db_dependency,
    update_service: ServiceUpdate,
    service_id: int,
):

    check_admin(user)

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:
        raise HTTPException(status_code=404, detail="Service request not found")

    update_data = update_service.model_dump(exclude_unset=True)

    # =====================================================
    # VALIDATE STATUS
    # =====================================================

    if "status" in update_data:

        if update_data["status"] is not None:

            service_status = update_data["status"].strip().lower().replace(" ", "_")

            if service_status not in ["pending", "in_progress", "resolved", "rejected"]:
                raise HTTPException(status_code=400, detail="Invalid status")

            update_data["status"] = service_status

    # =====================================================
    # CLEAN TEXT FIELDS
    # =====================================================

    for field_name in ["title", "category", "location"]:

        if field_name in update_data:

            if update_data[field_name] is not None:

                update_data[field_name] = update_data[field_name].strip()

    # =====================================================
    # UPDATE
    # =====================================================

    for key, value in update_data.items():

        setattr(service, key, value)

    db.commit()
    db.refresh(service)

    return JSONResponse(
        status_code=200, content={"message": "Service request updated successfully"}
    )


# =========================================================
# DELETE SERVICE REQUEST
# ADMIN ONLY
# =========================================================


@router.delete("/admin/delete_service/{service_id}")
def delete_service(user: user_dependency, db: db_dependency, service_id: int):

    check_admin(user)

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:
        raise HTTPException(status_code=404, detail="Service request not found")

    db.delete(service)
    db.commit()

    return JSONResponse(
        status_code=200, content={"message": "Service request deleted successfully"}
    )


# =========================================================
# UPDATE SERVICE STATUS
# ADMIN ONLY
# =========================================================


@router.put("/admin/service/status/{service_id}")
def update_service_status(
    user: user_dependency, db: db_dependency, service_id: int, status: str
):

    check_admin(user)

    service_status = status.strip().lower().replace(" ", "_")

    allowed_statuses = ["pending", "in_progress", "resolved", "rejected"]

    if service_status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=("Invalid status. " f"Allowed values: {allowed_statuses}"),
        )

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:
        raise HTTPException(status_code=404, detail="Service request not found")

    service.status = service_status

    db.commit()
    db.refresh(service)

    return {
        "message": "Service request status updated successfully",
        "service_id": service.id,
        "status": service.status,
    }
