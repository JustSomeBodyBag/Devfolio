import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlalchemy.future import select
from sqlalchemy import update
from app.models import Project
from app.schemas import ProjectOut, ProjectCreate
from app.deps import get_session, admin_required
from app import crud
from app.utils.image_processing import process_image

projects_router = APIRouter(prefix="/projects", tags=["projects"])

UPLOAD_DIR = "uploads/screenshots"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@projects_router.get("/", response_model=List[ProjectOut])
async def list_projects(db: AsyncSession = Depends(get_session)):
    projects = await crud.get_all_projects(db)
    return projects

@projects_router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_session),
    user=Depends(admin_required)
):
    project = await crud.create_project(db, project_in)
    return project

@projects_router.post("/{project_id}/upload-screenshot", status_code=status.HTTP_200_OK)
async def upload_screenshot(
    project_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_session),
    user=Depends(admin_required)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    filename = f"{project_id}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Сохраняем файл (blocking I/O)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Генерация превью (await)
    try:
        preview_path = await process_image(filepath)  # Возвращает относительный путь
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"Ошибка обработки изображения: {str(e)}")

    # Обновляем пути в базе (относительные)
    await crud.update_project_screenshot(db, project_id, filepath, preview_path)

    return {
        "filename": filename,
        "preview": os.path.basename(preview_path)
    }

@projects_router.delete("/{project_id}/screenshot", status_code=status.HTTP_204_NO_CONTENT)
async def delete_screenshot(
    project_id: int,
    db: AsyncSession = Depends(get_session),
    user=Depends(admin_required)
):
    project = await db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    for path_attr in ["screenshot_url", "screenshot_preview_url"]:
        path = getattr(project, path_attr, None)
        if path and os.path.exists(path):
            try:
                os.remove(path)
            except Exception:
                pass

    await crud.update_project_screenshot(db, project_id, None, None)
    return None

@projects_router.post("/reorder", status_code=status.HTTP_200_OK)
async def reorder_projects(
    order: List[int] = Body(...),
    db: AsyncSession = Depends(get_session),
    user=Depends(admin_required),
):
    if not order:
        raise HTTPException(status_code=400, detail="Order list cannot be empty")

    # Проверяем, что все id существуют в базе
    result = await db.execute(select(Project.id).where(Project.id.in_(order)))
    existing_ids = {row[0] for row in result.all()}
    if set(order) != existing_ids:
        raise HTTPException(status_code=400, detail="Some project IDs not found")

    try:
        # Обновляем поле order согласно индексу
        for idx, project_id in enumerate(order):
            await db.execute(
                update(Project)
                .where(Project.id == project_id)
                .values(order=idx)
            )
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reorder projects: {e}")

    return {"message": "Projects reordered successfully"}

@projects_router.get("/debug")
async def debug_projects(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Project))
    return [{"id": p.id, "name": p.name} for p in result.scalars().all()]
