// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavbarDefault } from './components/Navbar';
import { SimpleFooter } from './components/Footer';

// Sahifalar
import Home from './pages/Home';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Reservation from './pages/Reservation';
import Track from './pages/Track';
import Admin from './pages/Admin';
import Login from './pages/Login';

// 404 sahifasi (agar mavjud bo'lmasa, yaratishingiz mumkin)
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
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-black">
        <NavbarDefault />
        <main className="flex-grow pt-20">
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
        </main>
        <SimpleFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;