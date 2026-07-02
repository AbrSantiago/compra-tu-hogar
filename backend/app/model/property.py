# model/property.py

from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.model.listing import Listing
from app.schema.property import PropertyType


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True)

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

    listings: Mapped[list[Listing]] = relationship(
        back_populates="property",
    )
