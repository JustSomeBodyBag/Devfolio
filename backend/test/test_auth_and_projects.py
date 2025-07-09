import pytest
from httpx import AsyncClient
from app.crud import create_user
from app.main import app

@pytest.mark.asyncio
async def test_auth_and_projects(async_session_test):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Попытка получить проекты без токена — 401
        r = await ac.get("/github/projects")
        assert r.status_code == 401

        # Создаем пользователя в тестовой БД
        async with async_session_test as session:
            user = await create_user(session, username="testuser", password="testpass", role="admin")
            await session.commit()

        # Логинимся
        r = await ac.post("/auth/login", json={"username": "testuser", "password": "testpass"})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        token = data["access_token"]

        headers = {"Authorization": f"Bearer {token}"}

        # Получаем проекты с токеном
        r = await ac.get("/github/projects", headers=headers)
        assert r.status_code == 200
        projects = r.json()
        assert isinstance(projects, list)
