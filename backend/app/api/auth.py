from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.schema.auth import LoginRequest, TokenResponse
from app.schema.client import ClientCreate, ClientResponse
from app.schema.user import UserResponse
from app.service import auth_service

if TYPE_CHECKING:
    from app.model.user import User

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post(
    "/register",
    response_model=ClientResponse,
)
def register(
    client: ClientCreate,
    db: Session = Depends(get_db),
):
    logger.info(
        "Registration attempt for %s",
        client.email,
    )

    result = auth_service.register(
        db=db,
        client_data=client,
    )

    logger.info(
        "User %s registered successfully",
        client.email,
    )

    return result


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db),
):
    logger.info(
        "Login attempt for %s",
        login_request.email,
    )

    result = auth_service.login(
        db=db,
        login_request=login_request,
    )

    logger.info(
        "User %s logged in successfully",
        login_request.email,
    )

    return result


@router.get(
    "/me",
    response_model=UserResponse,
)
def me(
    current_user: User = Depends(get_current_user),
):
    logger.info(
        "User %s (ID: %s) requested profile information.",
        current_user.email,
        current_user.id,
    )

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "type": current_user.type,
    }
