from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import SkillOut
from app.crud import get_skills
from app.deps import get_session as get_db


router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("/", response_model=List[SkillOut])
async def public_read_skills(db: AsyncSession = Depends(get_db)):
    return await get_skills(db)
