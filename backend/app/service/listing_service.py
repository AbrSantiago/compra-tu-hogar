from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.core.enums import PropertyType
from app.model.client import Client
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


def get_listings(
    db: Session,
    zone: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    property_type: PropertyType | None = None,
):
    query = db.query(Listing).join(Property)

    if zone:
        query = query.filter(Property.location.ilike(f"%{zone}%"))

    if min_price is not None:
        query = query.filter(Listing.price >= min_price)

    if max_price is not None:
        query = query.filter(Listing.price <= max_price)

    if property_type:
        query = query.filter(Property.type == property_type)

    return query.all()


def get_listing(
    db: Session,
    listing_id: int,
):
    listing = (
        db.query(Listing)
        .options(
            joinedload(Listing.property_),
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


def get_stats_top_clients(db: Session, limit: int = 5):
    """Usuarios con más compras."""
    results = (
        db.query(Client.name, Client.surname, func.count(Listing.id).label("total"))
        .join(Listing, Client.id == Listing.buyer_id)
        .filter(Listing.status == ListingStatus.SOLD)
        .group_by(Client.id, Client.name, Client.surname)
        .order_by(func.count(Listing.id).desc())
        .limit(limit)
        .all()
    )

    return [{"name": r.name, "surname": r.surname, "total": r.total} for r in results]


def get_stats_top_properties(db: Session, limit: int = 5):
    """Propiedades mejor rankeadas por promedio de reseñas."""
    results = (
        db.query(Property.address, func.avg(Review.rating).label("avg_rating"))
        .join(Listing, Property.id == Listing.property_id)
        .join(Review, Listing.id == Review.listing_id)
        .group_by(Property.id, Property.address)
        .order_by(func.avg(Review.rating).desc())
        .limit(limit)
        .all()
    )

    return [{"address": r.address, "total": round(r.avg_rating, 1)} for r in results]


def get_stats_top_real_estates(db: Session, limit: int = 5):
    """Inmobiliarias con más ventas."""
    results = (
        db.query(RealEstate.name, func.count(Listing.id).label("total"))
        .join(Listing, RealEstate.id == Listing.real_estate_id)
        .filter(Listing.status == ListingStatus.SOLD)
        .group_by(RealEstate.id, RealEstate.name)
        .order_by(func.count(Listing.id).desc())
        .limit(limit)
        .all()
    )

    return [{"name": r.name, "total": r.total} for r in results]
