// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import "./polyfill.js";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
