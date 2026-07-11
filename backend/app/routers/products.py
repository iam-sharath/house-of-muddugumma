import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from app.database import db
from app.models import ProductIn
from app.security import now_iso, require_admin, slugify

router = APIRouter(prefix="/products", tags=["products"])


async def _unique_slug(name: str, exclude_id: Optional[str] = None) -> str:
    base = slugify(name)
    slug = base
    idx = 1
    while True:
        query = {"slug": slug}
        if exclude_id:
            query["id"] = {"$ne": exclude_id}
        if not await db.products.find_one(query):
            return slug
        idx += 1
        slug = f"{base}-{idx}"


@router.get("")
async def list_products(
    q: Optional[str] = None,
    category: Optional[str] = None,
    collection: Optional[str] = None,
    tag: Optional[str] = None,
    status: Optional[str] = "published",
    limit: int = 100,
    skip: int = 0,
):
    query: dict = {}
    if status:
        query["status"] = status
    if category:
        query["categories"] = category
    if collection:
        query["collections"] = collection
    if tag:
        query["tags"] = tag
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}},
            {"categories": {"$regex": q, "$options": "i"}},
            {"collections": {"$regex": q, "$options": "i"}},
        ]
    total = await db.products.count_documents(query)
    items = await db.products.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return {"total": total, "items": items}


@router.get("/id/{pid}")
async def get_product_by_id(pid: str, user: dict = Depends(require_admin)):
    prod = await db.products.find_one({"id": pid}, {"_id": 0})
    if not prod:
        raise HTTPException(status_code=404, detail="Not found")
    return prod


@router.get("/{slug}")
async def get_product(slug: str):
    prod = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not prod:
        raise HTTPException(status_code=404, detail="Not found")
    return prod


@router.post("")
async def create_product(body: ProductIn, user: dict = Depends(require_admin)):
    slug = await _unique_slug(body.name)
    doc = body.model_dump()
    doc.update({"id": str(uuid.uuid4()), "slug": slug, "created_at": now_iso(), "updated_at": now_iso()})
    await db.products.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.put("/{pid}")
async def update_product(pid: str, body: ProductIn, user: dict = Depends(require_admin)):
    existing = await db.products.find_one({"id": pid})
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")

    upd = body.model_dump()
    upd["updated_at"] = now_iso()
    new_slug = slugify(body.name)
    if new_slug != existing["slug"]:
        upd["slug"] = await _unique_slug(body.name, exclude_id=pid)

    await db.products.update_one({"id": pid}, {"$set": upd})
    return await db.products.find_one({"id": pid}, {"_id": 0})


@router.delete("/{pid}")
async def delete_product(pid: str, user: dict = Depends(require_admin)):
    await db.products.delete_one({"id": pid})
    return {"ok": True}


@router.post("/{pid}/duplicate")
async def duplicate_product(pid: str, user: dict = Depends(require_admin)):
    prod = await db.products.find_one({"id": pid}, {"_id": 0})
    if not prod:
        raise HTTPException(status_code=404, detail="Not found")

    prod["id"] = str(uuid.uuid4())
    prod["name"] = f"{prod['name']} (Copy)"
    prod["slug"] = await _unique_slug(prod["name"])
    prod["status"] = "draft"
    prod["created_at"] = now_iso()
    prod["updated_at"] = now_iso()
    await db.products.insert_one(prod)
    prod.pop("_id", None)
    return prod
