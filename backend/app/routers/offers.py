import uuid

from fastapi import APIRouter, Depends

from app.database import db
from app.models import OfferIn
from app.security import now_iso, require_admin

router = APIRouter(prefix="/offers", tags=["offers"])


@router.get("")
async def list_offers():
    return await db.offers.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@router.post("")
async def create_offer(body: OfferIn, user: dict = Depends(require_admin)):
    doc = body.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now_iso()})
    await db.offers.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.put("/{oid}")
async def update_offer(oid: str, body: OfferIn, user: dict = Depends(require_admin)):
    await db.offers.update_one({"id": oid}, {"$set": body.model_dump()})
    return {"ok": True}


@router.delete("/{oid}")
async def delete_offer(oid: str, user: dict = Depends(require_admin)):
    await db.offers.delete_one({"id": oid})
    return {"ok": True}
