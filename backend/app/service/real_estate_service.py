from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.model.client import Client
from app.model.listing import Listing
from app.model.real_estate import RealEstate
from app.model.user import User
from app.schema.listing import ListingStatus
from app.schema.real_estate import (
    RealEstateCreate,
    RealEstateUpdate,
)


def create_real_estate(
    db: Session,
    real_estate_data: RealEstateCreate,
):
    existing_user = db.query(User).filter(User.email == real_estate_data.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    real_estate = RealEstate(
        name=real_estate_data.name,
        email=real_estate_data.email,
        password=hash_password(real_estate_data.password),
    )

    db.add(real_estate)
    db.commit()
    db.refresh(real_estate)

    return real_estate


def get_real_estates(db: Session):
    return db.query(RealEstate).order_by(RealEstate.id.asc()).all()


def get_real_estate(
    db: Session,
    real_estate_id: int,
):
    real_estate = db.query(RealEstate).filter(RealEstate.id == real_estate_id).first()

    if real_estate is None:
        raise HTTPException(
            status_code=404,
            detail="Real estate not found",
        )

    return real_estate


def update_real_estate(
    db: Session,
    real_estate_id: int,
    real_estate_data: RealEstateUpdate,
):
    real_estate = get_real_estate(
        db=db,
        real_estate_id=real_estate_id,
    )

    if real_estate_data.name is not None:
        real_estate.name = real_estate_data.name

    if real_estate_data.email is not None:
        real_estate.email = real_estate_data.email

    if real_estate_data.password is not None:
        real_estate.password = hash_password(
            real_estate_data.password,
        )

    db.commit()
    db.refresh(real_estate)

    return real_estate


def delete_real_estate(
    db: Session,
    real_estate_id: int,
):
    real_estate = get_real_estate(
        db=db,
        real_estate_id=real_estate_id,
    )

    db.delete(real_estate)
    db.commit()

    return {
        "message": "Real estate deleted",
    }


def get_sales_by_real_estate(db: Session, real_estate_id: int):
    return (
        db.query(Listing).filter(Listing.real_estate_id == real_estate_id, Listing.status == ListingStatus.SOLD).all()
    )


def get_clients_by_real_estate(db: Session, real_estate_id: int):
    return (
        db.query(Client)
        .join(Listing, Client.id == Listing.buyer_id)
        .filter(
            Listing.real_estate_id == real_estate_id,
            Listing.buyer_id.isnot(None),
        )
        .distinct()
        .all()
    )
