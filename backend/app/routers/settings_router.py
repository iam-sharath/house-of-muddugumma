from fastapi import APIRouter, Depends

from app.database import db
from app.models import SettingsIn
from app.security import hash_password, now_iso, require_admin

router = APIRouter(prefix="/settings", tags=["settings"])

PUBLIC_SETTING_FIELDS = {
    "business_name", "logo", "whatsapp_number", "business_email", "instagram_url",
    "facebook_url", "youtube_url", "business_address", "business_hours", "footer_text",
    "homepage_title", "seo_description", "seo_keywords", "currency", "about_text",
}


@router.get("/public")
async def get_public_settings():
    doc = await db.settings.find_one({"key": "global"}, {"_id": 0}) or {}
    return {field: doc.get(field, "") for field in PUBLIC_SETTING_FIELDS}


@router.get("")
async def get_settings(user: dict = Depends(require_admin)):
    doc = await db.settings.find_one({"key": "global"}, {"_id": 0}) or {}
    doc.pop("admin_password", None)
    return doc


@router.put("")
async def update_settings(body: SettingsIn, user: dict = Depends(require_admin)):
    payload = {k: v for k, v in body.model_dump().items() if v is not None}
    new_password = payload.pop("admin_password", None)
    new_admin_email = payload.pop("admin_email", None)

    if payload:
        payload["updated_at"] = now_iso()
        await db.settings.update_one({"key": "global"}, {"$set": payload}, upsert=True)

    if new_admin_email or new_password:
        upd = {}
        if new_admin_email:
            upd["email"] = new_admin_email.lower()
        if new_password:
            upd["password_hash"] = hash_password(new_password)
        if upd:
            await db.users.update_one({"id": user["id"]}, {"$set": upd})

    return await db.settings.find_one({"key": "global"}, {"_id": 0}) or {}
