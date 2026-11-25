import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: GitHub Pages serves the app from /book-tracker/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/book-tracker/' : '/',
  plugins: [react(), tailwindcss()],
}))
