import asyncio
from app.database import async_session  # твоя сессия async
from app.models import User

async def create_user(username: str, password: str):
    async with async_session() as session:
        user = User(username=username)
        user.set_password(password)  # хэшируем пароль
        session.add(user)
        await session.commit()
        print(f"User {username} created")

if __name__ == "__main__":
    asyncio.run(create_user("testuser", "testpass"))
