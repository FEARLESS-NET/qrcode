/**
 * Asosiy marshrutlar (Routing).
 * Navbar va Footer global, sahifalar lazy yuklanadi.
 */
import React, { lazy, Suspense, useState, useEffect } from 'react';
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

const LoadingFallback = () => {
  const letters = "QOZONDA".split("");
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Loading screenni 3 sekund ko'rsatish
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#130e0a] overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#130e0a] via-[#0a0806] to-[#130e0a]"></div>
      
      {/* Stronger grid pattern */}
      <div className="absolute inset-0 opacity-[0.12]" style={{
        backgroundImage: `
          linear-gradient(rgba(255,180,40,0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,180,40,0.2) 1px, transparent 1px)
        `,
        backgroundSize: "35px 35px",
      }}></div>
      
      {/* Enhanced fire glow effects */}
      <div className="absolute top-[-30%] left-[-25%] w-[800px] h-[800px] bg-[#FF5A1F]/25 blur-[250px] animate-pulse"></div>
      <div className="absolute bottom-[-30%] right-[-25%] w-[800px] h-[800px] bg-[#FFC93C]/25 blur-[250px] animate-pulse delay-700"></div>
      <div className="absolute top-[25%] left-[35%] w-[500px] h-[500px] bg-[#E08A3C]/20 blur-[200px] animate-pulse delay-300"></div>
      <div className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] bg-[#FFDD73]/15 blur-[180px] animate-pulse delay-500"></div>
      
      {/* Enhanced ember particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="ember-particle"
          style={{
            left: `${(i * 3.3 + 1) % 100}%`,
            animationDuration: `${3.5 + (i % 5) * 1}s`,
            animationDelay: `${i * 0.3}s`,
            "--drift": `${((i % 3) - 1) * 60}px`,
            "--size": `${2 + (i % 4)}px`
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo/Brand name with letter-by-letter animation */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tight flex justify-center gap-1 sm:gap-2">
            {letters.map((letter, index) => (
              <span
                key={index}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB0] via-[#FFA23D] to-[#FF5A1F] animate-gradient-shine"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  textShadow: '0 0 50px rgba(255, 90, 31, 0.5), 0 0 100px rgba(255, 201, 60, 0.3)',
                  filter: 'drop-shadow(0 0 30px rgba(255, 162, 61, 0.4))'
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          
          {/* Enhanced fire-like underline */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-[3px] w-20 bg-gradient-to-r from-transparent via-[#FFC93C] to-transparent animate-pulse"></div>
            <span className="text-[#FFDD73] text-sm sm:text-base tracking-[0.5em] font-bold uppercase" style={{
              textShadow: '0 0 30px rgba(255, 201, 60, 0.6), 0 0 60px rgba(255, 90, 31, 0.4)'
            }}>
              Premium
            </span>
            <div className="h-[3px] w-20 bg-gradient-to-r from-transparent via-[#FFC93C] to-transparent animate-pulse delay-300"></div>
          </div>
        </div>

        {/* Enhanced loading indicator */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-[#FFC93C] animate-pulse"
              style={{
                animationDelay: `${i * 0.15}s`,
                boxShadow: '0 0 25px rgba(255, 201, 60, 0.7), 0 0 50px rgba(255, 90, 31, 0.5)'
              }}
            />
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-gradient-to-r from-[#FF5A1F] via-[#FFC93C] to-[#FFDD73] rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/50 rounded-full transition-all duration-100"
              style={{
                width: loaded ? '100%' : '0%',
                transition: 'width 3s ease-out'
              }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced bottom accent */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3">
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#FFC93C]/80"></div>
          <div className="w-4 h-4 rounded-full bg-[#FFC93C] animate-pulse" style={{
            boxShadow: '0 0 30px rgba(255, 201, 60, 0.9), 0 0 60px rgba(255, 90, 31, 0.6)'
          }}></div>
          <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#FFC93C]/80"></div>
        </div>
      </div>
    </div>
  );
};



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