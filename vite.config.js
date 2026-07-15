import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    minify: 'esbuild',
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    // ✅ KESIN O'ZGARISH: rollupOptions ni to'g'rilash
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ✅ React va uning ekotizimi
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor'
          }
          // ✅ Query client
          if (id.includes('node_modules/@tanstack/react-query/')) {
            return 'query-vendor'
          }
          // ✅ Axios
          if (id.includes('node_modules/axios/')) {
            return 'axios-vendor'
          }
          // ✅ Boshqa vendorlar (ixtiyoriy)
          if (id.includes('node_modules/')) {
            return 'vendor'
          }
        },
        // ✅ Fayl nomlarini qisqartirish
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@tanstack/react-query', 
      'axios'
    ],
    exclude: [],
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // ✅ Qo'shimcha: tree shaking yaxshilash
    treeShaking: true,
  },
  // ✅ Qo'shimcha: CSS optimallashtirish
  css: {
    devSourcemap: false,
  },
})
