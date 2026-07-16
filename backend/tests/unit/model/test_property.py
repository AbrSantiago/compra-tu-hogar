import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.model.property import Property, PropertyType

@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:", echo=False)
    TestingSessionLocal = sessionmaker(bind=engine)

    Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()
    yield session

    session.close()


def test_create_property(db):
    property = Property(
        address="123 Main St",
        location="Buenos Aires",
        type=PropertyType.HOUSE,
        characteristics="wifi,pool,garage",
    )

    db.add(property)
    db.commit()
    db.refresh(property)

    assert property.id is not None
    assert property.address == "123 Main St"
    assert property.type == PropertyType.HOUSE
    assert property.characteristics == "wifi,pool,garage"


def test_query_property(db):
    property = Property(
        address="456 Elm St",
        location="Cordoba",
        type=PropertyType.APARTMENT,
        characteristics="balcony,air_conditioning",
    )

    db.add(property)
    db.commit()

    result = db.query(Property).first()

    assert result is not None
    assert result.address == "456 Elm St"
    assert result.type == PropertyType.APARTMENT