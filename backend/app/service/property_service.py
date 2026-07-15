from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.model.property import Property
from app.schema.property import (
    PropertyCreate,
    PropertyUpdate,
)


def get_properties(db: Session):
    return db.query(Property).order_by(Property.id.asc()).all()


def get_property(
    db: Session,
    property_id: int,
):
    property_obj = db.get(Property, property_id)

    if property_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    return property_obj


def create_property(
    db: Session,
    property_data: PropertyCreate,
):
    property_obj = Property(
        address=property_data.address,
        location=property_data.location,
        type=property_data.type,
        characteristics=property_data.characteristics,
    )

    db.add(property_obj)
    db.commit()
    db.refresh(property_obj)

    return property_obj


def update_property(
    db: Session,
    property_id: int,
    property_data: PropertyUpdate,
):
    property_obj = get_property(
        db=db,
        property_id=property_id,
    )

    update_data = property_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(property_obj, field, value)

    db.commit()
    db.refresh(property_obj)

    return property_obj


def delete_property(
    db: Session,
    property_id: int,
):
    property_obj = get_property(
        db=db,
        property_id=property_id,
    )

    db.delete(property_obj)
    db.commit()
