import uuid
from typing import Optional

from fastapi import APIRouter, Depends

from app.database import db
from app.models import BannerIn
from app.security import now_iso, require_admin

router = APIRouter(prefix="/banners", tags=["banners"])


@router.get("")
async def list_banners(kind: Optional[str] = None):
    query = {"kind": kind} if kind else {}
    return await db.banners.find(query, {"_id": 0}).sort("order", 1).to_list(200)


@router.post("")
async def create_banner(body: BannerIn, user: dict = Depends(require_admin)):
    doc = body.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.banners.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.put("/{bid}")
async def update_banner(bid: str, body: BannerIn, user: dict = Depends(require_admin)):
    await db.banners.update_one({"id": bid}, {"$set": body.model_dump()})
    return {"ok": True}


@router.delete("/{bid}")
async def delete_banner(bid: str, user: dict = Depends(require_admin)):
    await db.banners.delete_one({"id": bid})
    return {"ok": True}
