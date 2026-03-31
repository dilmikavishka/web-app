import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:7000', // local backend IP + port
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // remove /api prefix
      },
    },
  },
});