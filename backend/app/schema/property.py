import enum

from pydantic import BaseModel, ConfigDict


class PropertyType(enum.Enum):
    HOUSE = "house"
    APARTMENT = "apartment"


class PropertyCreate(BaseModel):
    address: str
    location: str
    type: PropertyType
    characteristics: str | None = None


class PropertyResponse(BaseModel):
    id: int
    address: str
    location: str
    type: PropertyType
    characteristics: str | None = None

    model_config = ConfigDict(from_attributes=True)


class PropertyUpdate(BaseModel):
    address: str | None = None
    location: str | None = None
    type: PropertyType | None = None
    characteristics: str | None = None
