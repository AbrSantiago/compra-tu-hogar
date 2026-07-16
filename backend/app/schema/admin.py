from pydantic import BaseModel, ConfigDict, EmailStr

from app.core.enums import PropertyType


class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class AdminUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    password: str | None = None


class AdminResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    type: str

    model_config = ConfigDict(from_attributes=True)


class PropertySavesResponse(BaseModel):
    id: int
    address: str
    location: str
    type: PropertyType
    total_saves: int
