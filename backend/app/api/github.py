from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_async_session
from app.github_fetcher import fetch_and_save_projects
from app import crud, schemas
from app.auth import get_current_user  # если используешь авторизацию
from typing import List

router = APIRouter(tags=["GitHub Projects"])


@router.get("/projects", response_model=List[schemas.ProjectOut])
async def get_projects(session: AsyncSession = Depends(get_async_session)):
    return await crud.get_all_projects(session)


@router.post("/fetch", status_code=200)
async def fetch_projects(
    user: schemas.User = Depends(get_current_user),
):
    try:
        await fetch_and_save_projects()
        return {"detail": "Projects fetched and saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fetch failed: {str(e)}")
