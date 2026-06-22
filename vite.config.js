import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // ✅ MANUAL CHUNKS NI O'CHIRIB QO'YAMIZ (VAQTINCHA)
        // manualChunks: {},
        
        // YOKI FAQAT KATTA PAKETLARNI AJRATAMIZ
        manualChunks: {
          // React ni alohida (lekin boshqa hech narsa)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});