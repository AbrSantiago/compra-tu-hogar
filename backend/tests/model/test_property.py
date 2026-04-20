import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.model.property import Property, PropertyType, PropertyStatus


# ---------- Test DB setup ----------

@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:", echo=False)
    TestingSessionLocal = sessionmaker(bind=engine)

    Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()
    yield session

    session.close()


# ---------- Tests ----------

def test_create_property(db):
    property = Property(
        property_id="PROP001",
        address="123 Main St",
        location="Buenos Aires",
        type=PropertyType.HOUSE,
        price=150000.0,
        status=PropertyStatus.AVAILABLE,
        characteristics="wifi,pool,garage"
    )

    db.add(property)
    db.commit()
    db.refresh(property)

    assert property.id is not None
    assert property.property_id == "PROP001"
    assert property.address == "123 Main St"
    assert property.price == 150000.0


def test_query_property(db):
    property = Property(
        property_id="PROP002",
        address="456 Elm St",
        location="Cordoba",
        type=PropertyType.APARTMENT,
        price=90000.0,
        status=PropertyStatus.AVAILABLE,
        characteristics="balcony,air_conditioning"
    )

    db.add(property)
    db.commit()

    result = db.query(Property).first()

    assert result is not None
    assert result.property_id == "PROP002"
    assert result.type == PropertyType.APARTMENT