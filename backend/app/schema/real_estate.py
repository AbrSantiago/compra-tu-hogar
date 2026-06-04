from pydantic import BaseModel, EmailStr


class RealEstateCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class RealEstateUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    password: str | None = None


class RealEstateResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    type: str

    class Config:
        from_attributes = True
