from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_async_session
from app.models import Project
from app.schemas import ProjectPublic

router = APIRouter(prefix="/public/projects", tags=["public-projects"])


@router.get("/", response_model=List[ProjectPublic])
async def get_public_projects(db: AsyncSession = Depends(get_async_session)):
    try:
        result = await db.execute(
            select(Project).order_by(Project.order.asc())
        )
        projects = result.scalars().all()
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
