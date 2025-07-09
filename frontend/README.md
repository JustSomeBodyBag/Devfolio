# 🌐 Devfolio Frontend

> 🇷🇺 Интерфейс портфолио на React/Next.js  
> 🇺🇸 Frontend for personal Devfolio built with React/Next.js

---

## 🚀 Технологии / Technologies

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Axios** (для работы с API)

---

## 🛠️ Установка / Setup

```bash
# Клонируем репозиторий / Clone the repo
git clone https://github.com/your-username/devfolio.git
cd devfolio/frontend

# Устанавливаем зависимости / Install dependencies
npm install

# Запуск в режиме разработки / Start in development mode
npm run dev
🖥 Интерфейс будет доступен по адресу:
http://localhost:3001
```
📁 Структура проекта / Project structure
```
frontend/
├── api/                # Axios настройки для API
├── app/
│   ├── components/     # Компоненты UI (SkillsList, TopBar и др.)
│   ├── contacts/       # Страница контактов
│   ├── projects/       # Страница проектов
│   ├── globals.css     # Глобальные стили
│   ├── layout.tsx      # Общий layout
│   └── page.tsx        # Главная страница
```
⚙️ Скрипты / NPM Scripts
```Скрипт	Назначение (RU)	Purpose (EN)
npm run dev	Запуск dev-сервера (порт 3001)	Start dev server (port 3001)
npm run build	Сборка production версии	Build for production
npm run start	Запуск production-сервера	Start production server
npm run lint	Проверка кода с ESLint	Run ESLint checks
```

🌍 Связь с Backend / Backend API
Axios настроен для обращения к API по адресу (см. api/axios.ts):

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
Убедись, что бэкенд работает на http://localhost:8000.
```

📦 Зависимости / Dependencies
Основные библиотеки:

react, react-dom, next, typescript

axios — для HTTP-запросов

tailwindcss — утилитарные стили

framer-motion — анимации

📄 Лицензия / License
MIT — свободно использовать, редактировать и распространять.

🧑‍💻 Автор / Author: [JustSomeBodyBag]
🌟 Добро пожаловать в мир красивых портфолио!