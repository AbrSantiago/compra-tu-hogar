import pytest
from app.model.client import Client
from app.core.auth import get_current_user
from app.model.admin import Admin

def login_as_client(client, client_user):
    client.app.dependency_overrides[get_current_user] = lambda: client_user
    return client

def test_create_client_success(client, db_session):
    data = {
        "name": "Carlos",
        "surname": "Lopez",
        "email": "carlos@test.com",
        "password": "securepassword",
        "type": "client"
    }
    response = client.post("/auth/register", json=data) 
    assert response.status_code == 200
    
def test_get_client_profile_only_admin_can_view(client, db_session):
    admin = Admin(name="Admin", email="admin@test.com", password="hash", type="admin")
    c = Client(name="Ana", surname="Gomez", email="ana@test.com", password="hash", type="client")
    db_session.add_all([admin, c])
    db_session.commit()
    db_session.refresh(c)
    
    client.app.dependency_overrides[get_current_user] = lambda: admin
    
    response = client.get(f"/clients/{c.id}")
    
    assert response.status_code == 200
    assert response.json()["name"] == "Ana"
    
    client.app.dependency_overrides[get_current_user] = lambda: c
    response_forbidden = client.get(f"/clients/{c.id}")
    assert response_forbidden.status_code == 403

def test_update_client_profile(client, db_session):
    c = Client(name="Ana", surname="Gomez", email="ana@test.com", password="hash", type="client")
    db_session.add(c)
    db_session.commit()
    
    login_as_client(client, c)
    
    update_data = {"name": "Anabela"}
    response = client.put(f"/clients/{c.id}", json=update_data)
    
    assert response.status_code == 200
    assert response.json()["name"] == "Anabela"
    
    db_session.refresh(c)
    assert c.name == "Anabela"

def test_delete_client_forbidden_for_other_client(client, db_session):
    c1 = Client(name="Ana", surname="Gomez", email="ana@test.com", password="hash", type="client")
    c2 = Client(name="Bob", surname="Builder", email="bob@test.com", password="hash", type="client")
    db_session.add_all([c1, c2])
    db_session.commit()
    
    login_as_client(client, c1)
    response = client.delete(f"/clients/{c2.id}")
    
    assert response.status_code == 403