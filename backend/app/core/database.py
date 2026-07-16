# app/core/database.py

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import DATABASE_URL


class Base(DeclarativeBase):
    pass


engine = None
SessionLocal = None

if DATABASE_URL is not None:
    engine = create_engine(
        DATABASE_URL,
        pool_size=int(os.getenv("DB_POOL_SIZE", 5)),
        max_overflow=int(os.getenv("DB_MAX_OVERFLOW", 10)),
        pool_timeout=30,
        pool_pre_ping=True,
    )

    SessionLocal = sessionmaker(bind=engine)


def get_db():
    if SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not set in .env")

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
