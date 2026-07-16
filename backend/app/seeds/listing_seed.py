from sqlalchemy.orm import Session

from app.model.client import Client
from app.model.listing import Listing
from app.model.property import Property
from app.model.real_estate import RealEstate
from app.schema.listing import ListingStatus


def create_demo_listings(db: Session) -> None:
    existing = db.query(Listing).first()
    if existing:
        return
    properties = db.query(Property).all()
    real_estates = db.query(RealEstate).all()
    clients = db.query(Client).all()
    if len(properties) < 30 or len(real_estates) < 10 or len(clients) < 2:
        return

    listings = [
        Listing(property_id=properties[0].id, real_estate_id=real_estates[0].id, price=120000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[1].id, real_estate_id=real_estates[1].id, price=95000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[2].id, real_estate_id=real_estates[2].id, price=180000, status=ListingStatus.RESERVED),
        Listing(property_id=properties[3].id, real_estate_id=real_estates[3].id, price=210000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[4].id, real_estate_id=real_estates[4].id, price=85000, status=ListingStatus.PAUSED),
        Listing(property_id=properties[8].id, real_estate_id=real_estates[2].id, price=95000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[8].id, real_estate_id=real_estates[3].id, price=230000, status=ListingStatus.RESERVED),
        Listing(property_id=properties[11].id, real_estate_id=real_estates[0].id, price=75000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[11].id, real_estate_id=real_estates[6].id, price=135000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[12].id, real_estate_id=real_estates[1].id, price=190000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[12].id, real_estate_id=real_estates[7].id, price=89000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[14].id, real_estate_id=real_estates[3].id, price=300000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[14].id, real_estate_id=real_estates[9].id, price=156000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[16].id, real_estate_id=real_estates[5].id, price=245000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[17].id, real_estate_id=real_estates[2].id, price=92000, status=ListingStatus.PAUSED),
        Listing(property_id=properties[18].id, real_estate_id=real_estates[7].id, price=132000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[19].id, real_estate_id=real_estates[9].id, price=285000, status=ListingStatus.ACTIVE),
        Listing(property_id=properties[5].id, real_estate_id=real_estates[0].id, price=160000, status=ListingStatus.SOLD, buyer_id=clients[0].id),
        Listing(property_id=properties[6].id, real_estate_id=real_estates[1].id, price=145000, status=ListingStatus.SOLD, buyer_id=clients[1].id),
        Listing(property_id=properties[7].id, real_estate_id=real_estates[2].id, price=98000, status=ListingStatus.SOLD, buyer_id=clients[2].id),
        Listing(property_id=properties[9].id, real_estate_id=real_estates[0].id, price=142000, status=ListingStatus.SOLD, buyer_id=clients[10].id),
        Listing(property_id=properties[10].id, real_estate_id=real_estates[0].id, price=76000, status=ListingStatus.SOLD, buyer_id=clients[11].id),
        Listing(property_id=properties[13].id, real_estate_id=real_estates[0].id, price=265000, status=ListingStatus.SOLD, buyer_id=clients[12].id),
        Listing(property_id=properties[15].id, real_estate_id=real_estates[0].id, price=118000, status=ListingStatus.SOLD, buyer_id=clients[12].id),
    ]
    db.add_all(listings)
    db.commit()
