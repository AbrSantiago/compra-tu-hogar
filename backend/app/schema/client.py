# app/schema/client.py

from pydantic import BaseModel, EmailStr


class ClientCreate(BaseModel):
    name: str
    surname: str
    email: EmailStr
    password: str