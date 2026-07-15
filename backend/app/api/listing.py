import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import require_admin_or_real_estate, require_client, require_real_estate
from app.core.database import get_db
from app.model.client import Client
from app.model.listing import Listing
from app.model.real_estate import RealEstate
from app.model.review import Review
from app.schema.listing import (
    ListingCreate,
    ListingResponse,
    ListingUpdate,
)
from app.schema.review import ReviewCreate, ReviewResponse
from app.service import listing_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/listings",
    tags=["Listings"],
)


@router.get("/", response_model=list[ListingResponse])
def get_listings(
    db: Session = Depends(get_db),
):
    return listing_service.get_listings(db)


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db),
):
    return listing_service.get_listing(
        db=db,
        listing_id=listing_id,
    )


@router.post(
    "/",
    response_model=ListingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_listing(
    listing_data: ListingCreate,
    db: Session = Depends(get_db),
    real_estate: RealEstate = Depends(require_real_estate),
):
    logger.info(f"Inmobiliaria ID {real_estate.id} intenta crear una publicación.")
    try:
        result = listing_service.create_listing(
            db=db,
            listing_data=listing_data,
            real_estate_id=real_estate.id,
        )
        logger.info(f"Publicación creada con éxito. ID asignado: {result.id}")
        return result
    except Exception as e:
        logger.error(
            f"Error al crear publicación para Inmobiliaria ID {real_estate.id}. "
            f"Motivo: {str(e)}"
        )
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_data: ListingUpdate,
    db: Session = Depends(get_db),
    real_estate: RealEstate = Depends(require_admin_or_real_estate),
):
    logger.info(
        f"Inmobiliaria ID {real_estate.id} intenta modificar "
        f"la publicación ID {listing_id}."
    )
    try:
        result = listing_service.update_listing(
            db=db,
            listing_id=listing_id,
            listing_data=listing_data,
        )
        logger.info(f"Publicación ID {listing_id} modificada con éxito.")
        return result
    except Exception as e:
        logger.error(
            f"Error al modificar la publicación ID {listing_id}. "
            f"Motivo: {str(e)}"
        )
        raise HTTPException(status_code=400, detail=str(e))


@router.delete(
    "/{listing_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    real_estate: RealEstate = Depends(require_admin_or_real_estate),
):
    logger.info(
        f"Inmobiliaria ID {real_estate.id} intenta eliminar "
        f"la publicación ID {listing_id}."
    )
    try:
        listing_service.delete_listing(
            db=db,
            listing_id=listing_id,
        )
        logger.info(f"Publicación ID {listing_id} eliminada con éxito.")
    except Exception as e:
        logger.error(
            f"Error al eliminar la publicación ID {listing_id}. "
            f"Motivo: {str(e)}"
        )
        raise HTTPException(status_code=400, detail=str(e))


@router.post(
    "/{listing_id}/purchase",
    response_model=ListingResponse,
)
def purchase_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    client: Client = Depends(require_client),
):
    logger.info(
        f"Cliente ID {client.id} ({client.email}) intenta comprar la "
        f"propiedad de la publicación ID {listing_id}."
    )
    try:
        result = listing_service.purchase_listing(
            db=db,
            listing_id=listing_id,
            client=client,
        )
        logger.info(
            f"Compra procesada con éxito para la publicación ID {listing_id} "
            f"por el Cliente ID {client.id}."
        )
        return result
    except Exception as e:
        logger.error(
            f"Error al procesar la compra de la publicación ID {listing_id} "
            f"para Cliente ID {client.id}. Motivo: {str(e)}"
        )
        raise HTTPException(status_code=400, detail=str(e))


@router.post(
    "/{listing_id}/reviews",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_review(
    listing_id: int,
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    client: Client = Depends(require_client),
):
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")

    existing_review = db.query(Review).filter_by(client_id=client.id, listing_id=listing_id).first()
    if existing_review:
        raise HTTPException(
            status_code=400, 
            detail="Ya dejaste una reseña para esta propiedad anteriormente."
        )
        
    try:
        new_review = Review(
            client_id=client.id,
            listing_id=listing_id,
            rating=review_data.rating,
            comment=review_data.comment
        )
        db.add(new_review)
        db.commit()
        db.refresh(new_review)
        
        logger.info(
            f"Cliente ID {client.id} puntuó la publicación ID {listing_id} "
            f"con un {review_data.rating}."
        )
        
        return {
            "id": new_review.id,
            "client_id": new_review.client_id,
            "listing_id": new_review.listing_id,
            "rating": new_review.rating,
            "comment": new_review.comment,
            "client_name": client.name
        }
        
    except Exception as e:
        logger.error(f"Error al guardar la reseña. Motivo: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))