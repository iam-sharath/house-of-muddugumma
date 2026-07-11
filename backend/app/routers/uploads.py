from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import Response

from app.config import settings
from app.security import require_admin
from app.storage import read_file, save_file

router = APIRouter(tags=["uploads"])


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), user: dict = Depends(require_admin)):
    data = await file.read()
    result = save_file(
        folder=f"{settings.APP_NAME}/products",
        filename=file.filename or "upload.bin",
        data=data,
        content_type=file.content_type or "application/octet-stream",
    )
    return {"path": result["path"], "url": f"/api/files/{result['path']}"}


@router.get("/files/{path:path}")
async def get_file(path: str):
    data, content_type = read_file(path)
    headers = {"Cache-Control": "public, max-age=31536000, immutable"}
    return Response(content=data, media_type=content_type, headers=headers)
