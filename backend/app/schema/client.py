# app/schema/client.py

from pydantic import BaseModel, ConfigDict, EmailStr


class ClientCreate(BaseModel):
    name: str
    surname: str
    email: EmailStr
    password: str


class ClientUpdate(BaseModel):
    name: str | None = None
    surname: str | None = None
    email: EmailStr | None = None
    password: str | None = None


class ClientResponse(BaseModel):
    id: int
    name: str
    surname: str
    email: EmailStr
    type: str

    model_config = ConfigDict(from_attributes=True)
