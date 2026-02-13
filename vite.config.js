import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/luccanunes/',
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1000, // Aumenta o limite para 1000kB
  }
})
