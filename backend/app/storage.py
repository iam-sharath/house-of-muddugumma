"""File storage backend.

Uses Cloudinary when CLOUDINARY_* env vars are set (recommended for
production — required on Render's Free tier, since local disk there
gets wiped on every redeploy). Falls back to local disk otherwise,
which is fine for local development.

The rest of the app only calls save_file() / delete_file() below, so
swapping providers later only means changing this file.
"""
import uuid
from pathlib import Path
from typing import Tuple

from fastapi import HTTPException

from app.config import settings

if settings.USE_CLOUDINARY:
    import cloudinary
    import cloudinary.uploader

    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


def _safe_path(relative_path: str) -> Path:
    """Resolve a relative path and make sure it can't escape UPLOAD_DIR."""
    full_path = (settings.UPLOAD_DIR / relative_path).resolve()
    if not str(full_path).startswith(str(settings.UPLOAD_DIR.resolve())):
        raise HTTPException(status_code=400, detail="Invalid file path")
    return full_path


def save_file(folder: str, filename: str, data: bytes, content_type: str) -> dict:
    if settings.USE_CLOUDINARY:
        result = cloudinary.uploader.upload(
            data,
            folder=folder,
            public_id=str(uuid.uuid4()),
            resource_type="image",
        )
        # secure_url is a full https:// URL — the frontend uses it as-is.
        return {"path": result["secure_url"], "size": result.get("bytes", len(data)), "content_type": content_type}

    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
    relative_path = f"{folder}/{uuid.uuid4()}.{ext}"
    full_path = _safe_path(relative_path)
    full_path.parent.mkdir(parents=True, exist_ok=True)
    full_path.write_bytes(data)
    return {"path": relative_path, "size": len(data), "content_type": content_type}


def read_file(relative_path: str) -> Tuple[bytes, str]:
    """Only used for the local-disk fallback — Cloudinary URLs are served
    directly by Cloudinary and never hit this function."""
    full_path = _safe_path(relative_path)
    if not full_path.is_file():
        raise HTTPException(status_code=404, detail="Not found")
    content_type = _guess_content_type(full_path.suffix)
    return full_path.read_bytes(), content_type


def delete_file(relative_path: str) -> None:
    if settings.USE_CLOUDINARY:
        return  # cleanup of old Cloudinary assets is a manual/dashboard task for now
    full_path = _safe_path(relative_path)
    full_path.unlink(missing_ok=True)


def _guess_content_type(suffix: str) -> str:
    mapping = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
        ".pdf": "application/pdf",
    }
    return mapping.get(suffix.lower(), "application/octet-stream")
