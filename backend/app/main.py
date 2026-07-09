# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.admin import router as admin_router
from app.api.auth import router as auth_router
from app.api.client import router as client_router
from app.api.listing import router as real_estate_router
from app.api.propertiy import router as property_router
from app.api.real_estate import router as listing_router
from app.core.database import Base, SessionLocal, engine
from app.seeds.seed import run_seeds


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_seeds(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Compra tu Hogar API",
    lifespan=lifespan,
)

Instrumentator().instrument(app).expose(app)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:30173",
    "http://127.0.0.1:30173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(client_router)
app.include_router(real_estate_router)
app.include_router(property_router)
app.include_router(listing_router)


@app.get("/")
def read_root():
    return {"message": "Compra tu Hogar backend is running"}