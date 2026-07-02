from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.auth import require_client, require_real_estate
from app.core.database import get_db
from app.model.client import Client
from app.model.listing import Listing
from app.model.property import Property
from app.model.real_estate import RealEstate
from app.model.user import User
from app.schema.listing import (
    ListingCreate,
    ListingResponse,
    ListingStatus,
    ListingUpdate,
)

router = APIRouter(
    prefix="/listings",
    tags=["Listings"],
)


@router.get("/", response_model=list[ListingResponse])
def get_listings(
    db: Session = Depends(get_db),
):
    return (
        db.query(Listing)
        .options(
            joinedload(Listing.property),
            joinedload(Listing.real_estate),
            joinedload(Listing.buyer),
        )
        .all()
    )


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db),
):
    listing = (
        db.query(Listing)
        .options(
            joinedload(Listing.property),
            joinedload(Listing.real_estate),
            joinedload(Listing.buyer),
        )
        .filter(Listing.id == listing_id)
        .first()
    )

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    return listing


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
    property_obj = db.get(
        Property,
        listing_data.property_id,
    )

    if property_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    existing_listing = (
        db.query(Listing)
        .filter(
            Listing.property_id == listing_data.property_id,
            Listing.real_estate_id == real_estate.id,
        )
        .first()
    )

    if existing_listing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Listing already exists for this property and real estate",
        )

    listing = Listing(
        property_id=listing_data.property_id,
        real_estate_id=real_estate.id,
        price=listing_data.price,
        status=listing_data.status,
    )

    db.add(listing)
    db.commit()
    db.refresh(listing)

    return listing


@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_data: ListingUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_real_estate),
):
    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    update_data = listing_data.model_dump(exclude_unset=True)

    if "property_id" in update_data:
        property_obj = db.get(
            Property,
            update_data["property_id"],
        )

        if property_obj is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found",
            )

    if "real_estate_id" in update_data:
        real_estate = db.get(
            RealEstate,
            update_data["real_estate_id"],
        )

        if real_estate is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Real estate not found",
            )

    for field, value in update_data.items():
        setattr(listing, field, value)

    db.commit()
    db.refresh(listing)

    return listing


@router.delete(
    "/{listing_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_real_estate),
):
    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    db.delete(listing)
    db.commit()


@router.post(
    "/{listing_id}/purchase",
    response_model=ListingResponse,
)
def purchase_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    client: Client = Depends(require_client),
):
    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    if listing.status != ListingStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Listing is not available",
        )

    listing.status = ListingStatus.SOLD
    listing.buyer = client

    db.commit()
    db.refresh(listing)

    return listing
