# 🌐 Devfolio — Fullstack Портфолио Платформа

> 🇷🇺 Универсальная платформа для демонстрации разработчиков, с админкой и Telegram-уведомлениями  
> 🇺🇸 Full-featured portfolio platform with admin panel, API, and Telegram integration

---

## 📦 Состав проекта / Project Structure

Devfolio/
├── backend/ # FastAPI сервер (REST API + база данных)
├── frontend/ # Публичный сайт (Next.js)
└── admin-dashboard/ # Панель администратора (React + Vite)

```yaml

---

## 🚀 Стек технологий / Tech Stack

| Раздел / Layer       | 🇷🇺 Технологии                     | 🇺🇸 Technologies                   |
|----------------------|------------------------------------|-----------------------------------|
| Backend              | FastAPI, SQLAlchemy, Alembic       | FastAPI, SQLAlchemy, Alembic      |
| БД / Database        | PostgreSQL                         | PostgreSQL                        |
| Frontend             | Next.js, React 19, Tailwind CSS    | Next.js, React 19, Tailwind CSS   |
| Admin Dashboard      | Vite, React 19, MUI, Zustand       | Vite, React 19, MUI, Zustand      |
| Аутентификация       | JWT, Firebase OAuth                | JWT, Firebase OAuth               |
| Другие               | Telegram API, GitHub API           | Telegram API, GitHub API          |

---
```
## ⚙️ Установка / Setup Guide

### 1. Клонируем репозиторий / Clone the repository

```bash
git clone https://github.com/your-username/devfolio.git
cd devfolio
```
2. 📦 Настройка окружения / Environment Configuration
PostgreSQL
Убедитесь, что PostgreSQL запущен и у вас есть база:

```sql
CREATE DATABASE devfolio_db;
```
backend/.env
```env
# General
APP_NAME=DevfolioAPI
ENV=development
PORT=8000

# PostgreSQL
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/devfolio_db

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# GitHub API
GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=ghp_...  # optional

# Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```
frontend/.env.local и admin-dashboard/.env
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000
```
3. 🔧 Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Инициализация БД
alembic upgrade head

# Запуск сервера
uvicorn main:app --reload
```
4. 🌍 Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
# http://localhost:3001
```
5. 🛠️ Admin Dashboard Setup (Vite + React)
```bash
cd admin-dashboard
npm install
npm run dev
# http://localhost:3000
```
🔐 Аутентификация / Auth
JWT токены генерируются после входа (админка)

Поддержка Firebase OAuth (Google)

Токен используется в Authorization: Bearer <token>

📬 Telegram уведомления / Telegram Alerts
Новые проекты или изменения могут отправлять уведомления

Убедитесь, что бот добавлен в нужный чат и TELEGRAM_CHAT_ID указан верно

📤 GitHub API
Используется для отображения последних репозиториев

Если GITHUB_TOKEN не указан, лимит 60 запросов/час

📊 Админка (Dashboard)
Функции:

Управление проектами, навыками

Загрузка аватара, настройка главной страницы

Тёмная тема, смена пароля

Перетаскивание (drag & drop) скиллов

Графики активности

📁 Структура каталогов / Directory Overview
```bash

backend/
├── app/
│   ├── api/               # GitHub API, homepage router
│   ├── database.py
│   ├── models/            # SQLAlchemy models
│   ├── public_api/        # Публичные роуты
│   ├── routers/           # auth, projects, skills, telegram
│   └── utils/              # токены, пароли, уведомления
│   └── main.py             
└── .env
```
```bash
frontend/
├── app/components/        # TopBar, SkillsList
├── app/projects/          # Projects page
├── app/contacts/          # Контактная страница
└── globals.css
```
```bash
admin-dashboard/
├── components/            # Auth, Dashboard, Layout
├── context/               # Auth, Projects, Analytics
├── hooks/                 # useAuth, useProjects, etc.
├── pages/                 # LoginPage, DashboardPage
├── styles/                # Tailwind
└── api/                   # Axios, mockAnalytics
```
📄 Лицензия / License
MIT License — свободное использование, распространение и изменение.

✍️ Автор / Author: [JustSomeBodyBag]
📢 Pull requests & issues welcome!