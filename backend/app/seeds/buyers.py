from sqlalchemy.orm import Session

from app.model.client import Client
from app.model.listing import Listing
from app.schema.listing import ListingStatus


def create_demo_buyers(db: Session) -> None:
    sold_listings = db.query(Listing).filter(Listing.status == ListingStatus.SOLD).order_by(Listing.id).all()

    clients = db.query(Client).order_by(Client.id).all()

    if len(sold_listings) < 3 or len(clients) < 2:
        return

    sold_listings[0].buyer_id = clients[0].id
    sold_listings[1].buyer_id = clients[0].id
    sold_listings[2].buyer_id = clients[1].id

    db.commit()
