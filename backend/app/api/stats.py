from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schema.stats import TopClientResponse, TopPropertyResponse, TopRealEstateResponse
from app.service import listing_service

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get(
    "/top-clients",
    response_model=list[TopClientResponse],
)
def top_clients(db: Session = Depends(get_db)):
    return listing_service.get_stats_top_clients(db)


@router.get(
    "/top-properties",
    response_model=list[TopPropertyResponse],
)
def top_properties(db: Session = Depends(get_db)):
    return listing_service.get_stats_top_properties(db)


@router.get(
    "/top-real-estates",
    response_model=list[TopRealEstateResponse],
)
def top_real_estates(db: Session = Depends(get_db)):
    return listing_service.get_stats_top_real_estates(db)
