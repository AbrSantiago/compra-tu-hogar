from sqlalchemy.orm import Session

from app.seeds.admin_seed import create_default_admin


def run_seeds(db: Session) -> None:
    create_default_admin(db)
    # create_users(db)
    # create_prpoerties(db)
    # create_listings(db)
    # create_favs(db)
