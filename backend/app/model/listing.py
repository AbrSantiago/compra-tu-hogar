from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Enum, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.schema.listing import ListingStatus

if TYPE_CHECKING:
    from app.model.property import Property
    from app.model.real_estate import RealEstate


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(primary_key=True)

    property_id: Mapped[int] = mapped_column(
        ForeignKey("properties.id"),
        nullable=False,
    )

    real_estate_id: Mapped[int] = mapped_column(
        ForeignKey("real_estates.id"),
        nullable=False,
    )

    price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    status: Mapped[ListingStatus] = mapped_column(
        Enum(ListingStatus),
        nullable=False,
        default=ListingStatus.ACTIVE,
    )

    listed_property: Mapped[Property] = relationship(back_populates="listings")

    real_estate: Mapped[RealEstate] = relationship(back_populates="listings")

    __table_args__ = (
        UniqueConstraint(
            "property_id",
            "real_estate_id",
            name="uq_property_real_estate",
        ),
    )
