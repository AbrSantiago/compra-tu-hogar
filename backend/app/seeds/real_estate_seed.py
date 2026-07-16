from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.model.real_estate import RealEstate


def create_demo_real_estates(db: Session) -> None:
    existing = db.query(RealEstate).filter(RealEstate.email == "remax@test.com").first()

    if existing:
        return

    real_estates = [
        "Remax",
        "Century",
        "Nativa",
        "Delta",
        "Sur",
        "Inmobiliaria Norte",
        "Horizonte",
        "Open House",
        "Altos",
        "Urbania",
    ]

    for name in real_estates:
        db.add(
            RealEstate(
                name=name,
                email=f"{name.lower()}@test.com",
                password=hash_password("123456"),
            )
        )

    db.commit()
