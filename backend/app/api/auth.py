from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.model.user import User
from app.schema.auth import LoginRequest
from app.schema.client import ClientCreate
from app.service import auth_service

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/register")
def register(
    client: ClientCreate,
    db: Session = Depends(get_db),
):
    return auth_service.register(
        db=db,
        client_data=client,
    )


@router.post("/login")
def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db),
):
    return auth_service.login(
        db=db,
        login_request=login_request,
    )


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
