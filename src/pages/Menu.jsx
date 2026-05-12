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
    <div className=" w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg">

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0a0a0a] via-[#050505] to-black"></div>

        <div className="absolute top-[-10%] left-[-10%] w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-cyan-600/20 rounded-full blur-[140px] animate-pulse"></div>

        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-purple-600/20 rounded-full blur-[140px] animate-pulse delay-700"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-24">

        {/* HEADER */}
        <header className="text-center mb-16 sm:mb-32">

          <span className="text-cyan-400 font-black tracking-[0.5em] uppercase text-[10px] sm:text-xs mb-5 block animate-pulse">
            ✨ Tajriba va Mahorat ✨
          </span>

          {/* TITLE */}
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 italic tracking-tighter uppercase
            group cursor-pointer transition-all duration-500 hover:scale-105">

            ASOSIY{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500">
              MENU
            </span>

            {/* GLOW EFFECT */}
            <div className="h-1 w-0 group-hover:w-full mx-auto mt-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 shadow-[0_0_20px_cyan]"></div>

          </h2>

        </header>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : (
          Object.keys(groupedMenus).map((category) => (
            <section key={category} className="mb-20 sm:mb-32">

              {/* CATEGORY TITLE */}
              <div className="flex items-center gap-4 sm:gap-8 mb-10 sm:mb-16 group">

                <h3 className="text-xl sm:text-4xl font-black text-white uppercase tracking-[0.2em] group-hover:text-cyan-400 transition">
                  {category}
                </h3>

                {/* animated line */}
                <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500/80 to-transparent group-hover:from-cyan-400 transition"></div>
              </div>

              {/* CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">

                {groupedMenus[category].map((menu) => (
                  <div
                    key={menu.id}
                    className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden
                    transition-all duration-500 hover:scale-[1.06] hover:border-cyan-400/60 hover:shadow-[0_0_60px_rgba(6,182,212,0.25)]"
                  >

                    {/* IMAGE */}
                    <div className="relative h-52 sm:h-72 overflow-hidden">

                      <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-60 transition"></div>

                      {/* PRICE */}
                      <div className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded-lg border border-white/20
                        group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_cyan] transition">
                        <span className="text-cyan-400 font-bold text-xs sm:text-sm">
                          {menu.price}
                        </span>
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-4 sm:p-8">

                      <h4 className="text-lg sm:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                        {menu.name}
                      </h4>

                      <p className="text-gray-400 text-xs sm:text-sm italic group-hover:text-gray-200 transition">
                        "{menu.retsept}"
                      </p>

                      {/* animated line */}
                      <div className="mt-4 h-1 w-12 bg-white/10 rounded-full overflow-hidden group-hover:w-full transition-all duration-500">
                        <div className="h-full w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 animate-pulse"></div>
                      </div>

                    </div>

                    {/* GLOW */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 blur opacity-0 group-hover:opacity-10 transition"></div>

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