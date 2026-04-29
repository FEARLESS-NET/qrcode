import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = async () => {
    try {
      const res = await axiosInstance.get("/menus");
      setMenus(Array.isArray(res.data.menus) ? res.data.menus : []);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedMenus = menus.reduce((acc, menu) => {
    const category = menu.category || "Boshqa";
    if (!acc[category]) acc[category] = [];
    acc[category].push(menu);
    return acc;
  }, {});

  const SkeletonCard = () => (
    <div className="bg-white/5 border border-white/10 rounded-[32px] h-[400px] animate-pulse">
      <div className="h-56 bg-white/10 rounded-t-[32px]"></div>
      <div className="p-8 space-y-4">
        <div className="h-6 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-1 bg-white/10 rounded w-10"></div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-[#030303] overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* 1. YANADA YORQIN FON (BACKGROUND) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0a0a0a] via-[#050505] to-black"></div>
        {/* Neon dog'lar - intensivlik oshirildi */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-cyan-600/20 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-purple-600/20 rounded-full blur-[140px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        
        {/* HEADER */}
        <header className="text-center mb-20 sm:mb-32">
          <span className="text-cyan-400 font-black tracking-[0.5em] uppercase text-[10px] sm:text-xs mb-6 block animate-pulse">
            ✨ Tajriba va Mahorat ✨
          </span>

          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-8 italic tracking-tighter uppercase">
            ASOSIY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">MENU</span>
          </h2>

          <div className="relative w-24 sm:w-48 h-2 bg-white/5 mx-auto rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-green-500 to-cyan-500 animate-[shimmer_2s_infinite] w-[200%]"></div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : (
          Object.keys(groupedMenus).map((category) => (
            <section key={category} className="mb-24 sm:mb-32">
              
              {/* CATEGORY TITLE */}
              <div className="flex items-center gap-4 sm:gap-8 mb-12 sm:mb-16 group">
                <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-[0.2em] italic group-hover:text-cyan-400 transition-colors duration-500">
                  {category}
                </h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500 via-cyan-500/20 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                {groupedMenus[category].map((menu) => (
                  <div
                    key={menu.id}
                    className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] overflow-hidden transition-all duration-700 
                               hover:scale-[1.06] hover:border-cyan-400/50 hover:shadow-[0_0_60px_rgba(6,182,212,0.25)] transform-gpu cursor-pointer"
                  >
                    
                    {/* IMAGE CONTAINER */}
                    <div className="relative h-56 sm:h-72 overflow-hidden">
                      <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110 group-hover:rotate-1"
                      />

                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors duration-500"></div>

                      {/* PRICE TAG - SUPER GLOW */}
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl transition-all duration-500 
                                    group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] group-hover:-translate-y-1">
                        <span className="text-cyan-400 font-black text-sm sm:text-base tracking-tighter">
                          {menu.price}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6 sm:p-10 relative">
                      <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 transition-all duration-500 group-hover:text-cyan-400 group-hover:translate-x-1">
                        {menu.name}
                      </h4>

                      <p className="text-gray-400 text-xs sm:text-sm mb-6 line-clamp-2 italic font-light leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
                        "{menu.retsept}"
                      </p>

                      {/* NEON LINE ANIMATION */}
                      <div className="relative h-1 w-12 bg-white/10 rounded-full overflow-hidden transition-all duration-500 group-hover:w-full group-hover:shadow-[0_0_15px_rgba(6,182,212,1)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 animate-pulse"></div>
                      </div>
                    </div>

                    {/* HOVER GLOW RADIAL */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[40px] blur opacity-0 group-hover:opacity-10 transition duration-1000 group-hover:duration-200"></div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 text-center pb-12 opacity-50">
        <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-8"></div>
        <p className="text-white text-[10px] tracking-[1em] uppercase font-black">
          © 2026 LUXURY NEON DINING
        </p>
      </footer>

      {/* Custom Shimmer Animation for CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Menu;