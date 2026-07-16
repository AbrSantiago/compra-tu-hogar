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
        Property(
            address="Alsina 430",
            location="Banfield",
            type=PropertyType.APARTMENT,
            characteristics="1 dormitorio, luminoso",
        ),
        Property(
            address="Peron 3300",
            location="Adrogue",
            type=PropertyType.HOUSE,
            characteristics="Pileta, 3 dormitorios",
        ),
        Property(
            address="Alem 60",
            location="Lomas de Zamora",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes, cochera",
        ),
        Property(
            address="Independencia 900",
            location="Quilmes",
            type=PropertyType.HOUSE,
            characteristics="4 ambientes, patio",
        ),
        Property(
            address="9 de Julio 1500",
            location="Avellaneda",
            type=PropertyType.APARTMENT,
            characteristics="3 ambientes, balcon",
        ),

        Property(
            address="Moreno 780",
            location="CABA",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes, apto profesional",
        ),
        Property(
            address="Cabildo 2900",
            location="CABA",
            type=PropertyType.APARTMENT,
            characteristics="3 ambientes, balcon terraza",
        ),
        Property(
            address="Av. Directorio 1450",
            location="CABA",
            type=PropertyType.HOUSE,
            characteristics="PH 3 ambientes, patio",
        ),
        Property(
            address="Colon 610",
            location="La Plata",
            type=PropertyType.HOUSE,
            characteristics="4 ambientes, garage doble",
        ),
        Property(
            address="Rivadavia 340",
            location="Quilmes",
            type=PropertyType.APARTMENT,
            characteristics="Monoambiente, a estrenar",
        ),
        Property(
            address="Hipolito Yrigoyen 2200",
            location="Avellaneda",
            type=PropertyType.HOUSE,
            characteristics="3 dormitorios, parrilla",
        ),
        Property(
            address="Pavon 980",
            location="Lanus",
            type=PropertyType.HOUSE,
            characteristics="Casa quinta, gran terreno",
        ),
        Property(
            address="Guemes 1150",
            location="Berazategui",
            type=PropertyType.APARTMENT,
            characteristics="2 dormitorios, cochera",
        ),
        Property(
            address="Lavalle 500",
            location="Temperley",
            type=PropertyType.HOUSE,
            characteristics="4 ambientes, pileta",
        ),
        Property(
            address="Falucho 300",
            location="Lomas de Zamora",
            type=PropertyType.APARTMENT,
            characteristics="3 ambientes, cochera cubierta",
        ),
        Property(
            address="Diagonal 74 1200",
            location="Banfield",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes, vista abierta",
        ),
        Property(
            address="Espora 450",
            location="Adrogue",
            type=PropertyType.HOUSE,
            characteristics="Chalet 4 ambientes",
        ),
    ]

    db.add_all(properties)
    db.commit()