from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.auth import require_admin, require_real_estate
from app.core.database import get_db
from app.model.user import User
from app.schema.property import (
    PropertyCreate,
    PropertyResponse,
    PropertyUpdate,
)
from app.service import property_service

router = APIRouter(
    prefix="/properties",
    tags=["Properties"],
)


@router.get("/", response_model=list[PropertyResponse])
def get_properties(
    db: Session = Depends(get_db),
):
    return property_service.get_properties(db)


@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(
    property_id: int,
    db: Session = Depends(get_db),
):
    return property_service.get_property(
        db=db,
        property_id=property_id,
    )


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
    return property_service.create_property(
        db=db,
        property_data=property_data,
    )


@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return property_service.update_property(
        db=db,
        property_id=property_id,
        property_data=property_data,
    )


@router.delete(
    "/{property_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    property_service.delete_property(
        db=db,
        property_id=property_id,
    )
