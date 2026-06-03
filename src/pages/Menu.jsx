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
    <div className="relative overflow-hidden bg-black/40 border border-cyan-500/20 rounded-[30px] h-[420px] animate-pulse backdrop-blur-2xl">
      <div className="h-56 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"></div>
      <div className="p-8 space-y-5">
        <div className="h-7 bg-cyan-500/10 rounded-full w-3/4"></div>
        <div className="h-4 bg-white/10 rounded-full w-full"></div>
        <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-20"></div>
      </div>
      <div className="absolute inset-0 border border-cyan-400/10 rounded-[30px] shadow-[0_0_60px_rgba(0,255,255,0.05)]"></div>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-black text-white">

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#020617]"></div>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        ></div>
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[180px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, rgba(255,255,255,0.15) 1px, transparent 2px)",
            backgroundSize: "100% 6px",
          }}
        ></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-28">

        {/* HEADER */}
        <header className="text-center mb-20 sm:mb-36">
          <span className="inline-block text-cyan-400 font-black tracking-[0.6em] uppercase text-[10px] sm:text-xs mb-7 animate-pulse">
            ⚡ CYBER MENU SYSTEM ⚡
          </span>
          <h2 className="relative inline-block text-5xl sm:text-7xl md:text-9xl font-black uppercase italic tracking-tight text-white transition-all duration-500 hover:scale-105">
            <span className="relative z-10">
              ASOSIY{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-pulse">
                MENU
              </span>
            </span>
            <div className="absolute inset-0 blur-3xl bg-cyan-500/20"></div>
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_30px_cyan]"></div>
          </div>
        </header>

        {/* CARDS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-20">
            Hozircha menu mavjud emas. Admin paneldan qo'shing! 🍽️
          </div>
        ) : (
          Object.keys(groupedMenus).map((category) => (
            <section key={category} className="mb-24 sm:mb-36">

              {/* CATEGORY TITLE */}
              <div className="flex items-center gap-5 sm:gap-8 mb-12 sm:mb-16 group">
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_20px_cyan] animate-pulse"></div>
                <h3 className="text-2xl sm:text-5xl font-black uppercase tracking-[0.25em] text-white group-hover:text-cyan-400 transition-all duration-300">
                  {category}
                </h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500/80 to-transparent shadow-[0_0_20px_cyan]"></div>
              </div>

              {/* MENU CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
                {groupedMenus[category].map((menu) => (
                  <div
                    key={menu._id} // ✅ TUZATILDI: menu.id → menu._id (MongoDB)
                    className="group relative overflow-hidden bg-white/[0.03] backdrop-blur-3xl border border-cyan-500/20 rounded-[32px] transition-all duration-500 hover:scale-[1.05] hover:border-cyan-400 hover:shadow-[0_0_80px_rgba(0,255,255,0.3)]"
                  >
                    <div className="absolute inset-0 rounded-[32px] border border-cyan-400/0 group-hover:border-cyan-400/40 transition-all duration-500"></div>

                    {/* IMAGE */}
                    <div className="relative h-56 sm:h-72 overflow-hidden">
                      <img
                        src={menu.image || "https://via.placeholder.com/400x300?text=No+Image"}
                        alt={menu.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 brightness-75 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-screen"></div>
                      </div>

                      {/* PRICE */}
                      <div className="absolute top-4 right-4 bg-black/80 border border-cyan-400/40 px-4 py-2 rounded-xl backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.25)] group-hover:scale-110 transition-all duration-300">
                        <span className="text-cyan-400 font-black tracking-wider text-sm">
                          {Number(menu.price).toLocaleString()} so'm
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="relative p-5 sm:p-8">
                      <h4 className="text-xl sm:text-3xl font-black mb-3 text-white group-hover:text-cyan-400 transition-all duration-300">
                        {menu.name}
                      </h4>
                      <p className="text-gray-400 text-sm italic leading-relaxed group-hover:text-gray-200 transition-all duration-300">
                        "{menu.retsept}"
                      </p>
                      <div className="mt-6 h-[3px] w-14 rounded-full overflow-hidden bg-white/10 group-hover:w-full transition-all duration-500">
                        <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-pulse"></div>
                      </div>
                    </div>

                    <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-2xl bg-cyan-500/10 transition duration-500"></div>
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
