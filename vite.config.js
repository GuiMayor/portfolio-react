import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // rutas relativas
  plugins: [
    react()
  ],
})
