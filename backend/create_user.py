import asyncio
from app.database import AsyncSessionLocal
from app.models import User

async def create_user(username: str, password: str):
    async with AsyncSessionLocal() as session:
        user = User(username=username)
        user.set_password(password)
        session.add(user)
        await session.commit()
        print(f"User {username} created")

if __name__ == "__main__":
    asyncio.run(create_user("testuser", "testpass"))
