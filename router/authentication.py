from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from database import SessionLocal
from models import users

router = APIRouter()


# =========================================================
# CONFIGURATION
# =========================================================

SECRET_KEY = "cityplus-secret-key-change-this-in-production"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7


# =========================================================
# PASSWORD HASHING
# =========================================================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================================================
# OAUTH2
# =========================================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


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


# =========================================================
# SCHEMAS
# =========================================================


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3)
    firstname: str = Field(min_length=1)
    lastname: str = Field(min_length=1)
    password: str = Field(min_length=6)
    role: str = "user"


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user_id: int
    username: str
    email: str
    role: str


# =========================================================
# PASSWORD FUNCTIONS
# =========================================================


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str):
    return pwd_context.hash(password)


# =========================================================
# USER FUNCTIONS
# =========================================================


def get_user_by_username(db: Session, username: str):
    return db.query(users).filter(users.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(users).filter(users.email == email).first()


def authenticate_user(db: Session, identifier: str, password: str):
    """
    Login can work with either:
    - username
    - email
    """

    user = (
        db.query(users)
        .filter((users.username == identifier) | (users.email == identifier))
        .first()
    )

    if not user:
        return None

    if not user.is_active:
        return None

    if not verify_password(password, user.hash_password):
        return None

    return user


# =========================================================
# JWT FUNCTIONS
# =========================================================


def create_access_token(user_id: int, username: str, email: str, role: str):
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": username,
        "user_id": user_id,
        "id": user_id,
        "username": username,
        "email": email,
        "role": role,
        "type": "access",
        "exp": expire,
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(user_id: int, username: str, email: str, role: str):
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    payload = {
        "sub": username,
        "user_id": user_id,
        "id": user_id,
        "username": username,
        "email": email,
        "role": role,
        "type": "refresh",
        "exp": expire,
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# =========================================================
# CURRENT USER
# =========================================================


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    """
    Decode JWT token and return current user information.

    IMPORTANT:
    This function is defined here itself.
    It does NOT import authentication.py.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

        token_type = payload.get("type", "access")

        if token_type != "access":
            raise credentials_exception

        user_id = payload.get("user_id")

        if user_id is None:
            user_id = payload.get("id")

        role = payload.get("role", "user")
        email = payload.get("email", "")

        return {
            "id": user_id,
            "user_id": user_id,
            "username": username,
            "email": email,
            "role": role,
        }

    except JWTError:
        raise credentials_exception


# =========================================================
# REGISTER
# =========================================================


@router.post("/createuser")
def create_user(user_data: UserCreate, db: db_dependency):

    existing_username = get_user_by_username(db, user_data.username)

    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")

    existing_email = get_user_by_email(db, user_data.email)

    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Only allow normal users to register themselves.
    role = "user"

    new_user = users(
        email=str(user_data.email),
        username=user_data.username.strip(),
        firstname=user_data.firstname.strip(),
        lastname=user_data.lastname.strip(),
        hash_password=hash_password(user_data.password),
        is_active=True,
        role=role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.username,
            "firstname": new_user.firstname,
            "lastname": new_user.lastname,
            "role": new_user.role,
        },
    }


# =========================================================
# LOGIN
# =========================================================


@router.post("/login", response_model=TokenResponse)
def login(username: str, password: str, db: db_dependency):

    identifier = username.strip()

    user = authenticate_user(db, identifier, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        user_id=user.id,
        username=user.username,
        email=user.email,
        role=user.role or "user",
    )

    refresh_token = create_refresh_token(
        user_id=user.id,
        username=user.username,
        email=user.email,
        role=user.role or "user",
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role or "user",
    }


# =========================================================
# GET CURRENT USER
# =========================================================


@router.get("/me")
def get_me(current_user: Annotated[dict, Depends(get_current_user)], db: db_dependency):

    user_id = current_user.get("id")

    user = db.query(users).filter(users.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "role": user.role or "user",
        "is_active": user.is_active,
    }


# =========================================================
# REFRESH TOKEN
# =========================================================


class RefreshTokenRequest(BaseModel):
    refresh_token: str


@router.post("/refresh")
def refresh_access_token(request: RefreshTokenRequest, db: db_dependency):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(request.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])

        username = payload.get("sub")
        token_type = payload.get("type")

        if not username:
            raise credentials_exception

        if token_type != "refresh":
            raise credentials_exception

        user = get_user_by_username(db, username)

        if not user:
            raise credentials_exception

        if not user.is_active:
            raise credentials_exception

        new_access_token = create_access_token(
            user_id=user.id,
            username=user.username,
            email=user.email,
            role=user.role or "user",
        )

        return {
            "access_token": new_access_token,
            "token_type": "bearer",
        }

    except JWTError:
        raise credentials_exception


# =========================================================
# GET USER BY ID
# =========================================================


@router.get("/user/{user_id}")
def get_user(
    user_id: int,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: db_dependency,
):

    current_user_id = current_user.get("id")
    current_role = str(current_user.get("role", "")).strip().lower()

    # User can only see their own profile.
    # Admin can see any user.
    if current_role != "admin" and current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    user = db.query(users).filter(users.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "role": user.role or "user",
        "is_active": user.is_active,
    }
