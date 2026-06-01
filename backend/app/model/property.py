import enum

from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class PropertyType(enum.Enum):
    HOUSE = "house"
    APARTMENT = "apartment"
    LAND = "land"


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True)

    property_id: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False,
    )

    address: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    type: Mapped[PropertyType] = mapped_column(
        Enum(PropertyType),
        nullable=False,
    )

    characteristics: Mapped[str] = mapped_column(
        String,
        nullable=True,
    )
