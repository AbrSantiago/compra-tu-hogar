from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.model.client import Client
from app.model.favorite import Favorite
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


def add_to_favorites(
    db: Session,
    client_id: int,
    listing_id: int,
):
    get_client(
        db=db,
        client_id=client_id,
    )

    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=404,
            detail="Publicación no encontrada",
        )

    existing_favorite = (
        db.query(Favorite)
        .filter_by(
            client_id=client_id,
            listing_id=listing_id,
        )
        .first()
    )

    if existing_favorite is None:
        db.add(
            Favorite(
                client_id=client_id,
                listing_id=listing_id,
            )
        )
        db.commit()

    return {
        "message": "Agregado a favoritos",
    }


def remove_from_favorites(
    db: Session,
    client_id: int,
    listing_id: int,
):
    get_client(
        db=db,
        client_id=client_id,
    )

    favorite = (
        db.query(Favorite)
        .filter_by(
            client_id=client_id,
            listing_id=listing_id,
        )
        .first()
    )

    if favorite is not None:
        db.delete(favorite)
        db.commit()

    return {
        "message": "Eliminado de favoritos",
    }


def get_favorites(
    db: Session,
    client_id: int,
):
    get_client(
        db=db,
        client_id=client_id,
    )

    favorites = db.query(Favorite).filter_by(client_id=client_id).all()

    favorite_ids = [favorite.listing_id for favorite in favorites]

    if not favorite_ids:
        return []

    return db.query(Listing).filter(Listing.id.in_(favorite_ids)).all()
