from __future__ import annotations

import builtins
from typing import TYPE_CHECKING

from sqlalchemy import Enum, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.enums import ListingStatus

if TYPE_CHECKING:
    from app.model.client import Client
    from app.model.favorite import Favorite
    from app.model.property import Property
    from app.model.real_estate import RealEstate
    from app.model.review import Review


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

    property: Mapped[Property] = relationship(
        back_populates="listings",
    )

    real_estate: Mapped[RealEstate] = relationship(back_populates="listings")

    buyer_id: Mapped[int | None] = mapped_column(
        ForeignKey("clients.id"),
        nullable=True,
    )

    buyer: Mapped[Client | None] = relationship(
        back_populates="purchased_listings",
    )

    favorited_by: Mapped[list["Favorite"]] = relationship(
        back_populates="listing",
        cascade="all, delete-orphan",
    )

    reviews: Mapped[list["Review"]] = relationship(
        back_populates="listing",
        cascade="all, delete-orphan",
    )

    @builtins.property
    def average_rating(self) -> float | None:
        """Calcula el promedio de puntaje basado en las reseñas."""
        if not self.reviews:
            return None
        return round(sum(r.rating for r in self.reviews) / len(self.reviews), 1)

    __table_args__ = (
        UniqueConstraint(
            "property_id",
            "real_estate_id",
            name="uq_property_real_estate",
        ),
    )
