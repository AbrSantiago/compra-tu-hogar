from fastapi.testclient import TestClient  # noqa: F401, I001


def test_register_client(client):
    response = client.post(
        "/auth/register",
        json={
            "name": "Santi",
            "surname": "Abregu",
            "email": "santi@test.com",
            "password": "123456",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["email"] == "santi@test.com"
    assert body["type"] == "client"


def test_login(client):
    client.post(
        "/auth/register",
        json={
            "name": "Santi",
            "surname": "Abregu",
            "email": "santi@test.com",
            "password": "123456",
        },
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "santi@test.com",
            "password": "123456",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert "access_token" in body


def test_create_property(client, real_estate_token):
    response = client.post(
        "/properties",
        headers={
            "Authorization": f"Bearer {real_estate_token}",
        },
        json={
            "address": "Calle 123",
            "location": "Quilmes",
            "type": "house",
            "characteristics": "3 ambientes",
        },
    )

    assert response.status_code == 201

    assert response.json()["address"] == "Calle 123"


def test_get_property(client, property_id):
    response = client.get(f"/properties/{property_id}")

    assert response.status_code == 200


def test_create_listing(
    client,
    property_id,
    real_estate_token,
):
    response = client.post(
        "/listings",
        headers={
            "Authorization": f"Bearer {real_estate_token}",
        },
        json={
            "property_id": property_id,
            "price": 250000,
            "status": "active",
        },
    )

    assert response.status_code == 201


def test_purchase_listing(
    client,
    listing_id,
    client_token,
):
    response = client.post(
        f"/listings/{listing_id}/purchase",
        headers={
            "Authorization": f"Bearer {client_token}",
        },
    )

    assert response.status_code == 200

    assert response.json()["status"] == "sold"


def test_get_purchases(
    client,
    client_id,
    client_token,
):
    response = client.get(
        f"/clients/{client_id}/purchases",
        headers={
            "Authorization": f"Bearer {client_token}",
        },
    )

    assert response.status_code == 200

    assert len(response.json()) == 1


def test_cannot_purchase_twice(
    client,
    listing_id,
    client_token,
):
    client.post(
        f"/listings/{listing_id}/purchase",
        headers={
            "Authorization": f"Bearer {client_token}",
        },
    )

    response = client.post(
        f"/listings/{listing_id}/purchase",
        headers={
            "Authorization": f"Bearer {client_token}",
        },
    )

    assert response.status_code == 409


def test_client_cannot_create_property(
    client,
    client_token,
):
    response = client.post(
        "/properties",
        headers={
            "Authorization": f"Bearer {client_token}",
        },
        json={
            "address": "abc",
            "location": "abc",
            "type": "house",
            "characteristics": "",
        },
    )

    assert response.status_code == 403


def test_requires_auth(client):
    response = client.post(
        "/properties",
        json={
            "address": "abc",
            "location": "abc",
            "type": "house",
            "characteristics": "",
        },
    )

    assert response.status_code == 401
