"""File storage backend.

Stores uploaded files on local disk under `settings.UPLOAD_DIR`. This
works out of the box on Render (attach a persistent disk mounted at
that path so uploads survive deploys) and needs zero third-party
accounts to get started.

If you outgrow local disk later (e.g. multiple backend instances),
swap `save_file` / `read_file` / `delete_file` below for a call to
S3 / Cloudinary / R2 — the rest of the app only calls this module.
"""
import uuid
from pathlib import Path
from typing import Tuple

from fastapi import HTTPException

from app.config import settings


def _safe_path(relative_path: str) -> Path:
    """Resolve a relative path and make sure it can't escape UPLOAD_DIR."""
    full_path = (settings.UPLOAD_DIR / relative_path).resolve()
    if not str(full_path).startswith(str(settings.UPLOAD_DIR.resolve())):
        raise HTTPException(status_code=400, detail="Invalid file path")
    return full_path


def save_file(folder: str, filename: str, data: bytes, content_type: str) -> dict:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
    relative_path = f"{folder}/{uuid.uuid4()}.{ext}"
    full_path = _safe_path(relative_path)
    full_path.parent.mkdir(parents=True, exist_ok=True)
    full_path.write_bytes(data)
    return {"path": relative_path, "size": len(data), "content_type": content_type}


def read_file(relative_path: str) -> Tuple[bytes, str]:
    full_path = _safe_path(relative_path)
    if not full_path.is_file():
        raise HTTPException(status_code=404, detail="Not found")
    content_type = _guess_content_type(full_path.suffix)
    return full_path.read_bytes(), content_type


def delete_file(relative_path: str) -> None:
    full_path = _safe_path(relative_path)
    full_path.unlink(missing_ok=True)


def _guess_content_type(suffix: str) -> str:
    mapping = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
        ".pdf": "application/pdf",
    }
    return mapping.get(suffix.lower(), "application/octet-stream")
