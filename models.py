from database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime


class users(Base):

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    firstname = Column(String)
    lastname = Column(String)
    hash_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String)  # admin or user


class Complaints(Base):

    __tablename__ = 'complaints'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    location = Column(String)
    image = Column(String, nullable=True)
    priority = Column(String, default='medium')
    status = Column(String, default='pending')
    user_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.now)


class ServiceRequests(Base):

    __tablename__ = 'service_requests'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    location = Column(String)
    status = Column(String, default='pending')
    user_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.now)


class AdminMessages(Base):

    __tablename__ = "admin_messages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(String)
    admin_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.now)