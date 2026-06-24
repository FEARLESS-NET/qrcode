import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Tashqi kutubxonalarni alohida fayllarga ajratish
          vendor: ['react', 'react-dom', 'axios'],
          ui: ['@material-tailwind/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Ogohlantirish chegarasini oshirish (ixtiyoriy)
  },
});