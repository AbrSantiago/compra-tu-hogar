from pydantic import BaseModel


class TopClientResponse(BaseModel):
    name: str
    surname: str
    total: int


class TopPropertyResponse(BaseModel):
    address: str
    total: float


class TopRealEstateResponse(BaseModel):
    name: str
    total: int
