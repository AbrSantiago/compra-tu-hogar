# app/api/client.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, require_admin, require_admin_or_owner
from app.core.database import get_db
from app.core.security import hash_password
from app.model.admin import Admin
from app.model.client import Client
from app.model.listing import Listing
from app.model.user import User
from app.schema.client import ClientUpdate
from app.schema.listing import ListingResponse

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("/")
def get_clients(
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return db.query(Client).all()


@router.get("/{client_id}")
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
    current_user: User = Depends(get_current_user),
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found",
        )

    require_admin_or_owner(
        current_user,
        client.id,
    )

    return client


@router.put("/{client_id}")
def update_client(
    client_id: int,
    client_data: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found",
        )

    require_admin_or_owner(
        current_user,
        client.id,
    )

    if client_data.name is not None:
        client.name = client_data.name

    if client_data.surname is not None:
        client.surname = client_data.surname

    if client_data.email is not None:
        client.email = client_data.email

    if client_data.password is not None:
        client.password = hash_password(client_data.password)

    db.commit()
    db.refresh(client)

    return client


@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found",
        )

    db.delete(client)
    db.commit()

    return {"message": "Client deleted"}


@router.get(
    "/{client_id}/purchases",
    response_model=list[ListingResponse],
)
def get_purchased_properties(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = db.get(Client, client_id)

    if client is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found",
        )

    require_admin_or_owner(
        current_user,
        client.id,
    )

    return db.query(Listing).filter(Listing.buyer_id == client_id).all()
