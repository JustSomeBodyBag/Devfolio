// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import "./polyfill.js";

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  server: {
    port: 5173,
    // Чтобы dev-сервер корректно работал с базовым путем
    open: '/admin/',
  }
})
