// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://34.160.54.179',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      }
    }
  }
})