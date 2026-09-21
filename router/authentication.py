from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
from typing import Annotated, Optional
from database import SessionLocal
from models import users
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError

router = APIRouter()


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

OAuth2_bearer = OAuth2PasswordBearer(tokenUrl="login")


SECRET_KEY = "86746eeb8285ca279c6251e0bd83cdd50c88027b934a93f19d8b9af782139516"
ALGORITHM = "HS256"


class Createusers(BaseModel):

    email: EmailStr
    username: str
    firstname: str
    lastname: str
    password: str
    role: str = "user"


class UpdateUser(BaseModel):

    email: Optional[EmailStr] = Field(default=None)
    username: Optional[str] = Field(default=None)
    firstname: Optional[str] = Field(default=None)
    lastname: Optional[str] = Field(default=None)


class UpdatePassword(BaseModel):

    current_password: str
    new_password: str


class ForgotPassword(BaseModel):

    username: str
    new_password: str


class RefreshTokenRequest(BaseModel):

    refresh_token: str


def authenticate_user(username, password, db):

    user = db.query(users).filter(users.username == username).first()

    if user is None:
        return False

    if not user.is_active:
        return False

    if bcrypt_context.verify(password, user.hash_password):
        return user

    return False


def create_access_token(
    username: str, user_id: int, role: str, expires_delta: timedelta
):

    encode = {"sub": username, "id": user_id, "role": role, "type": "access"}

    expires = datetime.now(timezone.utc) + expires_delta

    encode.update({"exp": expires})

    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(
    username: str, user_id: int, role: str, expires_delta: timedelta
):

    encode = {"sub": username, "id": user_id, "role": role, "type": "refresh"}

    expires = datetime.now(timezone.utc) + expires_delta

    encode.update({"exp": expires})

    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: Annotated[str, Depends(OAuth2_bearer)]):

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        username = payload.get("sub")
        user_id = payload.get("id")
        role = payload.get("role")
        token_type = payload.get("type")

        if username is None or user_id is None:

            raise HTTPException(status_code=401, detail="Invalid authentication token")

        if token_type != "access":

            raise HTTPException(status_code=401, detail="Invalid access token")

        return {"username": username, "id": user_id, "role": role}

    except JWTError:

        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

user_dependency = Annotated[dict, Depends(get_current_user)]


# =========================
# CREATE USER
# =========================


@router.post("/createuser")
def create_users(db: db_dependency, new_user: Createusers):

    existing_username = (
        db.query(users).filter(users.username == new_user.username).first()
    )

    if existing_username:

        raise HTTPException(status_code=400, detail="Username already exists")

    existing_email = db.query(users).filter(users.email == new_user.email).first()

    if existing_email:

        raise HTTPException(status_code=400, detail="Email already exists")

    if len(new_user.password) < 6:

        raise HTTPException(
            status_code=400, detail="Password must be at least 6 characters"
        )

    if new_user.role not in ["user", "admin"]:

        raise HTTPException(status_code=400, detail="Invalid role")

    user_model = users(
        email=new_user.email,
        username=new_user.username,
        firstname=new_user.firstname,
        lastname=new_user.lastname,
        hash_password=bcrypt_context.hash(new_user.password),
        is_active=True,
        role=new_user.role,
    )

    db.add(user_model)
    db.commit()
    db.refresh(user_model)

    return JSONResponse(
        status_code=201, content={"message": "User created successfully"}
    )


# =========================
# LOGIN
# =========================


@router.post("/login")
def login_user(
    db: db_dependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):

    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:

        raise HTTPException(status_code=401, detail="Failed Authentication")

    access_token = create_access_token(
        user.username, user.id, user.role, timedelta(minutes=30)
    )

    refresh_token = create_refresh_token(
        user.username, user.id, user.role, timedelta(days=7)
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# =========================
# REFRESH TOKEN
# =========================


@router.post("/refresh")
def refresh_access_token(refresh_data: RefreshTokenRequest, db: db_dependency):

    try:

        payload = jwt.decode(
            refresh_data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM]
        )

        username = payload.get("sub")
        user_id = payload.get("id")
        role = payload.get("role")
        token_type = payload.get("type")

        if (
            username is None
            or user_id is None
            or role is None
            or token_type != "refresh"
        ):

            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user = db.query(users).filter(users.id == user_id).first()

        if user is None or not user.is_active:

            raise HTTPException(status_code=401, detail="User not found or inactive")

        new_access_token = create_access_token(
            user.username, user.id, user.role, timedelta(minutes=30)
        )

        return {"access_token": new_access_token, "token_type": "bearer"}

    except JWTError:

        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")


# =========================
# UPDATE USER
# =========================


@router.put("/edituser")
def update_user(user: user_dependency, db: db_dependency, update_user: UpdateUser):

    if user is None:

        raise HTTPException(status_code=401, detail="Failed Authentication")

    user_model = db.query(users).filter(users.id == user.get("id")).first()

    if user_model is None:

        raise HTTPException(status_code=404, detail="User not found")

    update_data = update_user.model_dump(exclude_unset=True)

    if "username" in update_data:

        existing_username = (
            db.query(users)
            .filter(
                users.username == update_data["username"], users.id != user_model.id
            )
            .first()
        )

        if existing_username:

            raise HTTPException(status_code=400, detail="Username already exists")

    if "email" in update_data:

        existing_email = (
            db.query(users)
            .filter(users.email == update_data["email"], users.id != user_model.id)
            .first()
        )

        if existing_email:

            raise HTTPException(status_code=400, detail="Email already exists")

    for key, value in update_data.items():

        setattr(user_model, key, value)

    db.commit()

    return JSONResponse(
        status_code=200, content={"message": "User updated successfully"}
    )


# =========================
# CHANGE PASSWORD
# =========================


@router.put("/passwordchange")
def update_password(
    user: user_dependency, db: db_dependency, update_password: UpdatePassword
):

    if user is None:

        raise HTTPException(status_code=401, detail="Failed Authentication")

    user_model = db.query(users).filter(users.id == user.get("id")).first()

    if user_model is None:

        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt_context.verify(
        update_password.current_password, user_model.hash_password
    ):

        raise HTTPException(status_code=401, detail="Wrong Password")

    if len(update_password.new_password) < 6:

        raise HTTPException(
            status_code=400, detail="Password must be at least 6 characters"
        )

    user_model.hash_password = bcrypt_context.hash(update_password.new_password)

    db.commit()

    return JSONResponse(
        status_code=200, content={"message": "Password updated successfully"}
    )


# =========================
# FORGOT PASSWORD
# =========================


@router.put("/forgotpassword")
def forgot_password(db: db_dependency, forgot_password: ForgotPassword):

    user = db.query(users).filter(users.username == forgot_password.username).first()

    if user is None:

        raise HTTPException(status_code=404, detail="User not found")

    if len(forgot_password.new_password) < 6:

        raise HTTPException(
            status_code=400, detail="Password must be at least 6 characters"
        )

    user.hash_password = bcrypt_context.hash(forgot_password.new_password)

    db.commit()

    return JSONResponse(
        status_code=200, content={"message": "Password reset successfully"}
    )
