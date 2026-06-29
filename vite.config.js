// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      // fsevents ni external qilish (Windows uchun)
      external: ['fsevents'],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'http': ['axios'],
          'state': ['@tanstack/react-query'],
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },
})