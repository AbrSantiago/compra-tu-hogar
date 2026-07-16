from pydantic import BaseModel, ConfigDict

from app.core.enums import ListingStatus
from app.schema.client import ClientResponse
from app.schema.property import PropertyResponse
from app.schema.real_estate import RealEstateResponse
from app.schema.review import ReviewResponse


class ListingCreate(BaseModel):
    property_id: int
    price: float
    status: ListingStatus = ListingStatus.ACTIVE


class ListingUpdate(BaseModel):
    property_id: int | None = None
    price: float | None = None
    status: ListingStatus | None = None


class ListingResponse(BaseModel):
    id: int
    price: float
    status: ListingStatus

    property: PropertyResponse
    real_estate: RealEstateResponse
    buyer: ClientResponse | None = None

    average_rating: float | None = None
    reviews: list[ReviewResponse] = []

    model_config = ConfigDict(from_attributes=True)
