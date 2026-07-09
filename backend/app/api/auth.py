import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.model.user import User
from app.schema.auth import LoginRequest
from app.schema.client import ClientCreate
from app.service import auth_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/register")
def register(
    client: ClientCreate,
    db: Session = Depends(get_db),
):
    logger.info(f"Intento de registro para el correo: {client.email}")
    try:
        result = auth_service.register(
            db=db,
            client_data=client,
        )
        logger.info(f"Usuario registrado con éxito: {client.email}")
        return result
    except Exception as e:
        logger.error(f"Fallo en el registro de {client.email}. Motivo: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db),
):
    logger.info(f"Intento de inicio de sesión para el correo: {login_request.email}")
    try:
        result = auth_service.login(
            db=db,
            login_request=login_request,
        )
        logger.info(f"Inicio de sesión exitoso para: {login_request.email}")
        return result
    except Exception as e:
        logger.error(f"Error de autenticación para {login_request.email}. Motivo: {str(e)}")
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")


@router.get("/me")
def me(
    current_user: User = Depends(get_current_user),
):
    logger.info(
    f"El usuario {current_user.email} (ID: {current_user.id}) "
    "solicitó sus datos de perfil."
)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "type": current_user.type,
    }