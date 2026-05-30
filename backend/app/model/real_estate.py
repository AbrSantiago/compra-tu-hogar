from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.model.user import User


class RealEstate(User):
    __tablename__ = "real_estates"

    id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "real_estate",
    }
