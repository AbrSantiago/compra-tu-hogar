from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.model.user import User

if TYPE_CHECKING:
    from app.model.listing import Listing


class Client(User):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    surname: Mapped[str] = mapped_column(String, nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": "client",
    }

    purchased_listings: Mapped[list["Listing"]] = relationship(
        back_populates="buyer",
    )
