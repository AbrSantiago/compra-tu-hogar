from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import require_admin
from app.core.database import get_db
from app.core.security import hash_password
from app.model.admin import Admin
from app.model.user import User
from app.schema.admin import AdminCreate, AdminUpdate

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
    existing_user = db.query(User).filter(User.email == admin.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    new_admin = Admin(
        name=admin.name,
        email=admin.email,
        password=hash_password(admin.password),
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {
        "id": new_admin.id,
        "name": new_admin.name,
        "email": new_admin.email,
        "type": new_admin.type,
    }


@router.get("/")
def get_admins(
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    return db.query(Admin).all()


@router.get("/{admin_id}")
def get_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    return admin


@router.put("/{admin_id}")
def update_admin(
    admin_id: int,
    admin_data: AdminUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    if admin_data.name is not None:
        admin.name = admin_data.name

    if admin_data.email is not None:
        admin.email = admin_data.email

    if admin_data.password is not None:
        admin.password = hash_password(admin_data.password)

    db.commit()
    db.refresh(admin)

    return admin


@router.delete("/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    _: Admin = Depends(require_admin),
):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    db.delete(admin)
    db.commit()

    return {"message": "Admin deleted"}
