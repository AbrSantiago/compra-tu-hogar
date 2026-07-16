from pydantic import BaseModel, ConfigDict


class FavoriteResponse(BaseModel):
    id: int
    client_id: int
    listing_id: int

    model_config = ConfigDict(from_attributes=True)