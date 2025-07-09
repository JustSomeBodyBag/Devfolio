from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
import os
import shutil
from sqlalchemy.ext.asyncio import AsyncSession
from app.deps import get_session, admin_required
from app import crud
from app.utils.image_processing import process_image

avatar = APIRouter(prefix="/homepage", tags=["homepage"])

UPLOAD_DIR = "uploads/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

BASE_URL = "http://localhost:8000"  # Замени на актуальный базовый URL твоего API

@avatar.post("/upload-avatar", status_code=status.HTTP_200_OK)
async def upload_avatar(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_session),
    user=Depends(admin_required),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Файл должен быть изображением")

    filename = f"avatar_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Сохраняем загруженный файл
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        processed_path = await process_image(filepath)  # Например, "uploads/avatars/avatar_foo_preview.png"
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"Ошибка обработки изображения: {e}")

    homepage_content = await crud.get_home_content(db)
    if not homepage_content:
        # Если контент отсутствует — удаляем оба файла и отдаём ошибку
        if os.path.exists(filepath):
            os.remove(filepath)
        if os.path.exists(processed_path):
            os.remove(processed_path)
        raise HTTPException(status_code=404, detail="Контент главной страницы не найден")

    # Удаляем старый аватар и превью, если они есть
    if homepage_content.avatar_url:
        old_avatar_path = homepage_content.avatar_url
        if old_avatar_path.startswith(BASE_URL):
            old_avatar_path = old_avatar_path[len(BASE_URL)+1:]  # убираем базовый URL и "/"

        old_preview_full_path = os.path.join(os.getcwd(), old_avatar_path)
        base, ext = os.path.splitext(old_preview_full_path)
        old_original_full_path = base.replace("_preview", "") + ext

        for path in (old_preview_full_path, old_original_full_path):
            if os.path.exists(path):
                os.remove(path)

    # Обновляем в БД новый путь (относительный, чтобы crud добавил BASE_URL)
    await crud.update_homepage_avatar(db, homepage_content.id, processed_path)

    # Формируем абсолютный URL для ответа
    absolute_avatar_url = f"{BASE_URL}/{processed_path}"

    return {"avatar_url": absolute_avatar_url}


@avatar.put("/avatar", status_code=status.HTTP_200_OK)
async def update_avatar_url(
    avatar_url: str,
    db: AsyncSession = Depends(get_session),
    user=Depends(admin_required)
):
    homepage_content = await crud.get_home_content(db)
    if not homepage_content:
        raise HTTPException(status_code=404, detail="Контент главной страницы не найден")

    await crud.update_homepage_avatar(db, homepage_content.id, avatar_url)

    if not avatar_url.startswith("http"):
        avatar_url = f"{BASE_URL}/{avatar_url}"

    return {"avatar_url": avatar_url}
