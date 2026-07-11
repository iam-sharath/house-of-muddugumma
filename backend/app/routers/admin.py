from fastapi import APIRouter, Depends

from app.database import db
from app.security import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
async def stats(user: dict = Depends(require_admin)):
    return {
        "products": await db.products.count_documents({}),
        "published": await db.products.count_documents({"status": "published"}),
        "categories": await db.categories.count_documents({}),
        "collections": await db.collections.count_documents({}),
        "offers": await db.offers.count_documents({}),
        "banners": await db.banners.count_documents({}),
    }
