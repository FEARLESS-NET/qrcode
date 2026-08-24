/**
 * Asosiy marshrutlar (Routing).
 * Navbar va Footer global, sahifalar lazy yuklanadi.
 */
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavbarDefault } from './components/Navbar';
import { SimpleFooter } from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const Order = lazy(() => import('./pages/Order'));
const Reservation = lazy(() => import('./pages/Reservation'));
const Track = lazy(() => import('./pages/Track'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));

const LoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black"></div>
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `
        repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,180,40,0.03) 50px, rgba(255,180,40,0.03) 51px),
        repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(255,180,40,0.03) 50px, rgba(255,180,40,0.03) 51px)
      `
    }}></div>
    
    {/* Animated particles */}
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-[#FFC93C] rounded-full animate-pulse"
        style={{
          left: `${(i * 8 + 3) % 100}%`,
          top: `${(i * 7 + 5) % 100}%`,
          animationDelay: `${i * 0.3}s`,
          opacity: 0.3 + (i % 3) * 0.2,
          filter: 'blur(1px)'
        }}
      />
    ))}

    {/* Glow effects */}
    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#E08A3C]/10 blur-[150px] animate-pulse" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FFDD73]/10 blur-[150px] animate-pulse delay-700" />

    {/* Main content */}
    <div className="relative z-10 text-center">
      {/* Logo/Brand name */}
      <div className="mb-8">
        <h1 className="text-6xl sm:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB0] via-[#FFA23D] to-[#FF5A1F] animate-gradient-shine tracking-tight">
          QOZONDA
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#FFC93C]"></div>
          <span className="text-[#FFDD73] text-sm tracking-[0.5em] font-bold uppercase">Premium</span>
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#FFC93C]"></div>
        </div>
      </div>

      {/* Animated loading indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-[#FFC93C] animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              boxShadow: '0 0 20px rgba(255, 201, 60, 0.5)'
            }}
          />
        ))}
      </div>

      {/* Loading text with animation */}
      <p className="text-gray-400 text-sm tracking-[0.3em] uppercase animate-pulse">
        <span className="inline-block animate-pulse">⏳</span> Yuklanmoqda
      </p>
    </div>

    {/* Bottom accent */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#FFC93C]/50"></div>
        <div className="w-2 h-2 rounded-full bg-[#FFC93C] animate-pulse"></div>
        <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#FFC93C]/50"></div>
      </div>
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