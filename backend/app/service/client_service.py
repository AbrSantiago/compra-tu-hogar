from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.model.client import Client
from app.model.listing import Listing
from app.schema.client import ClientUpdate


def get_clients(db: Session):
    return db.query(Client).all()


def get_client(
    db: Session,
    client_id: int,
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if client is None:
        raise HTTPException(
            status_code=404,
            detail="Client not found",
        )

    return client


def update_client(
    db: Session,
    client_id: int,
    client_data: ClientUpdate,
):
    client = get_client(
        db=db,
        client_id=client_id,
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


def delete_client(
    db: Session,
    client_id: int,
):
    client = get_client(
        db=db,
        client_id=client_id,
    )

    db.delete(client)
    db.commit()

    return {"message": "Client deleted"}


def get_purchased_properties(
    db: Session,
    client_id: int,
):
    get_client(
        db=db,
        client_id=client_id,
    )

    return db.query(Listing).filter(Listing.buyer_id == client_id).all()
