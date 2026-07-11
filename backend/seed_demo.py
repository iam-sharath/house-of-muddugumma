"""Optional: seed a handful of demo products so the storefront isn't
empty on first run. Safe to run multiple times — it no-ops if
products already exist.

Usage:
    python seed_demo.py
"""
import asyncio
import uuid
from datetime import datetime, timezone

from app.database import db
from app.security import slugify

DEMO_PRODUCTS = [
    ("Sample Cotton Dress", "A soft, breathable everyday dress.", "Cotton",
     "Machine wash cold.", 1999, 20,
     ["Dress", "Daily Wear"], ["New Arrivals"], ["Cotton", "Daily Wear"], ["Ivory", "Rust"],
     "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=1000&q=75"),
    ("Sample Party Frock", "A statement piece for evening occasions.", "Georgette",
     "Dry clean only.", 3899, 38,
     ["Frock", "Party Wear"], ["Trending"], ["Party", "Lightweight"], ["Blush", "Champagne"],
     "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=75"),
]


async def main() -> None:
    if await db.products.count_documents({}) > 0:
        print("Products already exist, skipping seed.")
        return

    now = datetime.now(timezone.utc).isoformat()
    for name, desc, fabric, wash, inr, gbp, cats, cols, tags, colors, img in DEMO_PRODUCTS:
        await db.products.insert_one({
            "id": str(uuid.uuid4()), "slug": slugify(name), "name": name, "description": desc,
            "fabric": fabric, "wash": wash, "price_inr": inr, "price_gbp": gbp,
            "categories": cats, "collections": cols, "tags": tags, "colors": colors,
            "images": [img], "status": "published",
            "created_at": now, "updated_at": now,
        })
        print("Seeded:", name)

    await db.banners.insert_one({
        "id": str(uuid.uuid4()), "title": "Welcome",
        "subtitle": "Discover our latest edit.",
        "image": "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=1600&q=80",
        "link": "/shop", "kind": "hero", "order": 0, "status": "active",
        "created_at": now,
    })
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
