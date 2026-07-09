from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.model.client import Client
    from app.model.listing import Listing


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False,
    )

    listing_id: Mapped[int] = mapped_column(
        ForeignKey("listings.id", ondelete="CASCADE"),
        nullable=False,
    )

    rating: Mapped[int] = mapped_column(nullable=False)
    
    comment: Mapped[str | None] = mapped_column(String, nullable=True)

    client: Mapped["Client"] = relationship()
    listing: Mapped["Listing"] = relationship(back_populates="reviews")

    @property
    def client_name(self) -> str:
        return self.client.name if self.client else "Usuario Anónimo"

    __table_args__ = (
        CheckConstraint(
            "rating >= 0 AND rating <= 10", 
            name="chk_rating_range"
        ),
        UniqueConstraint(
            "client_id",
            "listing_id",
            name="uq_review_client_listing",
        ),
    )