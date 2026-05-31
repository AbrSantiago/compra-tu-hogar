import enum

from sqlalchemy import Enum, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class PropertyType(enum.Enum):
    HOUSE = "house"
    APARTMENT = "apartment"
    LAND = "land"


class PropertyStatus(enum.Enum):
    AVAILABLE = "available"
    SOLD = "sold"
    RENTED = "rented"


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True)
    property_id: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    address: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str] = mapped_column(String, nullable=False)

    type: Mapped[PropertyType] = mapped_column(Enum(PropertyType), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)

    status: Mapped[PropertyStatus] = mapped_column(Enum(PropertyStatus), nullable=False)

    characteristics: Mapped[str] = mapped_column(String)
