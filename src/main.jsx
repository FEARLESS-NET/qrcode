import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ LAZY IMPORT - Sahifalar kechiktirilgan yuklanadi
const App = lazy(() => import('./App.jsx'));

// ✅ QueryClient yaratish - CACHE VAQTLARI OSHIRILDI
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // ✅ 5 → 10 daqiqa
      gcTime: 20 * 60 * 1000,    // ✅ 10 → 20 daqiqa
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ✅ Loading komponenti
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-yellow-400 mt-4 font-bold">Yuklanmoqda...</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);