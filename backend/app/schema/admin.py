from pydantic import BaseModel, EmailStr


class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class AdminUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    password: str | None = None
