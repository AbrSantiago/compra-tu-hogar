from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.model.admin import Admin
from app.model.user import User
from app.schema.admin import AdminCreate, AdminUpdate


def create_admin(
    db: Session,
    admin_data: AdminCreate,
):
    existing_user = db.query(User).filter(User.email == admin_data.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    admin = Admin(
        name=admin_data.name,
        email=admin_data.email,
        password=hash_password(admin_data.password),
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return {
        "id": admin.id,
        "name": admin.name,
        "email": admin.email,
        "type": admin.type,
    }


def get_admins(db: Session):
    return db.query(Admin).order_by(Admin.id.asc()).all()


def get_admin(
    db: Session,
    admin_id: int,
):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()

    if admin is None:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    return admin


def update_admin(
    db: Session,
    admin_id: int,
    admin_data: AdminUpdate,
):
    admin = get_admin(
        db=db,
        admin_id=admin_id,
    )

    if admin_data.name is not None:
        admin.name = admin_data.name

    if admin_data.email is not None:
        admin.email = admin_data.email

    if admin_data.password is not None:
        admin.password = hash_password(
            admin_data.password,
        )

    db.commit()
    db.refresh(admin)

    return admin


def delete_admin(
    db: Session,
    admin_id: int,
):
    admin = get_admin(
        db=db,
        admin_id=admin_id,
    )

    db.delete(admin)
    db.commit()

    return {
        "message": "Admin deleted",
    }
