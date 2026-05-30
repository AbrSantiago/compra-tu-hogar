from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.model.client import Client
from app.model.user import User
from app.schema.auth import LoginRequest
from app.schema.client import ClientCreate

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/register")
def register(
    client: ClientCreate,
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(User.email == client.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    new_client = Client(
        name=client.name,
        surname=client.surname,
        email=client.email,
        password=hash_password(client.password),
    )

    db.add(new_client)
    db.commit()
    db.refresh(new_client)

    return {
        "id": new_client.id,
        "name": new_client.name,
        "surname": new_client.surname,
        "email": new_client.email,
        "type": new_client.type,
    }


@router.post("/login")
def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == login_request.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not verify_password(
        login_request.password,
        user.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    access_token = create_access_token(
        user_id=user.id,
        user_type=user.type,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me")
def me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "type": current_user.type,
    }
