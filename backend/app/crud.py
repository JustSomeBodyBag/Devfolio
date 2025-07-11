from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, update, func
from typing import Optional
from passlib.context import CryptContext
from app.models import Project, User, RoleEnum, HomePageContent
from app.schemas import UserCreate, HomePageContentBase
from app.schemas import SkillCreate, SkillUpdate, SkillOut
from app.models import Skill
from app.models import Visit
from app.schemas import VisitCreate


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
BASE_URL = "http://localhost:8000"

# === Projects ===
async def get_all_projects(db: AsyncSession):
    result = await db.execute(select(Project).order_by(Project.order.asc()))
    return result.scalars().all()

async def create_project(db: AsyncSession, project_in):
    project = Project(**project_in.dict())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project

async def update_project_screenshot(db: AsyncSession, project_id: int, screenshot_path: str | None, preview_path: str | None):
    await db.execute(
        update(Project)
        .where(Project.id == project_id)
        .values(screenshot_url=screenshot_path, screenshot_preview_url=preview_path)
    )
    await db.commit()

# === Users ===
async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(User).where(User.username == username))
    return result.scalars().first()

async def create_user(db: AsyncSession, user_in: UserCreate):
    user = User(username=user_in.username, role=RoleEnum.guest)
    user.set_password(user_in.password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def update_user(db: AsyncSession, user: User, new_username: str = None, new_password: str = None):
    updated = False
    if new_username and new_username != user.username:
        user.username = new_username
        updated = True
    if new_password:
        user.password_hash = pwd_context.hash(new_password)
        updated = True
    if updated:
        await db.commit()
        await db.refresh(user)
    return user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# === HomePageContent ===
async def get_home_content(db: AsyncSession) -> HomePageContent | None:
    result = await db.execute(select(HomePageContent).limit(1))
    content = result.scalars().first()

    if content:
        # Если avatar_url пустая строка, заменить на None
        if content.avatar_url == '':
            content.avatar_url = None
        # Если avatar_url есть и не начинается с http, добавить BASE_URL
        elif content.avatar_url and not content.avatar_url.startswith("http"):
            content.avatar_url = f"{BASE_URL}/{content.avatar_url}"

    return content



async def create_home_content(db: AsyncSession, content_in: HomePageContentBase) -> HomePageContent:
    content = HomePageContent(**content_in.dict(exclude={"avatar_url"}))  # Не сохраняем аватар в create
    db.add(content)
    await db.commit()
    await db.refresh(content)
    return content

async def update_home_content(db: AsyncSession, content_in: HomePageContentBase) -> HomePageContent:
    content = await get_home_content(db)
    if not content:
        return await create_home_content(db, content_in)

    update_data = content_in.dict(exclude_unset=True, exclude={"avatar_url"})
    if update_data:
        stmt = (
            update(HomePageContent)
            .where(HomePageContent.id == content.id)
            .values(**update_data)
            .execution_options(synchronize_session="fetch")
        )
        await db.execute(stmt)
        await db.commit()
        content = await get_home_content(db)  # обновленный объект
    return content



async def update_homepage_avatar(db: AsyncSession, content_id: int, avatar_url: Optional[str]):
    avatar_url = avatar_url or None
    await db.execute(
        update(HomePageContent)
        .where(HomePageContent.id == content_id)
        .values(avatar_url=avatar_url)
        .execution_options(synchronize_session="fetch")
    )
    await db.commit()

async def get_skills(db: AsyncSession):
    result = await db.execute(select(Skill).order_by(Skill.id.asc()))
    return result.scalars().all()

async def get_skill(db: AsyncSession, skill_id: int):
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    return result.scalars().first()

async def create_skill(db: AsyncSession, skill_in: SkillCreate):
    skill = Skill(**skill_in.dict())
    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    return skill

async def update_skill(db: AsyncSession, skill_id: int, skill_in: SkillUpdate):
    stmt = (
        update(Skill)
        .where(Skill.id == skill_id)
        .values(name=skill_in.name, level=skill_in.level)
        .execution_options(synchronize_session="fetch")
    )
    await db.execute(stmt)
    await db.commit()
    return await get_skill(db, skill_id)

async def delete_skill(db: AsyncSession, skill_id: int):
    stmt = delete(Skill).where(Skill.id == skill_id)
    await db.execute(stmt)
    await db.commit()


# === Visits (статистика посещений) ===

async def create_visit(db: AsyncSession, visit_in: VisitCreate) -> Visit:
    visit = Visit(**visit_in.dict())
    db.add(visit)
    await db.commit()
    await db.refresh(visit)
    return visit

async def get_stats(db: AsyncSession):
    # Агрегация по дате (YYYY-MM-DD)
    result_day = await db.execute(
        select(func.date(Visit.timestamp), func.count(Visit.id))
        .group_by(func.date(Visit.timestamp))
        .order_by(func.date(Visit.timestamp))
    )
    visits_per_day = {str(row[0]): row[1] for row in result_day.all()}

    # Агрегация по стране
    result_country = await db.execute(
        select(Visit.country, func.count(Visit.id))
        .group_by(Visit.country)
        .order_by(Visit.country)
    )
    visits_per_country = {row[0] or "Unknown": row[1] for row in result_country.all()}

    # Агрегация по источнику (referrer)
    result_source = await db.execute(
        select(Visit.referrer, func.count(Visit.id))
        .group_by(Visit.referrer)
        .order_by(Visit.referrer)
    )
    visits_per_source = {row[0] or "Unknown": row[1] for row in result_source.all()}

    return {
        "visits_per_day": visits_per_day,
        "visits_per_country": visits_per_country,
        "visits_per_source": visits_per_source,
    }