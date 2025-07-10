import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()  # загрузка переменных из .env

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
