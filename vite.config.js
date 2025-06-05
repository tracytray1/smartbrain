import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 10000,
    allowedHosts: ['smartbrain-19fz.onrender.com']
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 10000
  }
})
