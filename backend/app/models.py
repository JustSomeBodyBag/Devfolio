from sqlalchemy import Column, Integer, String, JSON, DateTime, Text, Enum, func
from sqlalchemy.ext.declarative import declarative_base
import enum
from passlib.context import CryptContext

Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RoleEnum(str, enum.Enum):
    admin = "admin"
    guest = "guest"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.guest, nullable=False)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.password_hash)

    def set_password(self, password: str):
        self.password_hash = pwd_context.hash(password)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)  # GitHub id
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    languages = Column(JSON, nullable=True)
    url = Column(String, nullable=False)
    stars = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), nullable=False)

    order = Column(Integer, default=0, index=True)  # Для drag & drop сортировки

    screenshot_url = Column(String, nullable=True)       # оригинальный путь
    screenshot_preview_url = Column(String, nullable=True)  # превью

class HomePageContent(Base):
    __tablename__ = "home_page_content"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, default="")           # Заголовок
    subtitle = Column(String, nullable=True, default="")         # Подзаголовок
    about = Column(Text, nullable=True, default="")              # Основной текст / описание
    avatar_url = Column(String, nullable=True, default="")       # Ссылка на аватарку
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    level = Column(Integer, nullable=False)