from pydantic import BaseModel, ConfigDict, EmailStr


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
