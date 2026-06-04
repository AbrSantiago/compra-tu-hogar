# model/real_estate.py

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.model.user import User

if TYPE_CHECKING:
    from app.model.listing import Listing


class RealEstate(User):
    __tablename__ = "real_estates"

    id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        primary_key=True,
    )

    listings: Mapped[list["Listing"]] = relationship(back_populates="real_estate")

    __mapper_args__ = {
        "polymorphic_identity": "real_estate",
    }
