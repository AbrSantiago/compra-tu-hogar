from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException

from app.schema.listing import (
    ListingCreate,
    ListingStatus,
    ListingUpdate,
)
from app.service import listing_service


def test_get_listing_returns_listing():
    db = MagicMock()
    listing = MagicMock()

    (db.query.return_value.options.return_value.filter.return_value.first.return_value) = listing

    result = listing_service.get_listing(db, 1)

    assert result == listing


def test_get_listing_not_found():
    db = MagicMock()

    (db.query.return_value.options.return_value.filter.return_value.first.return_value) = None

    with pytest.raises(HTTPException) as exc:
        listing_service.get_listing(db, 1)

    assert exc.value.status_code == 404
    assert exc.value.detail == "Listing not found"


@patch("app.service.listing_service.Listing")
def test_create_listing(mock_listing):
    db = MagicMock()

    db.get.return_value = MagicMock()

    (db.query.return_value.filter.return_value.first.return_value) = None

    listing = MagicMock()
    mock_listing.return_value = listing

    data = ListingCreate(
        property_id=1,
        price=250000,
    )

    result = listing_service.create_listing(
        db=db,
        listing_data=data,
        real_estate_id=5,
    )

    assert result == listing

    db.add.assert_called_once_with(listing)
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(listing)


def test_create_listing_property_not_found():
    db = MagicMock()

    db.get.return_value = None

    data = ListingCreate(
        property_id=1,
        price=1000,
    )

    with pytest.raises(HTTPException) as exc:
        listing_service.create_listing(
            db=db,
            listing_data=data,
            real_estate_id=1,
        )

    assert exc.value.status_code == 404


def test_create_listing_already_exists():
    db = MagicMock()

    db.get.return_value = MagicMock()

    (db.query.return_value.filter.return_value.first.return_value) = MagicMock()

    data = ListingCreate(
        property_id=1,
        price=1000,
    )

    with pytest.raises(HTTPException) as exc:
        listing_service.create_listing(
            db=db,
            listing_data=data,
            real_estate_id=1,
        )

    assert exc.value.status_code == 409


def test_update_listing():
    db = MagicMock()

    listing = MagicMock()

    db.get.side_effect = [
        listing,
    ]

    data = ListingUpdate(
        price=300000,
        status=ListingStatus.SOLD,
    )

    result = listing_service.update_listing(
        db=db,
        listing_id=1,
        listing_data=data,
    )

    assert result == listing

    assert listing.price == 300000
    assert listing.status == ListingStatus.SOLD

    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(listing)


def test_update_listing_not_found():
    db = MagicMock()

    db.get.return_value = None

    with pytest.raises(HTTPException):
        listing_service.update_listing(
            db=db,
            listing_id=1,
            listing_data=ListingUpdate(),
        )


def test_update_listing_property_not_found():
    db = MagicMock()

    listing = MagicMock()

    db.get.side_effect = [
        listing,
        None,
    ]

    with pytest.raises(HTTPException) as exc:
        listing_service.update_listing(
            db=db,
            listing_id=1,
            listing_data=ListingUpdate(property_id=99),
        )

    assert exc.value.status_code == 404


def test_delete_listing():
    db = MagicMock()

    listing = MagicMock()

    db.get.return_value = listing

    listing_service.delete_listing(db, 1)

    db.delete.assert_called_once_with(listing)
    db.commit.assert_called_once()


def test_delete_listing_not_found():
    db = MagicMock()

    db.get.return_value = None

    with pytest.raises(HTTPException):
        listing_service.delete_listing(db, 1)


def test_purchase_listing():
    db = MagicMock()

    listing = MagicMock()
    listing.status = ListingStatus.ACTIVE

    client = MagicMock()

    db.get.return_value = listing

    result = listing_service.purchase_listing(
        db=db,
        listing_id=1,
        client=client,
    )

    assert result == listing
    assert listing.status == ListingStatus.SOLD
    assert listing.buyer == client

    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(listing)


def test_purchase_listing_not_found():
    db = MagicMock()

    db.get.return_value = None

    with pytest.raises(HTTPException):
        listing_service.purchase_listing(
            db=db,
            listing_id=1,
            client=MagicMock(),
        )


def test_purchase_listing_not_available():
    db = MagicMock()

    listing = MagicMock()
    listing.status = ListingStatus.SOLD

    db.get.return_value = listing

    with pytest.raises(HTTPException) as exc:
        listing_service.purchase_listing(
            db=db,
            listing_id=1,
            client=MagicMock(),
        )

    assert exc.value.status_code == 409
