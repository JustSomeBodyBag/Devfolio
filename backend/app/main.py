from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import github_router, homepage_router
from app.routers import auth_router, projects_router
from app.public_api.projects_public import router as public_projects_router
from app.database import engine
from app.models import Base

# Импортируем твой avatar router
from app.routers.avatar import avatar  # путь корректируй согласно структуре проекта
from app.routers.skills import router as skills_router
from app.public_api.skills_public import router as skills_public_router

from app.routers import telegram
from app.routers import analytics


app = FastAPI()

# === CORS ===
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://192.168.2.102:3001",
]

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Routers ===
app.include_router(auth_router, prefix="/auth", tags=["auth"])

app.include_router(github_router, prefix="/github", tags=["github"])

app.include_router(projects_router, prefix="/admin", tags=["projects"])
app.include_router(homepage_router, tags=["homepage"])
app.include_router(skills_router, prefix="/admin/skills", tags=["skills"])

app.include_router(public_projects_router)
app.include_router(skills_public_router)

app.include_router(avatar) 

app.include_router(analytics.router)

app.include_router(telegram.router, prefix="/api/telegram", tags=["Telegram"])

# === Static Files ===
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
