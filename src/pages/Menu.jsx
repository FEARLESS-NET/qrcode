import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";

// ✅ env dan olinadi, hardcode URL yo'q
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3005';

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { getMenus(); }, []);

  const getMenus = async () => {
    try {
      const res = await axiosInstance.get("/menus");
      setMenus(Array.isArray(res.data.menus) ? res.data.menus : []);
    } catch (error) {
      console.error("Xatolik:", error);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedMenus = useMemo(() => {
    return menus.reduce((acc, menu) => {
      const category = menu.category || "Boshqa";
      if (!acc[category]) acc[category] = [];
      acc[category].push(menu);
      return acc;
    }, {});
  }, [menus]);

  // ✅ Rasm URL to'g'ri
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  const SkeletonCard = () => (
    <div className="relative overflow-hidden bg-black/40 border border-teal-500/20 rounded-[30px] h-[420px] animate-pulse backdrop-blur-2xl">
      <div className="h-56 bg-gradient-to-br from-teal-500/10 via-transparent to-amber-500/10"></div>
      <div className="p-8 space-y-5">
        <div className="h-7 bg-teal-500/10 rounded-full w-3/4"></div>
        <div className="h-4 bg-white/10 rounded-full w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-black text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">

        {/* MENU BANNER */}
        <div className="relative h-64 sm:h-80 rounded-[36px] overflow-hidden border border-yellow-500/15 mb-12">
          <img
            src="https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=1600&q=80"
            alt="Sazanchik milliy taomlari"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-black/20"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-yellow-400 uppercase tracking-[0.35em] text-[11px] font-black mb-3">
              🐟 Sazanchik
            </span>
            <h2 className="text-5xl font-black text-white">
              ASOSIY <span className="text-teal-400">MENU</span>
            </h2>
            <p className="text-gray-300 mt-3">Sevimli taomingizni tanlang</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => navigate("/order")}
            className="group relative overflow-hidden px-10 py-4 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-amber-400 text-black font-black uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(20,184,166,0.5)]"
          >
            🛒 Online Zakaz Berish
          </button>
          <button
            onClick={() => navigate("/reservation")}
            className="px-10 py-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 font-black uppercase tracking-[0.2em] transition-all hover:bg-yellow-500/10 hover:border-yellow-400 hover:scale-105"
          >
            🪑 Stol Bron Qilish
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-20">Menu yo'q</div>
        ) : (
          Object.keys(groupedMenus).map((category) => (
            <section key={category} className="mb-20">
              <h3 className="text-2xl font-bold text-teal-400 mb-6 border-b border-teal-500/10 pb-3">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedMenus[category].map((menu) => (
                  <div key={menu._id} className="group bg-white/5 border border-teal-500/20 rounded-2xl overflow-hidden transition-all hover:scale-[1.03] hover:border-teal-400/50">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImageUrl(menu.image)}
                        alt={menu.name}
                        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {menu.category && (
                        <span className="absolute top-3 right-3 bg-black/60 border border-teal-400/30 px-3 py-1 rounded-xl text-teal-400 text-[10px] uppercase tracking-widest">
                          {menu.category}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="text-lg font-black text-white group-hover:text-teal-400 transition-colors">{menu.name}</h4>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{menu.retsept}</p>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-teal-400 font-black text-lg">{Number(menu.price).toLocaleString()} so'm</p>
                        <button
                          onClick={() => navigate("/order")}
                          className="px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold hover:bg-teal-400 hover:text-black transition-all"
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
