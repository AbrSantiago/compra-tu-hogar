from sqlalchemy.orm import Session

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

    if len(properties) < 10 or len(real_estates) < 5:
        return

    listings = [
        Listing(
            property_id=properties[0].id,
            real_estate_id=real_estates[0].id,
            price=120000,
            status=ListingStatus.ACTIVE,
        ),
        Listing(
            property_id=properties[1].id,
            real_estate_id=real_estates[1].id,
            price=95000,
            status=ListingStatus.ACTIVE,
        ),
        Listing(
            property_id=properties[2].id,
            real_estate_id=real_estates[2].id,
            price=180000,
            status=ListingStatus.RESERVED,
        ),
        Listing(
            property_id=properties[3].id,
            real_estate_id=real_estates[3].id,
            price=210000,
            status=ListingStatus.ACTIVE,
        ),
        Listing(
            property_id=properties[4].id,
            real_estate_id=real_estates[4].id,
            price=85000,
            status=ListingStatus.PAUSED,
        ),
        Listing(
            property_id=properties[5].id,
            real_estate_id=real_estates[0].id,
            price=160000,
            status=ListingStatus.SOLD,
        ),
    ]

    db.add_all(listings)
    db.commit()
