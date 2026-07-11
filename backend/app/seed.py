"""First-run bootstrap data: admin account, default settings, starter
categories/collections. Everything here is idempotent — safe to run
on every startup.
"""
import uuid

from app.config import settings
from app.database import db
from app.security import hash_password, now_iso, slugify, verify_password

DEFAULT_CATEGORIES = [
    "Dress", "Frock", "Kurti", "Chudidar", "Co-ord Set", "Ethnic Wear",
    "Traditional Wear", "Festival Wear", "Party Wear", "Office Wear",
    "Daily Wear", "Cotton Collection", "Premium Collection",
    "New Arrival", "Trending", "Best Seller",
]

DEFAULT_COLLECTIONS = [
    "Wedding Collection", "Festival Collection", "Summer Collection",
    "Winter Collection", "Best Sellers", "Trending", "New Arrivals",
    "Cotton Collection", "Office Wear", "Premium Collection",
]

DEFAULT_SETTINGS = {
    "business_name": "My Store",
    "logo": "/brand/logo.png",
    "whatsapp_number": "",
    "business_email": "hello@example.com",
    "instagram_url": "",
    "facebook_url": "",
    "youtube_url": "",
    "business_address": "",
    "business_hours": "Mon-Sat, 10am-8pm",
    "footer_text": "",
    "homepage_title": "Welcome",
    "seo_description": "",
    "seo_keywords": "",
    "currency": "INR",
    "about_text": "",
}


async def seed_admin_user() -> None:
    admin_email = settings.ADMIN_EMAIL.lower()
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(settings.ADMIN_PASSWORD),
            "name": "Admin",
            "role": "admin",
            "created_at": now_iso(),
        })
    elif not verify_password(settings.ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(settings.ADMIN_PASSWORD)}},
        )


async def seed_default_settings() -> None:
    if not await db.settings.find_one({"key": "global"}):
        await db.settings.insert_one({"key": "global", **DEFAULT_SETTINGS, "updated_at": now_iso()})


async def seed_taxonomy() -> None:
    for name in DEFAULT_CATEGORIES:
        slug = slugify(name)
        if not await db.categories.find_one({"slug": slug}):
            await db.categories.insert_one({
                "id": str(uuid.uuid4()), "name": name, "slug": slug,
                "description": "", "created_at": now_iso(),
            })

    for name in DEFAULT_COLLECTIONS:
        slug = slugify(name)
        if not await db.collections.find_one({"slug": slug}):
            await db.collections.insert_one({
                "id": str(uuid.uuid4()), "name": name, "slug": slug,
                "description": "", "cover_image": "", "created_at": now_iso(),
            })


async def run_all() -> None:
    await seed_admin_user()
    await seed_default_settings()
    await seed_taxonomy()
