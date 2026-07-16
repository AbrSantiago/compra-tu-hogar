from pydantic import BaseModel, ConfigDict, EmailStr


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    type: str

    model_config = ConfigDict(from_attributes=True)
