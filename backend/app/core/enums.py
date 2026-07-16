import enum


class ListingStatus(enum.Enum):
    ACTIVE = "active"
    RESERVED = "reserved"
    SOLD = "sold"
    PAUSED = "paused"


class PropertyType(enum.Enum):
    HOUSE = "house"
    APARTMENT = "apartment"
