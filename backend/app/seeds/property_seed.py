from sqlalchemy.orm import Session

from app.model.property import Property
from app.schema.property import PropertyType


def create_demo_properties(db: Session) -> None:
    existing = db.query(Property).filter(Property.address == "Av. Corrientes 1234").first()

    if existing:
        return

    properties = [
        Property(
            address="Av. Corrientes 1234",
            location="CABA",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes, 55m2",
        ),
        Property(
            address="Av. Santa Fe 2500",
            location="CABA",
            type=PropertyType.APARTMENT,
            characteristics="3 ambientes, 70m2",
        ),
        Property(
            address="Av. Rivadavia 8000",
            location="CABA",
            type=PropertyType.HOUSE,
            characteristics="4 ambientes, cochera",
        ),
        Property(
            address="Calle 12 345",
            location="La Plata",
            type=PropertyType.HOUSE,
            characteristics="Patio y quincho",
        ),
        Property(
            address="Mitre 890",
            location="Quilmes",
            type=PropertyType.APARTMENT,
            characteristics="Monoambiente",
        ),
        Property(
            address="Belgrano 150",
            location="Avellaneda",
            type=PropertyType.HOUSE,
            characteristics="3 dormitorios",
        ),
        Property(
            address="San Martin 500",
            location="Lanus",
            type=PropertyType.HOUSE,
            characteristics="Jardin amplio",
        ),
        Property(
            address="Brown 1200",
            location="Berazategui",
            type=PropertyType.APARTMENT,
            characteristics="Balcon al frente",
        ),
        Property(
            address="Las Heras 750",
            location="Temperley",
            type=PropertyType.HOUSE,
            characteristics="5 ambientes",
        ),
        Property(
            address="Sarmiento 2100",
            location="Lomas de Zamora",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes reciclado",
        ),
    ]

    db.add_all(properties)
    db.commit()
