"""MongoDB connection, shared across the whole app."""
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

client = AsyncIOMotorClient(
    settings.MONGO_URL,
    serverSelectionTimeoutMS=8000,
    connectTimeoutMS=8000,
)
db = client[settings.DB_NAME]


async def close_db_connection() -> None:
    client.close()


async def create_indexes() -> None:
    """Idempotent index creation, safe to call on every startup."""
    await db.users.create_index("email", unique=True)
    await db.products.create_index("slug", unique=True)
    await db.categories.create_index("slug", unique=True)
    await db.collections.create_index("slug", unique=True)
    await db.settings.create_index("key", unique=True)
