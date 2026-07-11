import uuid

from fastapi import APIRouter, Depends, HTTPException

from app.database import db
from app.models import CategoryIn
from app.security import now_iso, require_admin, slugify

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("")
async def list_categories():
    return await db.categories.find({}, {"_id": 0}).sort("name", 1).to_list(500)


@router.post("")
async def create_category(body: CategoryIn, user: dict = Depends(require_admin)):
    slug = slugify(body.name)
    if await db.categories.find_one({"slug": slug}):
        raise HTTPException(status_code=400, detail="Category exists")
    doc = {"id": str(uuid.uuid4()), "name": body.name, "slug": slug,
           "description": body.description or "", "created_at": now_iso()}
    await db.categories.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.put("/{cat_id}")
async def update_category(cat_id: str, body: CategoryIn, user: dict = Depends(require_admin)):
    upd = {"name": body.name, "slug": slugify(body.name), "description": body.description or ""}
    await db.categories.update_one({"id": cat_id}, {"$set": upd})
    return {"ok": True}


@router.delete("/{cat_id}")
async def delete_category(cat_id: str, user: dict = Depends(require_admin)):
    await db.categories.delete_one({"id": cat_id})
    return {"ok": True}
