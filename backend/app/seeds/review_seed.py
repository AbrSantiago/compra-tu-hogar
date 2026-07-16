from sqlalchemy.orm import Session
from app.model.review import Review
from app.model.client import Client
from app.model.listing import Listing
import random

def create_demo_reviews(db: Session) -> None:
    if db.query(Review).first():
        return

    listings = db.query(Listing).all()
    clients = db.query(Client).all()

    if not listings or not clients:
        return

    comments = [
        "Excelente propiedad, la mejor que he visto.",
        "Muy buena ubicación y precio acorde.",
        "El estado del inmueble es impecable.",
        "La atención de la inmobiliaria fue muy buena.",
        "Un poco ruidosa la zona por la noche."
    ]

    unique_pairs = set()
    reviews = []

    while len(reviews) < 40:
        c = random.choice(clients)
        l = random.choice(listings)
        
        pair = (c.id, l.id)
        
        if pair not in unique_pairs:
            unique_pairs.add(pair)
            reviews.append(
                Review(
                    client_id=c.id,
                    listing_id=l.id,
                    rating=random.randint(3, 10),
                    comment=random.choice(comments)
                )
            )

    db.add_all(reviews)
    db.commit()