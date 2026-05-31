# app/schema/client.py

from pydantic import BaseModel, EmailStr


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
