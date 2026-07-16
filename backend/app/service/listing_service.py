from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.model.listing import Listing
from app.model.property import Property
from app.model.real_estate import RealEstate
from app.model.review import Review
from app.schema.listing import (
    ListingCreate,
    ListingStatus,
    ListingUpdate,
)
from app.schema.review import ReviewCreate


def get_listings(db: Session):
    listings = (
        db.query(Listing)
        .options(
            joinedload(Listing.property),
            joinedload(Listing.real_estate),
            joinedload(Listing.buyer),
            joinedload(Listing.reviews).joinedload(Review.client),
        )
        .all()
    )

    results = []
    for listing in listings:
        listing_dict = listing.__dict__.copy()

        if listing.reviews:
            avg = round(sum(r.rating for r in listing.reviews) / len(listing.reviews), 1)
        else:
            avg = None

        listing_dict["average_rating"] = avg
        results.append(listing_dict)

    return results


def get_listing(
    db: Session,
    listing_id: int,
):
    listing = (
        db.query(Listing)
        .options(
            joinedload(Listing.property),
            joinedload(Listing.real_estate),
            joinedload(Listing.buyer),
            joinedload(Listing.reviews),
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


def create_listing(
    db: Session,
    listing_data: ListingCreate,
    real_estate_id: int,
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
            Listing.real_estate_id == real_estate_id,
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
        real_estate_id=real_estate_id,
        price=listing_data.price,
        status=listing_data.status,
    )

    db.add(listing)
    db.commit()
    db.refresh(listing)

    return listing


def update_listing(
    db: Session,
    listing_id: int,
    listing_data: ListingUpdate,
):
    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    update_data = listing_data.model_dump(exclude_unset=True)

    if "property_id" in update_data:
        if db.get(Property, update_data["property_id"]) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found",
            )

    if "real_estate_id" in update_data:
        if db.get(RealEstate, update_data["real_estate_id"]) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Real estate not found",
            )

    for field, value in update_data.items():
        setattr(listing, field, value)

    db.commit()
    db.refresh(listing)

    return listing


def delete_listing(
    db: Session,
    listing_id: int,
):
    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    db.delete(listing)
    db.commit()


def purchase_listing(
    db: Session,
    listing_id: int,
    client,
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


def add_review(
    db: Session,
    listing_id: int,
    review_data: ReviewCreate,
    client,
):
    listing = db.get(Listing, listing_id)

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    existing_review = (
        db.query(Review)
        .filter_by(
            client_id=client.id,
            listing_id=listing_id,
        )
        .first()
    )

    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya dejaste una reseña para esta propiedad anteriormente.",
        )

    review = Review(
        client_id=client.id,
        listing_id=listing_id,
        rating=review_data.rating,
        comment=review_data.comment,
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return {
        "id": review.id,
        "client_id": review.client_id,
        "listing_id": review.listing_id,
        "rating": review.rating,
        "comment": review.comment,
        "client_name": client.name,
    }
