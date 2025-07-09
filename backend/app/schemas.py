from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict
from datetime import datetime
from enum import Enum

# === Enums ===
class RoleEnum(str, Enum):
    admin = "admin"
    guest = "guest"

# === Users ===
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: RoleEnum

    class Config:
        orm_mode = True

# === Auth ===
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ChangeCredentialsRequest(BaseModel):
    oldPassword: str
    newUsername: Optional[str] = None
    newPassword: Optional[str] = None

# === Projects ===
class ProjectBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    languages: Optional[Dict[str, int]] = None
    url: str
    stars: int
    updated_at: datetime
    order: Optional[int] = 0
    screenshot_url: Optional[str] = None
    screenshot_preview_url: Optional[str] = None

    class Config:
        orm_mode = True

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    languages: Optional[Dict[str, int]] = None
    url: str
    stars: int
    updated_at: datetime
    order: Optional[int] = 0

class ProjectOut(ProjectBase):
    pass

# === Public API Schema ===
class ProjectPublic(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    languages: Optional[Dict[str, int]] = None
    url: str
    stars: int
    updated_at: datetime
    screenshot_url: Optional[str] = None

    class Config:
        orm_mode = True

# === Home Page ===
class HomePageContentBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    about: Optional[str] = None
    avatar_url: Optional[HttpUrl] = None

class HomePageContentUpdate(HomePageContentBase):
    pass

class HomePageContentOut(HomePageContentBase):
    id: int
    updated_at: datetime

    class Config:
        orm_mode = True


class SkillBase(BaseModel):
    name: str
    level: int

class SkillCreate(SkillBase):
    pass

class SkillUpdate(SkillBase):
    pass

class SkillOut(SkillBase):
    id: int

    class Config:
        orm_mode = True