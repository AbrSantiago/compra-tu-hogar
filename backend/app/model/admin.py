from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.model.user import User


class Admin(User):
    __tablename__ = "admins"

    id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "admin",
    }
