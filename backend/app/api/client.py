from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import (
    get_current_user,
    require_admin,
    require_admin_or_owner,
)
from app.core.database import get_db
from app.schema.client import ClientResponse, ClientUpdate
from app.schema.common import MessageResponse
from app.schema.listing import ListingResponse
from app.service import client_service

if TYPE_CHECKING:
    from app.model.admin import Admin
    from app.model.user import User

router = APIRouter(
    prefix="/clients",
    tags=["clients"],
)


@router.get(
    "/",
    response_model=list[ClientResponse],
)
def get_clients(
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return client_service.get_clients(db)


@router.get(
    "/{client_id}",
    response_model=ClientResponse,
)
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(current_user, client_id)

    return client_service.get_client(
        db=db,
        client_id=client_id,
    )


@router.put(
    "/{client_id}",
    response_model=ClientResponse,
)
def update_client(
    client_id: int,
    client_data: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(current_user, client_id)

    return client_service.update_client(
        db=db,
        client_id=client_id,
        client_data=client_data,
    )


@router.delete(
    "/{client_id}",
    response_model=MessageResponse,
)
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
    require_admin_or_owner(current_user, client_id)

    return client_service.get_purchased_properties(
        db=db,
        client_id=client_id,
    )


@router.post(
    "/{client_id}/favorites/{listing_id}",
    response_model=MessageResponse,
)
def add_to_favorites(
    client_id: int,
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(current_user, client_id)

    return client_service.add_to_favorites(
        db=db,
        client_id=client_id,
        listing_id=listing_id,
    )


@router.delete(
    "/{client_id}/favorites/{listing_id}",
    response_model=MessageResponse,
)
def remove_from_favorites(
    client_id: int,
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(current_user, client_id)

    return client_service.remove_from_favorites(
        db=db,
        client_id=client_id,
        listing_id=listing_id,
    )


@router.get(
    "/{client_id}/favorites",
    response_model=list[ListingResponse],
)
def get_favorites(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(current_user, client_id)

    return client_service.get_favorites(
        db=db,
        client_id=client_id,
    )
