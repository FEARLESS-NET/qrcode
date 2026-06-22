import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core (eng katta qism)
            if (id.includes('/react/') || id.includes('/react-dom/')) {
              return 'react-core';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'react-router';
            }
            // UI kutubxona
            if (id.includes('@material-tailwind')) {
              return 'ui';
            }
            // Axios
            if (id.includes('axios')) {
              return 'axios';
            }
            // Qolgan barcha node_modules
            return 'vendor';
            
          }
        },
      },
    },
  },
});
