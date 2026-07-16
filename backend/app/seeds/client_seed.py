from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.model.client import Client


def create_demo_clients(db: Session) -> None:
    existing = db.query(Client).filter(Client.email == "ana@test.com").first()

    if existing:
        return

    clients = [
        ("Ana", "Perez"),
        ("Juan", "Gomez"),
        ("Luis", "Diaz"),
        ("Jose", "Lopez"),
        ("Mara", "Ruiz"),
        ("Leo", "Torres"),
        ("Luca", "Sosa"),
        ("Eva", "Ramos"),
        ("Tomi", "Suarez"),
        ("Nico", "Acosta"),
        ("Sofi", "Castro"),
        ("Lara", "Vega"),
        ("Dani", "Mendez"),
        ("Noe", "Silva"),
        ("Pablo", "Ferreyra"),
        ("Mili", "Rojas"),
        ("Cami", "Navarro"),
        ("Gabi", "Medina"),
        ("Ivan", "Herrera"),
        ("Emma", "Flores"),
        ("Bruno", "Benitez"),
        ("Valen", "Ortiz"),
        ("Agus", "Morales"),
        ("Facu", "Paz"),
        ("Marti", "Romero"),
        ("Julieta", "Cabrera"),
        ("Thiago", "Peralta"),
        ("Bianca", "Ibarra"),
        ("Renzo", "Campos"),
        ("Candela", "Godoy"),
        ("Franco", "Aguirre"),
        ("Malena", "Correa"),
        ("Bautista", "Luna"),
        ("Valentina", "Molina"),
        ("Federico", "Quiroga"),
        ("Rocio", "Ponce"),
        ("Benjamin", "Nuñez"),
        ("Zoe", "Cardozo"),
        ("Joaquin", "Alvarez"),
        ("Lucia", "Villalba"),
    ]

    for name, surname in clients:
        db.add(
            Client(
                name=name,
                surname=surname,
                email=f"{name.lower()}@test.com",
                password=hash_password("123456"),
            )
        )

    db.commit()
