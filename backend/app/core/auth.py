from typing import Union

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.model.admin import Admin
from app.model.client import Client
from app.model.real_estate import RealEstate
from app.model.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_access_token(token)

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user = db.get(User, int(user_id))

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


def require_admin(
    current_user: User = Depends(get_current_user),
) -> Admin:
    if not isinstance(current_user, Admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


def require_client(
    current_user: User = Depends(get_current_user),
) -> Client:
    if not isinstance(current_user, Client):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Client access required",
        )

    return current_user


def require_real_estate(
    current_user: User = Depends(get_current_user),
) -> RealEstate:
    if not isinstance(current_user, RealEstate):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Real estate access required",
        )

    return current_user


def require_admin_or_owner(
    current_user: User,
    resource_owner_id: int,
) -> User:
    is_admin = isinstance(current_user, Admin)
    is_owner = current_user.id == resource_owner_id

    if not (is_admin or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )

    return current_user

def require_admin_or_real_estate(
    current_user: User = Depends(get_current_user),
) -> Union[Admin, RealEstate]:
    if not (isinstance(current_user, Admin) or isinstance(current_user, RealEstate)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or Real estate access required",
        )

    return current_user