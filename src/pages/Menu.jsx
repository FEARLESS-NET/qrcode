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
    <div className="bg-white/5 border border-white/10 rounded-3xl h-[320px] sm:h-[400px] animate-pulse">
      <div className="h-40 sm:h-56 bg-white/10 rounded-t-3xl"></div>
      <div className="p-4 sm:p-6 space-y-4">
        <div className="h-5 sm:h-6 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-6 sm:h-8 bg-white/10 rounded-xl w-20"></div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]"></div>
        <div className="absolute top-[-10%] left-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        
        {/* HEADER */}
        <header className="text-center mb-16 sm:mb-24">
          <span className="text-cyan-400 font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-4 block animate-bounce">
            Premium Taste
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 italic tracking-tight">
            ASOSIY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">MENU</span>
          </h2>

          <div className="w-20 sm:w-32 h-1.5 bg-gradient-to-r from-cyan-500 to-green-500 mx-auto rounded-full"></div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : (
          Object.keys(groupedMenus).map((category) => (
            <section key={category} className="mb-16 sm:mb-24">
              
              {/* CATEGORY */}
              <div className="flex items-center gap-3 sm:gap-6 mb-8 sm:mb-12">
                <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-widest italic">
                  {category}
                </h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500/50 via-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
                {groupedMenus[category].map((menu) => (
                  <div
                    key={menu.id}
                    className="group relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden transition-all duration-500 hover:scale-[1.03]"
                  >
                    
                    {/* IMAGE */}
                    <div className="relative h-48 sm:h-64 overflow-hidden">
                      <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>

                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 px-3 sm:px-4 py-1 rounded-full">
                        <span className="text-cyan-400 font-black text-xs sm:text-sm">
                          {menu.price}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 sm:p-8">
                      <h4 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                        {menu.name}
                      </h4>

                      <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 italic">
                        "{menu.retsept}"
                      </p>

                      <div className="w-8 sm:w-10 h-1 bg-cyan-500 rounded-full"></div>
                    </div>

                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 text-center pb-8 sm:pb-12">
        <div className="h-[1px] w-1/2 sm:w-1/4 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6 sm:mb-8"></div>
        <p className="text-white/30 text-[8px] sm:text-[10px] tracking-[0.5em] sm:tracking-[0.8em] uppercase font-bold">
          © 2026 LUXURY NEON DINING
        </p>
      </footer>
    </div>
  );
};

export default Menu;