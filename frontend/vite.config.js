import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/portfolio-react/',  // <-- agrega esta línea
  plugins: [
    react(),
    tailwindcss(),
  ],
})
