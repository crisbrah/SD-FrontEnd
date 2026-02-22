import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://sd-backend-s7yo.onrender.com',
        changeOrigin: true,
      },
      '/auth': {
        target: 'https://sd-backend-s7yo.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
