# app/api/client.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.security import hash_password

from app.core.database import get_db
from app.model.client import Client
from app.schema.client import ClientCreate

router = APIRouter(prefix="/clients", tags=["clients"])


@router.post("/")
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    new_client = Client(
        name=client.name,
        surname=client.surname,
        email=client.email,
        password=hash_password(client.password),
    )

    db.add(new_client)
    db.commit()
    db.refresh(new_client)

    return {
        "id": new_client.id,
        "name": new_client.name,
        "surname": new_client.surname,
        "email": new_client.email,
        "type": new_client.type,
    }