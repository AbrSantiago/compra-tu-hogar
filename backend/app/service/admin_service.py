from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.core.security import hash_password
from app.model.admin import Admin
from app.model.favorite import Favorite
from app.model.listing import Listing
from app.model.property import Property
from app.model.review import Review
from app.model.user import User
from app.schema.admin import AdminCreate, AdminUpdate
from app.schema.listing import ListingStatus


def create_admin(
    db: Session,
    admin_data: AdminCreate,
):
    existing_user = db.query(User).filter(User.email == admin_data.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    admin = Admin(
        name=admin_data.name,
        email=admin_data.email,
        password=hash_password(admin_data.password),
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return {
        "id": admin.id,
        "name": admin.name,
        "email": admin.email,
        "type": admin.type,
    }


def get_admins(db: Session):
    return db.query(Admin).order_by(Admin.id.asc()).all()


def get_admin(
    db: Session,
    admin_id: int,
):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()

    if admin is None:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    return admin


def update_admin(
    db: Session,
    admin_id: int,
    admin_data: AdminUpdate,
):
    admin = get_admin(
        db=db,
        admin_id=admin_id,
    )

    if admin_data.name is not None:
        admin.name = admin_data.name

    if admin_data.email is not None:
        admin.email = admin_data.email

    if admin_data.password is not None:
        admin.password = hash_password(
            admin_data.password,
        )

    db.commit()
    db.refresh(admin)

    return admin


def delete_admin(
    db: Session,
    admin_id: int,
):
    admin = get_admin(
        db=db,
        admin_id=admin_id,
    )

    db.delete(admin)
    db.commit()

    return {
        "message": "Admin deleted",
    }


def get_properties_with_saves(db: Session):
    results = (
        db.query(
            Property.id,
            Property.address,
            Property.location,
            Property.type,
            func.count(Favorite.id).label("total_saves"),
        )
        .outerjoin(Listing, Property.id == Listing.property_id)
        .outerjoin(Favorite, Listing.id == Favorite.listing_id)
        .group_by(Property.id)
        .order_by(func.count(Favorite.id).desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "address": r.address,
            "location": r.location,
            "type": r.type.value,
            "total_saves": r.total_saves,
        }
        for r in results
    ]


def get_all_purchases(db: Session):
    return (
        db.query(Listing)
        .options(joinedload(Listing.property_), joinedload(Listing.buyer), joinedload(Listing.real_estate))
        .filter(Listing.status == ListingStatus.SOLD)
        .order_by(Listing.id.desc())
        .all()
    )


def get_all_listings_with_reviews(db: Session):
    avg_query = (
        db.query(Review.listing_id, func.avg(Review.rating).label("avg_r")).group_by(Review.listing_id).subquery()
    )

    results = (
        db.query(Listing, avg_query.c.avg_r)
        .outerjoin(avg_query, Listing.id == avg_query.c.listing_id)
        .options(
            joinedload(Listing.property_),
            joinedload(Listing.real_estate),
            joinedload(Listing.reviews).joinedload(Review.client),
        )
        .order_by(Listing.id.desc())
        .all()
    )

    listings = []
    for listing, avg_r in results:
        listing.average_rating = float(avg_r) if avg_r is not None else None
        listings.append(listing)

    return listings
