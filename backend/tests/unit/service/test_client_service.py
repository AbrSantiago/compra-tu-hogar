from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException

from app.schema.client import ClientUpdate
from app.service import client_service


def test_get_client_returns_client():
    db = MagicMock()
    client = MagicMock()

    (db.query.return_value.filter.return_value.first.return_value) = client

    result = client_service.get_client(db, 1)

    assert result == client


def test_get_client_not_found():
    db = MagicMock()

    (db.query.return_value.filter.return_value.first.return_value) = None

    with pytest.raises(HTTPException) as exc:
        client_service.get_client(db, 1)

    assert exc.value.status_code == 404
    assert exc.value.detail == "Client not found"


@patch("app.service.client_service.hash_password")
@patch("app.service.client_service.get_client")
def test_update_client(mock_get_client, mock_hash_password):
    db = MagicMock()
    client = MagicMock()

    mock_get_client.return_value = client
    mock_hash_password.return_value = "hashed-password"

    client_data = ClientUpdate(
        name="John",
        surname="Doe",
        email="john@test.com",
        password="1234",
    )

    result = client_service.update_client(
        db=db,
        client_id=1,
        client_data=client_data,
    )

    assert result == client

    assert client.name == "John"
    assert client.surname == "Doe"
    assert client.email == "john@test.com"
    assert client.password == "hashed-password"

    mock_get_client.assert_called_once_with(
        db=db,
        client_id=1,
    )

    mock_hash_password.assert_called_once_with("1234")

    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(client)


@patch("app.service.client_service.get_client")
def test_update_client_only_updates_provided_fields(mock_get_client):
    db = MagicMock()
    client = MagicMock()

    client.name = "Old name"
    client.surname = "Old surname"
    client.email = "old@test.com"
    client.password = "old-password"

    mock_get_client.return_value = client

    client_data = ClientUpdate()

    client_service.update_client(
        db=db,
        client_id=1,
        client_data=client_data,
    )

    assert client.name == "Old name"
    assert client.surname == "Old surname"
    assert client.email == "old@test.com"
    assert client.password == "old-password"

    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(client)


@patch("app.service.client_service.get_client")
def test_delete_client(mock_get_client):
    db = MagicMock()
    client = MagicMock()

    mock_get_client.return_value = client

    result = client_service.delete_client(
        db=db,
        client_id=1,
    )

    assert result == {"message": "Client deleted"}

    mock_get_client.assert_called_once_with(
        db=db,
        client_id=1,
    )

    db.delete.assert_called_once_with(client)
    db.commit.assert_called_once()


@patch("app.service.client_service.get_client")
def test_get_purchased_properties(mock_get_client):
    db = MagicMock()

    listings = [MagicMock(), MagicMock()]

    mock_get_client.return_value = MagicMock()

    (db.query.return_value.filter.return_value.all.return_value) = listings

    result = client_service.get_purchased_properties(
        db=db,
        client_id=1,
    )

    assert result == listings

    mock_get_client.assert_called_once_with(
        db=db,
        client_id=1,
    )
