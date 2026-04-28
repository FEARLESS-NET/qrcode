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
    <div className="bg-white/5 border border-white/10 rounded-3xl h-[400px] animate-pulse">
      <div className="h-56 bg-white/10 rounded-t-3xl"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-8 bg-white/10 rounded-xl w-20"></div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden">
      
      {/* DINAMIK FON EFFEKTLARI */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]"></div>
        {/* Neon Orblar */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        
        {/* HEADER */}
        <header className="text-center mb-24">
          <span className="text-cyan-400 font-bold tracking-[0.4em] uppercase text-xs mb-4 block animate-bounce">
            Premium Taste
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 italic tracking-tight">
            ASOSIY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">MENU</span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 to-green-500 mx-auto rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : (
          Object.keys(groupedMenus).map((category) => (
            <section key={category} className="mb-24">
              
              {/* Kategoriya Sarlavhasi */}
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-3xl font-black text-white uppercase tracking-widest italic">
                  {category}
                </h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500/50 via-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {groupedMenus[category].map((menu) => (
                  <div
                    key={menu.id}
                    className="group relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(0,242,255,0.15)]"
                  >
                    {/* Rasm va Neon Overlay */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
                      
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full">
                        <span className="text-cyan-400 font-black text-sm">
                          {menu.price}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                        {menu.name}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 font-light italic opacity-70 group-hover:opacity-100 transition-opacity">
                        "{menu.retsept}"
                      </p>
                      
                      {/* Dekorativ Chiziq */}
                      <div className="w-10 h-1 bg-cyan-500 rounded-full transition-all duration-500 group-hover:w-full"></div>
                    </div>

                    {/* Hoverda chiqadigan nur (Glow) */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-green-500 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10"></div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 text-center pb-12">
        <div className="h-[1px] w-1/4 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>
        <p className="text-white/30 text-[10px] tracking-[0.8em] uppercase font-bold">
          © 2026 LUXURY NEON DINING
        </p>
      </footer>
    </div>
  );
};

export default Menu;  