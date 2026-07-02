from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import (
    get_current_user,
    require_admin,
    require_admin_or_owner,
)
from app.core.database import get_db
from app.model.admin import Admin
from app.model.user import User
from app.schema.client import ClientUpdate
from app.schema.listing import ListingResponse
from app.service import client_service

router = APIRouter(
    prefix="/clients",
    tags=["clients"],
)


@router.get("/")
def get_clients(
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return client_service.get_clients(db)


@router.get("/{client_id}")
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(
        current_user,
        client_id,
    )

    return client_service.get_client(
        db=db,
        client_id=client_id,
    )


@router.put("/{client_id}")
def update_client(
    client_id: int,
    client_data: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(
        current_user,
        client_id,
    )

    return client_service.update_client(
        db=db,
        client_id=client_id,
        client_data=client_data,
    )


@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return client_service.delete_client(
        db=db,
        client_id=client_id,
    )


@router.get(
    "/{client_id}/purchases",
    response_model=list[ListingResponse],
)
def get_purchased_properties(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(
        current_user,
        client_id,
    )

    return client_service.get_purchased_properties(
        db=db,
        client_id=client_id,
    )
