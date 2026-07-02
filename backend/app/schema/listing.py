import enum

from pydantic import BaseModel, ConfigDict

from app.schema.client import ClientResponse
from app.schema.property import PropertyResponse
from app.schema.real_estate import RealEstateResponse


class ListingStatus(enum.Enum):
    ACTIVE = "active"
    RESERVED = "reserved"
    SOLD = "sold"
    PAUSED = "paused"


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

    model_config = ConfigDict(from_attributes=True)
