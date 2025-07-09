import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from app.models import Project
from app.config import settings
from app.database import AsyncSessionLocal  # Импорт фабрики сессий

async def fetch_github_repos() -> list[dict]:
    headers = {}
    if settings.github_token:
        headers["Authorization"] = f"token {settings.github_token}"

    url = f"https://api.github.com/users/{settings.github_username}/repos?per_page=100"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        repos = response.json()

        filtered = []
        for repo in repos:
            if repo["fork"] or repo["archived"] or "test" in repo["name"].lower():
                continue
            langs_response = await client.get(repo["languages_url"], headers=headers)
            langs_response.raise_for_status()
            languages = langs_response.json()

            filtered.append({
                "id": repo["id"],
                "name": repo["name"],
                "description": repo["description"],
                "languages": languages,
                "url": repo["html_url"],
                "stars": repo["stargazers_count"],
                "updated_at": datetime.fromisoformat(repo["updated_at"].replace("Z", "+00:00")),
            })

    return sorted(filtered, key=lambda x: (x["stars"], x["updated_at"]), reverse=True)

async def update_db_with_repos(db: AsyncSession):
    repos = await fetch_github_repos()
    for repo in repos:
        result = await db.execute(select(Project).filter(Project.id == repo["id"]))
        existing = result.scalars().first()
        if existing:
            for key, value in repo.items():
                setattr(existing, key, value)
        else:
            new_proj = Project(**repo)
            db.add(new_proj)
    await db.commit()

async def fetch_and_save_projects():
    async with AsyncSessionLocal() as db:
        await update_db_with_repos(db)
