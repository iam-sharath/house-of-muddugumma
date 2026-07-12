"""Centralized application configuration.

All environment variables are read once here so the rest of the app
never touches `os.environ` directly. Add new settings here as the
project grows.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")


def _require(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(
            f"Missing required environment variable '{name}'. "
            f"Copy backend/.env.example to backend/.env and fill it in."
        )
    return value


class Settings:
    # App
    APP_NAME: str = os.environ.get("APP_NAME", "app")
    ENV: str = os.environ.get("ENV", "development")

    # Database
    MONGO_URL: str = _require("MONGO_URL")
    DB_NAME: str = _require("DB_NAME")

    # Auth
    JWT_SECRET: str = _require("JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = int(os.environ.get("ACCESS_TOKEN_EXPIRE_HOURS", "8"))

    # Bootstrap admin account (only used the first time the app starts)
    ADMIN_EMAIL: str = os.environ.get("ADMIN_EMAIL", "admin@example.com")
    ADMIN_PASSWORD: str = os.environ.get("ADMIN_PASSWORD", "changeme123")

    # CORS
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "*").split(",")
        if origin.strip()
    ]

    # File storage (local disk by default — see app/storage.py)
    # File storage (local disk by default — see app/storage.py)
    UPLOAD_DIR: Path = Path(os.environ.get("UPLOAD_DIR", ROOT_DIR / "uploads"))

    # Cloudinary (optional). If all three are set, uploads go to Cloudinary
    # instead of local disk — required on Render's Free tier, since local
    # disk there is wiped on every redeploy.
    CLOUDINARY_CLOUD_NAME: str = os.environ.get("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.environ.get("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.environ.get("CLOUDINARY_API_SECRET", "")

    @property
    def USE_CLOUDINARY(self) -> bool:
        return bool(self.CLOUDINARY_CLOUD_NAME and self.CLOUDINARY_API_KEY and self.CLOUDINARY_API_SECRET)

    # Cookies should only be marked "secure" behind HTTPS (Render gives you HTTPS)
    COOKIE_SECURE: bool = os.environ.get("COOKIE_SECURE", "false").lower() == "true"


settings = Settings()
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
