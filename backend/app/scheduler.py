from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.github_fetcher import update_db_with_repos
from app.database import get_session
from app.config import settings
import asyncio

scheduler = AsyncIOScheduler()

async def scheduled_update():
    async with get_session() as session:
        await update_db_with_repos(session)

def start_scheduler():
    scheduler.add_job(lambda: asyncio.create_task(scheduled_update()), "interval", hours=settings.refresh_interval_hours)
    scheduler.start()
