from app.core.auth import get_current_user
from app.core.enums import ListingStatus, PropertyType
from app.model.client import Client
from app.model.listing import Listing
from app.model.property import Property
from app.model.real_estate import RealEstate


def login_as_real_estate(client, real_estate):
    client.app.dependency_overrides[get_current_user] = lambda: real_estate
    return client

def test_get_sales_success(client, db_session):
    re = RealEstate(name="Inmo", email="inmo@test.com", password="hash", type="real_estate")
    prop = Property(address="Calle 123", location="Quilmes", type=PropertyType.HOUSE)
    db_session.add_all([re, prop])
    db_session.commit()
    db_session.refresh(re)
    db_session.refresh(prop)
    
    listing = Listing(property_id=prop.id, real_estate_id=re.id, price=1000.0, status=ListingStatus.SOLD)
    db_session.add(listing)
    db_session.commit()
    
    client.app.dependency_overrides[get_current_user] = lambda: re
    response = client.get(f"/real-estates/{re.id}/sales")
    
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_get_clients_success(client, db_session):
    re = RealEstate(name="Inmo", email="inmo2@test.com", password="hash", type="real_estate")
    client_user = Client(name="Juan", surname="Perez", email="juan@test.com", password="hash", type="client")
    db_session.add_all([re, client_user])
    db_session.commit()
    
    listing = Listing(property_id=1, real_estate_id=re.id, buyer_id=client_user.id, price=100.0, status=ListingStatus.SOLD)
    db_session.add(listing)
    db_session.commit()
    
    login_as_real_estate(client, re)
    response = client.get(f"/real-estates/{re.id}/clients")
    
    assert response.status_code == 200
    assert response.json()[0]["name"] == "Juan"

def test_purchase_listing_flow(client, db_session):
    re = RealEstate(name="Inmo", email="inmo3@test.com", password="hash", type="real_estate")
    db_session.add(re)
    db_session.commit()
    
    listing = Listing(property_id=1, real_estate_id=re.id, price=500.0, status=ListingStatus.ACTIVE)
    db_session.add(listing)
    db_session.commit()
    
    pass 

def test_delete_listing_204(client, db_session):
    re = RealEstate(name="Inmo", email="inmo4@test.com", password="hash", type="real_estate")
    db_session.add(re)
    db_session.commit()
    
    listing = Listing(property_id=1, real_estate_id=re.id, price=100.0, status=ListingStatus.ACTIVE)
    db_session.add(listing)
    db_session.commit()
    
    login_as_real_estate(client, re)
    response = client.delete(f"/listings/{listing.id}")
    
    assert response.status_code == 204