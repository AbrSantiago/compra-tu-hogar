from sqlalchemy.orm import Session

from app.model.property import Property
from app.schema.property import PropertyType


def create_demo_properties(db: Session) -> None:
    existing = db.query(Property).filter(Property.address == "Av. Corrientes 1234").first()

    if existing:
        return

    # >30 props
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
        Property(
            address="Hipolito Yrigoyen 3200",
            location="Avellaneda",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes, balcon",
        ),
        Property(
            address="Italia 845",
            location="Quilmes",
            type=PropertyType.HOUSE,
            characteristics="4 ambientes, patio",
        ),
        Property(
            address="Alsina 1430",
            location="Lanus",
            type=PropertyType.APARTMENT,
            characteristics="3 ambientes, cochera",
        ),
        Property(
            address="Diagonal 115 980",
            location="Berazategui",
            type=PropertyType.HOUSE,
            characteristics="Jardin y parrilla",
        ),
        Property(
            address="9 de Julio 540",
            location="Florencio Varela",
            type=PropertyType.HOUSE,
            characteristics="3 dormitorios, patio",
        ),
        Property(
            address="Monteagudo 1275",
            location="Temperley",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes luminoso",
        ),
        Property(
            address="Colombres 620",
            location="Lomas de Zamora",
            type=PropertyType.HOUSE,
            characteristics="5 ambientes, cochera doble",
        ),
        Property(
            address="French 890",
            location="Banfield",
            type=PropertyType.APARTMENT,
            characteristics="1 dormitorio, balcon",
        ),
        Property(
            address="Alem 1320",
            location="Adrogue",
            type=PropertyType.HOUSE,
            characteristics="4 ambientes, jardin",
        ),
        Property(
            address="Pueyrredon 470",
            location="Burzaco",
            type=PropertyType.HOUSE,
            characteristics="3 dormitorios, quincho",
        ),
        Property(
            address="Espora 2210",
            location="Rafael Calzada",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes, terraza",
        ),
        Property(
            address="25 de Mayo 315",
            location="Claypole",
            type=PropertyType.HOUSE,
            characteristics="Casa con fondo libre",
        ),
        Property(
            address="Lavalle 1880",
            location="Ezpeleta",
            type=PropertyType.APARTMENT,
            characteristics="3 ambientes reciclado",
        ),
        Property(
            address="Urquiza 760",
            location="Bernal",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes al frente",
        ),
        Property(
            address="Belgrano 2095",
            location="Dock Sud",
            type=PropertyType.HOUSE,
            characteristics="Lote amplio",
        ),
        Property(
            address="Rivadavia 1100",
            location="Sarandi",
            type=PropertyType.APARTMENT,
            characteristics="Monoambiente moderno",
        ),
        Property(
            address="Maipu 560",
            location="Wilde",
            type=PropertyType.HOUSE,
            characteristics="4 ambientes, patio",
        ),
        Property(
            address="Arieta 3250",
            location="San Justo",
            type=PropertyType.APARTMENT,
            characteristics="3 ambientes",
        ),
        Property(
            address="Almafuerte 1780",
            location="Ramos Mejia",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes con cochera",
        ),
        Property(
            address="Moreno 940",
            location="Moron",
            type=PropertyType.HOUSE,
            characteristics="4 ambientes reciclada",
        ),
        Property(
            address="Libertador 780",
            location="Haedo",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes",
        ),
        Property(
            address="Sarmiento 1660",
            location="Castelar",
            type=PropertyType.HOUSE,
            characteristics="3 dormitorios, jardin",
        ),
        Property(
            address="Roca 430",
            location="Ituzaingo",
            type=PropertyType.HOUSE,
            characteristics="Patio y cochera",
        ),
        Property(
            address="San Martin 1950",
            location="Merlo",
            type=PropertyType.APARTMENT,
            characteristics="2 ambientes",
        ),
        Property(
            address="Mitre 1235",
            location="San Miguel",
            type=PropertyType.HOUSE,
            characteristics="4 ambientes",
        ),
        Property(
            address="Rodriguez Pena 680",
            location="Jose C. Paz",
            type=PropertyType.HOUSE,
            characteristics="3 dormitorios",
        ),
        Property(
            address="Peron 1540",
            location="Tigre",
            type=PropertyType.APARTMENT,
            characteristics="Vista al rio, 2 ambientes",
        ),
        Property(
            address="Constitucion 290",
            location="San Fernando",
            type=PropertyType.HOUSE,
            characteristics="5 ambientes con pileta",
        ),
        Property(
            address="Independencia 870",
            location="Vicente Lopez",
            type=PropertyType.APARTMENT,
            characteristics="3 ambientes premium",
        ),
        Property(
            address="Alvear 415",
            location="Olivos",
            type=PropertyType.HOUSE,
            characteristics="Jardin, quincho y cochera",
        ),
    ]

    db.add_all(properties)
    db.commit()
