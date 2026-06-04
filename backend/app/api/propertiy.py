from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import require_admin, require_real_estate
from app.core.database import get_db
from app.model.property import Property
from app.model.user import User
from app.schema.property import (
    PropertyCreate,
    PropertyResponse,
    PropertyUpdate,
)

router = APIRouter(
    prefix="/properties",
    tags=["Properties"],
)


@router.get("/", response_model=list[PropertyResponse])
def get_properties(
    db: Session = Depends(get_db),
):
    return db.query(Property).all()


@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(
    property_id: int,
    db: Session = Depends(get_db),
):
    property_obj = db.get(Property, property_id)

    if property_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    return property_obj


@router.post(
    "/",
    response_model=PropertyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_real_estate),
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


@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_real_estate),
):
    property_obj = db.get(Property, property_id)

    if property_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    update_data = property_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(property_obj, field, value)

    db.commit()
    db.refresh(property_obj)

    return property_obj


@router.delete(
    "/{property_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    property_obj = db.get(Property, property_id)

    if property_obj is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    db.delete(property_obj)
    db.commit()
