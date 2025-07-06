import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Impor plugin

// https://vitejs.dev/config/
export default defineConfig({
  // Daftarkan plugin tailwindcss di sini
  plugins: [react(), tailwindcss()],
})