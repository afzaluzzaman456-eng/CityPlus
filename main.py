from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Annotated, Optional
from datetime import datetime

import models

from models import Complaints, ServiceRequests, AdminMessages
from database import engine, SessionLocal
from router import admin, authentication
from router.authentication import get_current_user

app = FastAPI()


models.Base.metadata.create_all(bind=engine)

app.include_router(authentication.router)
app.include_router(admin.router)


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


# =========================
# COMPLAINTS
# =========================


@app.get("/complaints")
def get_complaints(
    user: user_dependency,
    db: db_dependency,
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    complaints = db.query(Complaints)

    # Search
    if search:
        search_filters = [
            Complaints.title.contains(search),
            Complaints.description.contains(search),
            Complaints.location.contains(search),
        ]

        if search.isdigit():
            search_filters.append(Complaints.id == int(search))

        complaints = complaints.filter(or_(*search_filters))

    # Category
    if category:
        complaints = complaints.filter(Complaints.category == category)

    # Status
    if status:
        complaints = complaints.filter(Complaints.status == status)

    # Priority
    if priority:
        complaints = complaints.filter(Complaints.priority == priority)

    # Date range
    if start_date:
        complaints = complaints.filter(Complaints.created_at >= start_date)

    if end_date:
        complaints = complaints.filter(Complaints.created_at <= end_date)

    # Sorting
    if sort_by == "title":

        if order == "asc":
            complaints = complaints.order_by(Complaints.title.asc())
        else:
            complaints = complaints.order_by(Complaints.title.desc())

    elif sort_by == "created_at":

        if order == "asc":
            complaints = complaints.order_by(Complaints.created_at.asc())
        else:
            complaints = complaints.order_by(Complaints.created_at.desc())

    elif sort_by == "priority":

        if order == "asc":
            complaints = complaints.order_by(Complaints.priority.asc())
        else:
            complaints = complaints.order_by(Complaints.priority.desc())

    # Pagination
    skip = (page - 1) * page_size

    complaints = complaints.offset(skip).limit(page_size).all()

    return complaints


@app.get("/complaints/all")
def get_all_complaints(user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    return db.query(Complaints).all()


@app.get("/complaints/my")
def my_complaints(user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    return db.query(Complaints).filter(Complaints.user_id == user.get("id")).all()


@app.get("/complaints/{complaint_id}")
def get_specific_complaint(user: user_dependency, db: db_dependency, complaint_id: int):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    return complaint


@app.post("/complaints")
def create_complaint(
    user: user_dependency,
    db: db_dependency,
    title: str,
    description: str,
    category: str,
    location: str,
):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    complaint_model = Complaints(
        title=title,
        description=description,
        category=category,
        location=location,
        user_id=user.get("id"),
        status="pending",
    )

    db.add(complaint_model)
    db.commit()
    db.refresh(complaint_model)

    return {"message": "Complaint submitted successfully"}


@app.put("/complaints/{complaint_id}")
def update_complaint(
    user: user_dependency,
    db: db_dependency,
    complaint_id: int,
    title: str,
    description: str,
    category: str,
    location: str,
):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if complaint.user_id != user.get("id") and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    complaint.title = title
    complaint.description = description
    complaint.category = category
    complaint.location = location

    db.commit()

    return {"message": "Complaint updated successfully"}


@app.delete("/complaints/{complaint_id}")
def delete_complaint(user: user_dependency, db: db_dependency, complaint_id: int):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    complaint = db.query(Complaints).filter(Complaints.id == complaint_id).first()

    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if complaint.user_id != user.get("id") and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(complaint)
    db.commit()

    return {"message": "Complaint deleted successfully"}


# =========================
# SERVICE REQUESTS
# =========================


@app.get("/services")
def get_services(
    user: user_dependency,
    db: db_dependency,
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    services = db.query(ServiceRequests)

    # Search
    if search:
        search_filters = [
            ServiceRequests.title.contains(search),
            ServiceRequests.description.contains(search),
            ServiceRequests.location.contains(search),
        ]

        if search.isdigit():
            search_filters.append(ServiceRequests.id == int(search))

        services = services.filter(or_(*search_filters))

    # Category
    if category:
        services = services.filter(ServiceRequests.category == category)

    # Status
    if status:
        services = services.filter(ServiceRequests.status == status)

    # Date range
    if start_date:
        services = services.filter(ServiceRequests.created_at >= start_date)

    if end_date:
        services = services.filter(ServiceRequests.created_at <= end_date)

    # Sorting
    if sort_by == "title":

        if order == "asc":
            services = services.order_by(ServiceRequests.title.asc())
        else:
            services = services.order_by(ServiceRequests.title.desc())

    elif sort_by == "created_at":

        if order == "asc":
            services = services.order_by(ServiceRequests.created_at.asc())
        else:
            services = services.order_by(ServiceRequests.created_at.desc())

    # Pagination
    skip = (page - 1) * page_size

    services = services.offset(skip).limit(page_size).all()

    return services


@app.get("/services/all")
def get_all_services(user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    return db.query(ServiceRequests).all()


@app.get("/services/my")
def my_services(user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    return (
        db.query(ServiceRequests)
        .filter(ServiceRequests.user_id == user.get("id"))
        .all()
    )


@app.get("/services/{service_id}")
def get_specific_service(user: user_dependency, db: db_dependency, service_id: int):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:
        raise HTTPException(status_code=404, detail="Service request not found")

    return service


@app.post("/services")
def create_service(
    user: user_dependency,
    db: db_dependency,
    title: str,
    description: str,
    category: str,
    location: str,
):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    service_model = ServiceRequests(
        title=title,
        description=description,
        category=category,
        location=location,
        user_id=user.get("id"),
        status="pending",
    )

    db.add(service_model)
    db.commit()
    db.refresh(service_model)

    return {"message": "Service request submitted successfully"}


@app.put("/services/{service_id}")
def update_service(
    user: user_dependency,
    db: db_dependency,
    service_id: int,
    title: str,
    description: str,
    category: str,
    location: str,
):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:
        raise HTTPException(status_code=404, detail="Service request not found")

    if service.user_id != user.get("id") and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    service.title = title
    service.description = description
    service.category = category
    service.location = location

    db.commit()

    return {"message": "Service request updated successfully"}


@app.put("/admin/service/status/{service_id}")
def update_service_status(
    user: user_dependency,
    db: db_dependency,
    service_id: int,
    status: str,
):

    if user is None or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Failed Authentication")

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:
        raise HTTPException(status_code=404, detail="Service request not found")

    if status not in [
        "pending",
        "in_progress",
        "resolved",
        "rejected",
    ]:
        raise HTTPException(status_code=400, detail="Invalid status")

    service.status = status

    db.commit()

    return {"message": "Service request status updated successfully"}


@app.delete("/services/{service_id}")
def delete_service(user: user_dependency, db: db_dependency, service_id: int):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    service = db.query(ServiceRequests).filter(ServiceRequests.id == service_id).first()

    if service is None:
        raise HTTPException(status_code=404, detail="Service request not found")

    if service.user_id != user.get("id") and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(service)
    db.commit()

    return {"message": "Service request deleted successfully"}


# =========================
# ADMIN MESSAGES
# =========================


@app.post("/admin/messages")
def send_admin_message(
    user: user_dependency,
    db: db_dependency,
    title: str,
    message: str,
):

    if user is None or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Admin access required")

    if not title.strip() or not message.strip():
        raise HTTPException(status_code=400, detail="Title and message are required")

    new_message = AdminMessages(title=title, message=message, admin_id=user.get("id"))

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {"message": "Message sent successfully", "data": new_message}


@app.get("/admin/messages")
def get_admin_messages(user: user_dependency, db: db_dependency):

    if user is None or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Admin access required")

    messages = (
        db.query(AdminMessages)
        .filter(AdminMessages.admin_id == user.get("id"))
        .order_by(AdminMessages.created_at.desc())
        .all()
    )

    return messages


@app.get("/messages")
def get_user_messages(user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail="Failed Authentication")

    messages = db.query(AdminMessages).order_by(AdminMessages.created_at.desc()).all()

    return messages


@app.delete("/admin/messages/{message_id}")
def delete_admin_message(message_id: int, user: user_dependency, db: db_dependency):

    if user is None or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Admin access required")

    message = (
        db.query(AdminMessages)
        .filter(
            AdminMessages.id == message_id, AdminMessages.admin_id == user.get("id")
        )
        .first()
    )

    if message is None:
        raise HTTPException(status_code=404, detail="Message not found")

    db.delete(message)
    db.commit()

    return {"message": "Message deleted successfully"}
