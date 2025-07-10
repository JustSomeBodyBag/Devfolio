from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.schemas import HomePageContentBase, HomePageContentOut
from app.auth import get_current_user
from app.models import User
from app import crud

router = APIRouter(prefix="/homepage", tags=["homepage"])

@router.get("/", response_model=HomePageContentOut | None)
async def read_home_content(db: AsyncSession = Depends(get_async_session)):
    return await crud.get_home_content(db)

@router.post("/", response_model=HomePageContentOut)
async def create_home_content(
    data: HomePageContentBase,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    existing = await crud.get_home_content(db)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Content already exists")
    return await crud.create_home_content(db, data)

@router.put("/", response_model=HomePageContentOut)
async def update_home_content(
    data: HomePageContentBase,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    try:
        return await crud.update_home_content(db, data)
    except Exception as e:
        import traceback
        traceback.print_exc()  # вывод в логи сервера
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
