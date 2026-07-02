# app/core/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import DATABASE_URL


class Base(DeclarativeBase):
    pass


SessionLocal = None

if DATABASE_URL is not None:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)


def get_db():
    if SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not set in .env")

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
