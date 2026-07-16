from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=0, le=10, description="Puntaje de 0 a 10")
    comment: str | None = Field(default=None, max_length=500, description="Observación opcional")


class ReviewResponse(BaseModel):
    id: int
    client_id: int
    listing_id: int
    rating: int
    comment: str | None
    client_name: str

    model_config = ConfigDict(from_attributes=True)
