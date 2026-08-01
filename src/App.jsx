// App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavbarDefault } from './components/Navbar';
import { SimpleFooter } from './components/Footer';

// ✅ Sahifalar - LAZY QILINDI
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const Order = lazy(() => import('./pages/Order'));
const Reservation = lazy(() => import('./pages/Reservation'));
const Track = lazy(() => import('./pages/Track'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));

// ✅ QO'SHILDI - Suspense uchun fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-yellow-400 mt-4 font-bold">Yuklanmoqda...</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-yellow-400">404</h1>
      <p className="text-xl mt-4">Sahifa topilmadi</p>
      <a href="/" className="mt-6 inline-block px-6 py-3 bg-yellow-400 text-black rounded-xl font-bold">
        Bosh sahifaga qaytish
      </a>
    </div>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <NavbarDefault />
      <main className="flex-grow pt-20">
        {/* ✅ QO'SHILDI - Suspense lazy sahifalarni kutish uchun */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order" element={<Order />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/track" element={<Track />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <SimpleFooter />
    </div>
  );
}

export default App;
