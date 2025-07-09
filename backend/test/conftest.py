import asyncio
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.database import get_db
from app.main import app
from app.models import Base

DATABASE_TEST_URL = "postgresql+asyncpg://user:password@localhost/test_db"

engine_test = create_async_engine(DATABASE_TEST_URL, echo=True)
AsyncSessionTest = sessionmaker(
    bind=engine_test, expire_on_commit=False, class_=AsyncSession
)

@pytest.fixture(scope="session")
def event_loop():
    # pytest-asyncio requires this for async tests
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session", autouse=True)
async def prepare_database():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

# Добавляем фикстуру, которую ожидает тест
@pytest.fixture()
async def async_session_test():
    async with AsyncSessionTest() as session:
        yield session

# Переопределяем зависимость get_db в FastAPI для тестов
async def override_get_db():
    async with AsyncSessionTest() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db
