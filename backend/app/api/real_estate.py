from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import (
    get_current_user,
    require_admin,
    require_admin_or_owner,
)
from app.core.database import get_db
from app.core.security import hash_password
from app.model.real_estate import RealEstate
from app.model.user import User
from app.schema.real_estate import (
    RealEstateCreate,
    RealEstateResponse,
    RealEstateUpdate,
)

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
    existing_user = db.query(User).filter(User.email == real_estate.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    new_real_estate = RealEstate(
        name=real_estate.name,
        email=real_estate.email,
        password=hash_password(real_estate.password),
    )

    db.add(new_real_estate)
    db.commit()
    db.refresh(new_real_estate)

    return new_real_estate


@router.get("/", response_model=list[RealEstateResponse])
def get_real_estates(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return db.query(RealEstate).all()


@router.get("/{real_estate_id}", response_model=RealEstateResponse)
def get_real_estate(
    real_estate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    real_estate = db.query(RealEstate).filter(RealEstate.id == real_estate_id).first()

    if not real_estate:
        raise HTTPException(
            status_code=404,
            detail="Real estate not found",
        )

    require_admin_or_owner(
        current_user,
        real_estate.id,
    )

    return real_estate


@router.put("/{real_estate_id}", response_model=RealEstateResponse)
def update_real_estate(
    real_estate_id: int,
    real_estate_data: RealEstateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    real_estate = db.query(RealEstate).filter(RealEstate.id == real_estate_id).first()

    if not real_estate:
        raise HTTPException(
            status_code=404,
            detail="Real estate not found",
        )

    require_admin_or_owner(
        current_user,
        real_estate.id,
    )

    if real_estate_data.name is not None:
        real_estate.name = real_estate_data.name

    if real_estate_data.email is not None:
        real_estate.email = real_estate_data.email

    if real_estate_data.password is not None:
        real_estate.password = hash_password(real_estate_data.password)

    db.commit()
    db.refresh(real_estate)

    return real_estate


@router.delete("/{real_estate_id}")
def delete_real_estate(
    real_estate_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    real_estate = db.query(RealEstate).filter(RealEstate.id == real_estate_id).first()

    if not real_estate:
        raise HTTPException(
            status_code=404,
            detail="Real estate not found",
        )

    db.delete(real_estate)
    db.commit()

    return {"message": "Real estate deleted"}
