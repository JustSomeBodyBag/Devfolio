# 🛠️ Devfolio Admin Dashboard

> 🇷🇺 Панель администратора для управления проектами, навыками и контентом  
> 🇺🇸 Admin dashboard for managing projects, skills, and homepage content

---

## 🚀 Технологии / Technologies

- **React 19** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (состояние)
- **MUI (Material UI)** — UI-компоненты
- **Chart.js** + **react-chartjs-2** — аналитика
- **Dnd-kit** — drag & drop
- **Axios**, **Firebase**, **JWT**

---

## ⚙️ Установка / Setup

```bash
# Клонируем репозиторий / Clone the repo
git clone https://github.com/your-username/devfolio.git
cd devfolio/admin-dashboard

# Устанавливаем зависимости / Install dependencies
npm install

# Запуск в dev-режиме / Start development server
npm run dev
```
🌐 Панель будет доступна по адресу:
http://localhost:5173 (или другим портом, если занят)


📁 Структура проекта / Project Structure
```bash
admin-dashboard/
├── api/               # Запросы к API и mock-данные аналитики
├── components/        # UI-компоненты (аватар, скиллы, настройки и др.)
│   ├── Auth/          # Авторизация (OAuth и логин)
│   ├── Dashboard/     # Основной дашборд
│   └── Layout/        # Layout: сайдбар, топбар и обёртка
├── context/           # Контексты: auth, проекты, аналитика, тема
├── hooks/             # Пользовательские хуки
├── pages/             # Основные страницы (LoginPage, DashboardPage)
├── styles/            # Tailwind CSS
├── types/             # Типизация
├── utils/             # Утилиты: JWT, crop, цвета
├── App.tsx            # Основной компонент
└── main.tsx           # Вход в приложение
```
💻 Скрипты / NPM Scripts
Скрипт	Назначение (RU)	Purpose (EN)
npm run dev	Запуск dev-сервера (Vite)	Start development server (Vite)
npm run build	Сборка проекта	Build for production
npm run preview	Предпросмотр production-сборки	Preview production build
npm run lint	ESLint проверка	Run ESLint
npm run build:css	Сборка Tailwind CSS	Compile Tailwind styles

🔐 Авторизация / Auth
Используется JWT (parseJwt.ts) и Firebase для OAuth.

При входе токен сохраняется и используется для последующих запросов.

📊 Аналитика / Analytics
Используется mockAnalytics.ts с Chart.js для отображения:

статистики посещений,

проектов,

активности.

🌍 Работа с API / API Integration
Настройки находятся в api/axios.ts:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```
📌 Убедись, что backend запущен по указанному адресу.

✨ UI и Drag & Drop
Компоненты интерфейса — Material UI

Цвета — через ColorPicker.tsx и tinycolor2

Drag & Drop (например, порядок скиллов) — @dnd-kit/*

📄 Лицензия / License
MIT License — можно свободно использовать, распространять и модифицировать.

🧑‍💼 Автор / Author: [JustSomeBodyBag]
📁 Репозиторий Devfolio состоит из:

backend/ — FastAPI сервер

frontend/ — публичный сайт

admin-dashboard/ — админка (ты здесь 👋)