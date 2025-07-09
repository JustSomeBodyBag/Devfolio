# 🚀 Devfolio Backend (FastAPI)

Multilingual README | Многоязычный README  
**English 🇬🇧 | Русский 🇷🇺**

---

## 📦 English

### 📚 Overview

**Devfolio Backend** is a FastAPI-based server application for portfolio management. It includes authentication, GitHub integration, Telegram bot notifications, admin dashboards, image uploads, and public API access.

---

### 🧩 Features

- 🔐 JWT-based authentication
- 🧑‍💻 GitHub project fetcher
- 🧠 Skills & projects CRUD (admin)
- 🌍 Public API endpoints
- 🤖 Telegram bot integration
- 🖼 Avatar and image uploads
- 📅 Scheduler with auto-refresh

---

### 🛠 Setup

```bash
git clone <repo-url>
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

⚙️ Environment Variables (.env)
Create a .env file in the backend/ directory:

```env
# App
APP_NAME=DevfolioAPI
ENV=development
PORT=8000

# GitHub
GITHUB_USERNAME=JustSomeBodyBag
GITHUB_TOKEN=your_github_token  # Optional

# Database
DATABASE_URL=sqlite:///./projects.db

# Auth
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Scheduler
REFRESH_INTERVAL_HOURS=12
❗ Don't commit .env to Git. Add it to .gitignore.
```
🚀 Running the Server

```bash
uvicorn app.main:app --reload
Server runs at: http://localhost:8000
```
📡 API Routes
Endpoint	Description
/auth/*	Login & JWT token
/github/*	Fetch GitHub repos
/admin/projects/*	Admin project CRUD
/admin/skills/*	Admin skills CRUD
/projects	Public project list
/skills	Public skills list
/uploads/*	Static file serving
/api/telegram/*	Telegram API
/homepage	Homepage data

🖼 Image Uploads
POST /admin/avatar — Upload user avatars

Stored in uploads/avatars/

Screenshots stored in uploads/screenshots/

🔄 Scheduler
Runs auto-refresh of GitHub data every REFRESH_INTERVAL_HOURS.
Manual run: python run_fetcher.py

👤 Admin Creation
bash
`
python create_user.py
`
✅ Testing
`pytest`


🇷🇺 Русский
📚 Описание
Devfolio Backend — сервер на FastAPI для управления портфолио. Поддерживает авторизацию, GitHub-интеграцию, телеграм-уведомления, административные панели, загрузку изображений и публичный API.

🧩 Возможности
🔐 Авторизация через JWT

🧑‍💻 Импорт репозиториев GitHub

🧠 CRUD проектов и навыков (админ)

🌍 Публичные API точки

🤖 Интеграция с Telegram-ботом

🖼 Загрузка аватаров и скриншотов

📅 Планировщик с автообновлением

🛠 Установка
bash
```git clone <repo-url>
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt```

⚙️ Переменные окружения (.env)
Создай .env в backend/:

```env
# Приложение
APP_NAME=DevfolioAPI
ENV=development
PORT=8000

# GitHub
GITHUB_USERNAME=JustSomeBodyBag
GITHUB_TOKEN=your_github_token  # можно оставить пустым

# БД
DATABASE_URL=sqlite:///./projects.db

# Авторизация
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Планировщик
REFRESH_INTERVAL_HOURS=12
```❗ Не загружай .env в Git. Добавь в .gitignore.


🚀 Запуск сервера
```bash
uvicorn app.main:app --reload
Доступ по адресу: http://localhost:8000
```

📡 API Роутеры
Путь	Назначение
/auth/*	Авторизация и токены
/github/*	Импорт проектов GitHub
/admin/projects/*	Управление проектами
/admin/skills/*	Управление навыками
/projects	Список проектов (публично)
/skills	Список навыков (публично)
/uploads/*	Доступ к загруженным файлам
/api/telegram/*	Телеграм API
/homepage	Данные для главной

🖼 Загрузка изображений
POST /admin/avatar — Загрузка аватаров

Сохраняются в uploads/avatars/

Скриншоты — uploads/screenshots/

🔄 Планировщик
Автоматически обновляет данные GitHub каждые REFRESH_INTERVAL_HOURS.
Можно вручную: python run_fetcher.py

👤 Создание администратора
```bash
python create_user.py
```
✅ Тестирование
```bash
pytest```
🧾 License
MIT License

📬 Contacts
GitHub: JustSomeBodyBag

Telegram: https://t.me/JustSomeBodyBag

