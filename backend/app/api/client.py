# app/api/client.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password
from app.model.client import Client
from app.schema.client import ClientCreate, ClientUpdate

router = APIRouter(prefix="/clients", tags=["clients"])


@router.post("/")
def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db),
):
    new_client = Client(
        name=client.name,
        surname=client.surname,
        email=client.email,
        password=hash_password(client.password),
    )

    db.add(new_client)
    db.commit()
    db.refresh(new_client)

    return new_client


@router.get("/")
def get_clients(
    db: Session = Depends(get_db),
):
    return db.query(Client).all()


@router.get("/{client_id}")
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found",
        )

    return client


@router.put("/{client_id}")
def update_client(
    client_id: int,
    client_data: ClientUpdate,
    db: Session = Depends(get_db),
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found",
        )

    if client_data.name is not None:
        client.name = client_data.name

    if client_data.surname is not None:
        client.surname = client_data.surname

    if client_data.email is not None:
        client.email = client_data.email

    if client_data.password is not None:
        client.password = hash_password(client_data.password)

    db.commit()
    db.refresh(client)

    return client


@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
):
    client = db.query(Client).filter(Client.id == client_id).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found",
        )

    db.delete(client)
    db.commit()

    return {"message": "Client deleted"}
