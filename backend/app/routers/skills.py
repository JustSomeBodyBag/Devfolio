from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import SkillCreate, SkillUpdate, SkillOut
from app.crud import get_skills, create_skill, update_skill, delete_skill, get_skill
from app.deps import get_session, admin_required

router = APIRouter(prefix="/admin/skills", tags=["admin_skills"])

@router.get("/", response_model=List[SkillOut])
async def read_skills(
    db: AsyncSession = Depends(get_session),
    current_user=Depends(admin_required)
):
    return await get_skills(db)

@router.post("/", response_model=SkillOut)
async def add_skill(
    skill_in: SkillCreate,
    db: AsyncSession = Depends(get_session),
    current_user=Depends(admin_required)
):
    return await create_skill(db, skill_in)

@router.put("/{skill_id}", response_model=SkillOut)
async def edit_skill(
    skill_id: int,
    skill_in: SkillUpdate,
    db: AsyncSession = Depends(get_session),
    current_user=Depends(admin_required)
):
    skill = await get_skill(db, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return await update_skill(db, skill_id, skill_in)

@router.delete("/{skill_id}")
async def remove_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_session),
    current_user=Depends(admin_required)
):
    skill = await get_skill(db, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    await delete_skill(db, skill_id)
    return {"detail": "Skill deleted"}
