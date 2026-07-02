from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import require_admin
from app.core.database import get_db
from app.model.admin import Admin
from app.schema.admin import AdminCreate, AdminUpdate
from app.service import admin_service

router = APIRouter(
    prefix="/admins",
    tags=["admins"],
)


@router.post("/")
def create_admin(
    admin: AdminCreate,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return admin_service.create_admin(
        db=db,
        admin_data=admin,
    )


@router.get("/")
def get_admins(
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return admin_service.get_admins(db)


@router.get("/{admin_id}")
def get_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return admin_service.get_admin(
        db=db,
        admin_id=admin_id,
    )


@router.put("/{admin_id}")
def update_admin(
    admin_id: int,
    admin_data: AdminUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return admin_service.update_admin(
        db=db,
        admin_id=admin_id,
        admin_data=admin_data,
    )


@router.delete("/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return admin_service.delete_admin(
        db=db,
        admin_id=admin_id,
    )
