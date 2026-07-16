from sqlalchemy.orm import Session

from app.seeds.admin_seed import create_default_admin
from app.seeds.client_seed import create_demo_clients
from app.seeds.listing_seed import create_demo_listings
from app.seeds.property_seed import create_demo_properties
from app.seeds.real_estate_seed import create_demo_real_estates
from app.seeds.review_seed import create_demo_reviews


def run_seeds(db: Session) -> None:
    create_default_admin(db)
    create_demo_clients(db)
    create_demo_real_estates(db)
    create_demo_properties(db)
    create_demo_listings(db)
    create_demo_reviews(db)