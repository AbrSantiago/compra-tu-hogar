# app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.api.client import router as client_router
from app.core.database import Base, engine

from app.model.user import User
from app.model.client import Client


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown


app = FastAPI(
    title="Compra tu Hogar API",
    lifespan=lifespan
)

app.include_router(client_router)


@app.get("/")
def read_root():
    return {"message": "Compra tu Hogar backend is running"}