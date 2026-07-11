"""FastAPI application entrypoint.

Run locally with:
    uvicorn app.main:app --reload --port 8000

To add a new feature area:
    1. Add schemas to app/models.py
    2. Add a router in app/routers/
    3. Register it below with app.include_router(...)
"""
import logging

from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import close_db_connection, create_indexes
from app.routers import admin, auth, banners, categories, collections, offers, products, uploads
from app.routers import settings_router
from app.seed import run_all as seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=f"{settings.APP_NAME} API")

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(categories.router)
api_router.include_router(collections.router)
api_router.include_router(offers.router)
api_router.include_router(banners.router)
api_router.include_router(settings_router.router)
api_router.include_router(uploads.router)
api_router.include_router(admin.router)


@api_router.get("/")
async def root():
    return {"service": f"{settings.APP_NAME} API", "status": "ok"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await create_indexes()
    await seed_database()
    logger.info("Startup complete.")


@app.on_event("shutdown")
async def on_shutdown():
    await close_db_connection()
