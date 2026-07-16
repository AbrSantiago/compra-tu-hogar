from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import (
    get_current_user,
    require_admin,
    require_admin_or_owner,
)
from app.core.database import get_db
from app.model.admin import Admin
from app.model.favorite import Favorite
from app.model.listing import Listing
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


@router.post("/{client_id}/favorites/{listing_id}")
def add_to_favorites(
    client_id: int,
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(current_user, client_id)
    
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")

    existing_fav = db.query(Favorite).filter_by(client_id=client_id, listing_id=listing_id).first()
    if not existing_fav:
        new_fav = Favorite(client_id=client_id, listing_id=listing_id)
        db.add(new_fav)
        db.commit()

    return {"status": "success", "message": "Agregado a favoritos"}


@router.delete("/{client_id}/favorites/{listing_id}")
def remove_from_favorites(
    client_id: int,
    listing_id: int,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(current_user, client_id)
    
    existing_fav = db.query(Favorite).filter_by(client_id=client_id, listing_id=listing_id).first()
    if existing_fav:
        db.delete(existing_fav)
        db.commit()
        
    return {"status": "success", "message": "Eliminado de favoritos"}


@router.get("/{client_id}/favorites", response_model=list[ListingResponse])
def get_favorites(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(current_user, client_id)
    
    favorites = db.query(Favorite).filter_by(client_id=client_id).all()
    fav_ids = [fav.listing_id for fav in favorites]
    
    if not fav_ids:
        return []
        
    return db.query(Listing).filter(Listing.id.in_(fav_ids)).all()