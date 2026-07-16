from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import (
    get_current_user,
    require_admin,
    require_admin_or_owner,
)
from app.core.database import get_db
from app.model.user import User
from app.schema.common import MessageResponse
from app.schema.real_estate import (
    RealEstateCreate,
    RealEstateResponse,
    RealEstateUpdate,
)
from app.service import real_estate_service

router = APIRouter(
    prefix="/real-estates",
    tags=["real-estates"],
)


@router.post("/", response_model=RealEstateResponse)
def create_real_estate(
    real_estate: RealEstateCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return real_estate_service.create_real_estate(
        db=db,
        real_estate_data=real_estate,
    )


@router.get("/", response_model=list[RealEstateResponse])
def get_real_estates(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return real_estate_service.get_real_estates(db)


@router.get("/{real_estate_id}", response_model=RealEstateResponse)
def get_real_estate(
    real_estate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(
        current_user,
        real_estate_id,
    )

    return real_estate_service.get_real_estate(
        db=db,
        real_estate_id=real_estate_id,
    )


@router.put("/{real_estate_id}", response_model=RealEstateResponse)
def update_real_estate(
    real_estate_id: int,
    real_estate_data: RealEstateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_owner(
        current_user,
        real_estate_id,
    )

    return real_estate_service.update_real_estate(
        db=db,
        real_estate_id=real_estate_id,
        real_estate_data=real_estate_data,
    )


@router.delete(
    "/{real_estate_id}",
    response_model=MessageResponse,
)
def delete_real_estate(
    real_estate_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return real_estate_service.delete_real_estate(
        db=db,
        real_estate_id=real_estate_id,
    )
