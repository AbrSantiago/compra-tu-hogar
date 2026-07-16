import logging
from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.auth import require_client, require_real_estate
from app.core.database import get_db
from app.schema.common import MessageResponse
from app.schema.listing import (
    ListingCreate,
    ListingResponse,
    ListingUpdate,
)
from app.schema.review import ReviewCreate, ReviewResponse
from app.service import listing_service

if TYPE_CHECKING:
    from app.model.client import Client
    from app.model.real_estate import RealEstate

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
    logger.info(
        "Real estate ID %s creating listing",
        real_estate.id,
    )

    result = listing_service.create_listing(
        db=db,
        listing_data=listing_data,
        real_estate_id=real_estate.id,
    )

    logger.info(
        "Listing created successfully. ID: %s",
        result.id,
    )

    return result


@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_data: ListingUpdate,
    db: Session = Depends(get_db),
    real_estate: RealEstate = Depends(require_real_estate),
):
    logger.info(
        "Real estate ID %s updating listing %s",
        real_estate.id,
        listing_id,
    )

    return listing_service.update_listing(
        db=db,
        listing_id=listing_id,
        listing_data=listing_data,
    )


@router.delete(
    "/{listing_id}",
    response_model=MessageResponse,
)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    real_estate: RealEstate = Depends(require_real_estate),
):
    logger.info(
        "Real estate ID %s deleting listing %s",
        real_estate.id,
        listing_id,
    )

    return listing_service.delete_listing(
        db=db,
        listing_id=listing_id,
    )


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
        "Client ID %s purchasing listing %s",
        client.id,
        listing_id,
    )

    return listing_service.purchase_listing(
        db=db,
        listing_id=listing_id,
        client=client,
    )


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
    logger.info(
        "Client ID %s reviewing listing %s",
        client.id,
        listing_id,
    )

    return listing_service.add_review(
        db=db,
        listing_id=listing_id,
        review_data=review_data,
        client=client,
    )
