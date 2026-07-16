from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.model.client import Client
from app.model.user import User
from app.schema.auth import LoginRequest
from app.schema.client import ClientCreate


def register(
    db: Session,
    client_data: ClientCreate,
):
    existing_user = db.query(User).filter(User.email == client_data.email).first()

    if existing_user is not None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    client = Client(
        name=client_data.name,
        surname=client_data.surname,
        email=client_data.email,
        password=hash_password(client_data.password),
    )

    db.add(client)
    db.commit()
    db.refresh(client)

    return {
        "id": client.id,
        "name": client.name,
        "surname": client.surname,
        "email": client.email,
        "type": client.type,
    }


def login(
    db: Session,
    login_request: LoginRequest,
):
    user = db.query(User).filter(User.email == login_request.email).first()

    if user is None or not verify_password(
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
