import uuid

from fastapi import APIRouter, Depends, HTTPException

from app.database import db
from app.models import CollectionIn
from app.security import now_iso, require_admin, slugify

router = APIRouter(prefix="/collections", tags=["collections"])


@router.get("")
async def list_collections():
    return await db.collections.find({}, {"_id": 0}).sort("name", 1).to_list(500)


@router.post("")
async def create_collection(body: CollectionIn, user: dict = Depends(require_admin)):
    slug = slugify(body.name)
    if await db.collections.find_one({"slug": slug}):
        raise HTTPException(status_code=400, detail="Collection exists")
    doc = {"id": str(uuid.uuid4()), "name": body.name, "slug": slug,
           "description": body.description or "", "cover_image": body.cover_image or "",
           "created_at": now_iso()}
    await db.collections.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.put("/{col_id}")
async def update_collection(col_id: str, body: CollectionIn, user: dict = Depends(require_admin)):
    upd = {"name": body.name, "slug": slugify(body.name),
           "description": body.description or "", "cover_image": body.cover_image or ""}
    await db.collections.update_one({"id": col_id}, {"$set": upd})
    return {"ok": True}


@router.delete("/{col_id}")
async def delete_collection(col_id: str, user: dict = Depends(require_admin)):
    await db.collections.delete_one({"id": col_id})
    return {"ok": True}
