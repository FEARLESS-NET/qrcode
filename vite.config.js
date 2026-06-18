import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://backend-2-nik3.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://backend-2-nik3.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@material-tailwind/react'],
          api: ['axios']
        }
      }
    }
  }
});