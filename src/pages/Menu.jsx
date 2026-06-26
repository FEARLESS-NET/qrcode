import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from "../api/axios";

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3005';

// ✅ GET MENUS FUNKSIYASI (React Query uchun)
const getMenus = async () => {
  const res = await axiosInstance.get("/menus");
  return res.data;
};

const Menu = () => {
  const navigate = useNavigate();

  // ✅ React Query orqali ma'lumot olish
  const { data, isLoading, error } = useQuery({
    queryKey: ['menus'],
    queryFn: getMenus,
    staleTime: 5 * 60 * 1000, // 5 daqiqa cache
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ✅ Ma'lumotlarni olish
  const menus = data?.menus || [];

  // ✅ Kategoriyalar bo'yicha guruhlash
  const groupedMenus = useMemo(() => {
    return menus.reduce((acc, menu) => {
      const category = menu.category || "Boshqa";
      if (!acc[category]) acc[category] = [];
      acc[category].push(menu);
      return acc;
    }, {});
  }, [menus]);

  // ✅ Rasm URL ni olish
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  // ✅ Skeleton (yuklanayotganda)
  const SkeletonCard = () => (
    <div className="relative overflow-hidden bg-black/40 border border-yellow-500/20 rounded-[30px] h-[420px] animate-pulse backdrop-blur-2xl">
      <div className="h-56 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10"></div>
      <div className="p-8 space-y-5">
        <div className="h-7 bg-yellow-500/10 rounded-full w-3/4"></div>
        <div className="h-4 bg-white/10 rounded-full w-full"></div>
      </div>
    </div>
  );

  // ✅ Xatolik bo'lsa
  if (error) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a] text-white px-4 py-28">
        <div className="text-center">
          <p className="text-red-400 text-2xl font-bold">❌ Xatolik yuz berdi</p>
          <p className="text-gray-400 mt-2">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden text-white font-serif">

      {/* 🌟 FULL RESTAURANT BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1920&q=80"
          alt="Restaurant background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/85"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 via-transparent to-amber-500/5"></div>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,215,0,0.03) 50px, rgba(255,215,0,0.03) 51px),
            repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(255,215,0,0.03) 50px, rgba(255,215,0,0.03) 51px)
          `
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-28">

        {/* MENU BANNER */}
        <div className="relative h-80 sm:h-96 rounded-[40px] overflow-hidden border border-yellow-500/20 mb-16 shadow-[0_0_80px_rgba(255,215,0,0.05)]">
          <img
            src="https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=1600&q=80"
            alt="Sazanchik milliy taomlari"
            className="absolute inset-0 w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-yellow-400 uppercase tracking-[0.5em] text-xs font-bold mb-4">
              🐟 Sazanchik · Premium
            </span>
            <h2 className="text-5xl sm:text-7xl font-serif font-bold text-white drop-shadow-[0_0_50px_rgba(255,215,0,0.2)]">
              ASOSIY <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500">MENU</span>
            </h2>
            <p className="text-gray-300 mt-4 text-lg font-light tracking-wider">Sevimli taomingizni tanlang</p>
          </div>
          <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-2xl"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-2xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-2xl"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-yellow-500/30 rounded-br-2xl"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
          <button
            onClick={() => navigate("/order")}
            className="group relative overflow-hidden px-14 py-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black font-serif font-bold text-base uppercase tracking-[0.25em] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] active:scale-95"
          >
            <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition duration-500"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            🛒 Online Zakaz
          </button>
          <button
            onClick={() => navigate("/reservation")}
            className="px-14 py-5 rounded-2xl border-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-serif font-bold text-base uppercase tracking-[0.25em] transition-all hover:bg-yellow-500/20 hover:border-yellow-400 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.1)]"
          >
            🪑 Stol Bron
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center text-gray-500 text-2xl py-20 font-serif">Menu yo'q</div>
        ) : (
          Object.keys(groupedMenus).map((category) => (
            <section key={category} className="mb-20">
              <h3 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 mb-8 border-b border-yellow-500/15 pb-5 tracking-wide drop-shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedMenus[category].map((menu) => (
                  <div key={menu._id} className="group bg-black/50 backdrop-blur-3xl border border-yellow-500/20 rounded-2xl overflow-hidden transition-all hover:scale-[1.04] hover:border-yellow-400/50 hover:shadow-[0_0_50px_rgba(255,215,0,0.08)]">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={getImageUrl(menu.image)}
                        alt={menu.name}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      {menu.category && (
                        <span className="absolute top-4 right-4 bg-black/70 border border-yellow-400/30 px-4 py-1.5 rounded-xl text-yellow-400 text-[10px] uppercase tracking-widest font-bold backdrop-blur-xl">
                          {menu.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-serif font-bold text-white group-hover:text-yellow-400 transition-colors">{menu.name}</h4>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2 font-light">{menu.retsept}</p>
                      <div className="flex items-center justify-between mt-5">
                        <p className="text-yellow-400 font-serif font-bold text-xl">{Number(menu.price).toLocaleString()} so'm</p>
                        <button
                          onClick={() => navigate("/order")}
                          className="px-6 py-2.5 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-bold hover:bg-yellow-400 hover:text-black transition-all hover:shadow-[0_0_25px_rgba(255,215,0,0.2)]"
                        >
                          Buyurtma
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;