from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.model.admin import Admin
from app.model.user import User


def create_default_admin(db: Session) -> None:
    admin = db.query(User).filter(User.email == "root@test.com").first()

    if admin:
        return

    admin = Admin(
        name="root",
        email="root@test.com",
        password=hash_password("123456"),
    )
    admin2 = Admin(
        name="admin",
        email="admin@test.com",
        password=hash_password("123456"),
    )

    db.add(admin)
    db.add(admin2)
    db.commit()
