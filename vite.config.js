import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ℹ️ vite-plugin-compression OLIB TASHLANDI:
// Render Static Site so'rov kelganda o'zi avtomatik Brotli/Gzip bilan siqib beradi.
// Oldindan .br/.gz fayl tayyorlashning keragi yo'q — Render baribir ularni ishlatmaydi,
// build vaqtini behuda yeyayotgan edi. Foydalanuvchi tezligiga ta'siri YO'Q edi.

export default defineConfig({
  // ✅ TUZATILDI: esbuild sozlamasi endi ROOT darajada (build ichida emas).
  // Vite buni faqat shu yerda tan oladi — build ichida bo'lsa e'tiborsiz qoldiriladi.
  esbuild: {
    drop: ['console', 'debugger'],
  },
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    minify: 'esbuild',
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true, // ✅ true qildik: har bir chunk faqat o'ziga kerakli CSS'ni yuklaydi (dastlabki CSS kichikroq bo'ladi)
    cssMinify: true,    // ✅ true qildik: CSS ham minify bo'lsin (avval false edi — bekorga katta fayl)
    reportCompressedSize: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'axios-vendor': ['axios'],
        },
        // ✅ YANGI: fayllarga hash qo'shiladi — brauzer eski JS/CSS'ni forever-cache qila oladi,
        // faqat o'zgargan fayllar qayta yuklanadi (keyingi tashriflarda sayt DARHOL ochiladi)
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      maxParallelFileOps: 20,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'axios'],
  },
})