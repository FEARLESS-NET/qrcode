/**
 * MENU PAGE – MENYU SAHIFASI
 * Kategoriyalar bo'yicha taomlar ro'yxati. Har bir taom uchun rasm, nom, narx, retsept.
 * "Buyurtma" tugmasi Order sahifasiga o'tkazadi.
 * Kichik va yorqin kartalar: telefonda 2 ta, planshetda 3 ta, kompyuterda 4-5 ta.
 */
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3005"
  : import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "https://backend-4-9otm.onrender.com";

const NO_IMAGE_URL =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' fill='%23888' font-family='sans-serif' font-size='20' text-anchor='middle' dominant-baseline='middle'%3ERasm yo'q%3C/text%3E%3C/svg%3E";

const getMenus = async () => {
  const res = await axiosInstance.get("/menus");
  return res.data;
};

const GRID = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4";

const Menu = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const menus = data?.menus || [];

  const groupedMenus = useMemo(() => {
    return menus.reduce((acc, menu) => {
      const category = menu.category || "Boshqa";
      if (!acc[category]) acc[category] = [];
      acc[category].push(menu);
      return acc;
    }, {});
  }, [menus]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return NO_IMAGE_URL;
    if (imagePath.startsWith("http")) {
      if (imagePath.includes("images.unsplash.com")) {
        return imagePath.includes("?") ? `${imagePath}&fm=webp` : `${imagePath}?fm=webp`;
      }
      return imagePath;
    }
    return `${BASE_URL}${imagePath}`;
  };

  const SkeletonCard = () => (
    <div className="overflow-hidden bg-black/60 border border-[#FFD700]/30 rounded-2xl h-[230px] animate-pulse">
      <div className="h-28 sm:h-36 bg-gradient-to-br from-[#FFD700]/20 via-transparent to-[#B8860B]/20"></div>
      <div className="p-3 space-y-3">
        <div className="h-4 bg-[#FFD700]/20 rounded-full w-3/4"></div>
        <div className="h-3 bg-white/10 rounded-full w-full"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="relative min-h-screen bg-black text-white px-4 py-28">
        <div className="text-center">
          <p className="text-red-400 text-2xl font-bold">❌ Xatolik yuz berdi</p>
          <p className="text-gray-400 mt-2">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden text-white font-display">
      {/* FON */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1920&q=80&fm=webp"
          alt="Restaurant background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/75 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 via-transparent to-[#B8860B]/10"></div>
        {[...Array(18)].map((_, i) => (
          <span
            key={`far-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 5.5 + 2) % 100}%`,
              "--size": `${2 + (i % 3)}px`,
              filter: "blur(0.5px)",
              opacity: 0.5,
              animationDuration: `${8 + (i % 6) * 1.4}s`,
              animationDelay: `${i * 0.55}s`,
              "--drift": `${((i % 5) - 2) * 30}px`,
            }}
          />
        ))}
        {[...Array(16)].map((_, i) => (
          <span
            key={`near-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 6.3 + 5) % 100}%`,
              "--size": `${4 + (i % 4)}px`,
              animationDuration: `${5 + (i % 4) * 1.2}s`,
              animationDelay: `${i * 0.4}s`,
              "--drift": `${((i % 3) - 1) * 55}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-24 sm:py-28">
        {/* HERO */}
        <div className="relative h-56 sm:h-80 rounded-[28px] sm:rounded-[40px] overflow-hidden border border-[#FFD700]/40 mb-10 sm:mb-14 shadow-[0_0_60px_rgba(255,215,0,0.15)]">
          <img
            loading="lazy"
            src="https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=1600&q=80&fm=webp"
            alt="Olimjon G' | MILLIY TAOMLARI"
            className="absolute inset-0 w-full h-full object-cover scale-110 animate-slowZoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-[#FFD700] uppercase tracking-[0.4em] text-[10px] sm:text-xs font-bold mb-3">
              🌙 Olimjon G' · Premium
            </span>
            <h2 className="text-4xl sm:text-7xl font-display font-bold text-white drop-shadow-[0_0_40px_rgba(255,215,0,0.4)]">
              ASOSIY{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#B8860B]">
                MENU
              </span>
            </h2>
            <div className="divider-ikat mt-4">
              <span className="ikat-node"></span>
            </div>
            <p className="text-white mt-3 text-base sm:text-xl font-medium tracking-wider [text-shadow:0_2px_6px_rgba(0,0,0,0.9)]">
              Sevimli taomingizni tanlang
            </p>
          </div>
          <div className="absolute top-3 left-3 w-10 h-10 sm:w-14 sm:h-14 border-t-2 border-l-2 border-[#FFD700]/60 rounded-tl-2xl"></div>
          <div className="absolute top-3 right-3 w-10 h-10 sm:w-14 sm:h-14 border-t-2 border-r-2 border-[#FFD700]/60 rounded-tr-2xl"></div>
          <div className="absolute bottom-3 left-3 w-10 h-10 sm:w-14 sm:h-14 border-b-2 border-l-2 border-[#FFD700]/60 rounded-bl-2xl"></div>
          <div className="absolute bottom-3 right-3 w-10 h-10 sm:w-14 sm:h-14 border-b-2 border-r-2 border-[#FFD700]/60 rounded-br-2xl"></div>
        </div>

        {/* TUGMALAR */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center mb-10 sm:mb-14">
          <button
            onClick={() => navigate("/order")}
            className="group relative overflow-hidden px-10 py-3.5 sm:px-12 sm:py-4 rounded-2xl bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#B8860B] text-black font-display font-bold text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative">🛒 Online Zakaz</span>
          </button>
          <button
            onClick={() => navigate("/reservation")}
            className="px-10 py-3.5 sm:px-12 sm:py-4 rounded-2xl border-2 border-[#FFD700]/60 bg-black/50 text-[#FFD700] font-display font-bold text-sm uppercase tracking-[0.2em] transition-all hover:bg-gradient-to-r hover:from-[#FF5A1F] hover:to-[#E11D48] hover:border-[#FF8A5C] hover:text-white hover:scale-105 hover:shadow-[0_0_40px_rgba(255,90,31,0.6)] active:scale-95"
          >
            🪑 Stol Bron
          </button>
        </div>

        {/* TAOMLAR */}
        {isLoading ? (
          <div className={GRID}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center text-gray-400 text-2xl py-20 font-display">Menu yo'q</div>
        ) : (
          Object.keys(groupedMenus).map((category, catIdx) => (
            <section key={category} className="mb-12 sm:mb-16">
              <div className="flex items-center gap-3 sm:gap-5 mb-5 pb-3 border-b border-[#FFD700]/40">
                <span className="category-mark">{String(catIdx + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl sm:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#E0A100] tracking-wide">
                  {category}
                </h3>
                <span className="ikat-node hidden sm:block"></span>
              </div>

              <div className={GRID}>
                {groupedMenus[category].map((menu) => (
                  <div
                    key={menu._id}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-[#1c1503] to-black border border-[#FFD700]/40 shadow-[0_0_18px_rgba(255,215,0,0.15)] transition-all duration-300 hover:scale-[1.03] hover:border-[#FFD700] hover:shadow-[0_0_30px_rgba(255,215,0,0.45)]"
                  >
                    <div className="relative h-32 sm:h-40 overflow-hidden">
                      <img
                        loading="lazy"
                        src={getImageUrl(menu.image)}
                        alt={menu.name}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = NO_IMAGE_URL;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      {/* Narx – rasm ustida, yorqin oltin belgi */}
                      <span className="absolute bottom-1.5 left-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#E0A100] text-black text-xs sm:text-sm font-black shadow-[0_0_12px_rgba(255,215,0,0.6)]">
                        {Number(menu.price).toLocaleString()} so'm
                      </span>
                    </div>

                    <div className="flex flex-col flex-1 p-3 sm:p-3.5">
                      <h4 className="text-base sm:text-lg font-display font-extrabold text-[#FFE27A] group-hover:text-white transition-colors line-clamp-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
                        {menu.name}
                      </h4>
                      <p className="text-white/90 text-xs sm:text-sm mt-1 line-clamp-2 font-normal leading-snug flex-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                        {menu.retsept}
                      </p>
                      <button
                        onClick={() => navigate("/order")}
                        className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#B8860B] text-black text-xs sm:text-sm font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.7)] active:scale-95"
                      >
                        Buyurtma
                      </button>
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
