/**
 * NAVBAR – GLOBAL NAVIGATION (Oltin + Qora)
 * Fixed tepa panel. Logo, menyu linklari (Home, Menu, Zakaz, Bron, Kuzatish, Admin).
 * Responsive – kichik ekranlarda toggle menyu. Login tugmasi login sahifaga yo'naltiradi.
 */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function NavbarDefault() {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkStyle = `
    relative text-[#F5E6B8]/80 hover:text-[#FFD700]
    uppercase tracking-[0.25em] text-sm font-bold
    transition-all duration-300
    hover:[text-shadow:0_0_14px_rgba(255,215,0,0.7)]
    after:absolute after:left-0 after:-bottom-2
    after:w-0 after:h-[2px]
    after:bg-gradient-to-r after:from-[#FFF3B0] after:via-[#FFD700] after:to-[#B8860B]
    after:shadow-[0_0_10px_rgba(255,215,0,0.9)]
    after:transition-all after:duration-300
    hover:after:w-full
  `;

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "Menu", link: "/menu" },
    { name: "Zakaz", link: "/order" },
    { name: "Bron", link: "/reservation" },
    { name: "Kuzatish", link: "/track" },
    { name: "Admin", link: "/admin" },
  ];

  return (
    <div
      className="
        fixed top-0 left-0 w-full z-50 overflow-hidden
        bg-gradient-to-b from-black via-[#0a0804] to-[#120d03]
        border-b border-[#FFD700]/40
        shadow-[0_8px_50px_rgba(255,215,0,0.18),0_12px_60px_rgba(0,0,0,0.9)]
      "
    >
      {/* Shimmer animatsiya uchun keyframes */}
      <style>{`
        @keyframes goldShine {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .gold-text {
          background-image: linear-gradient(90deg, #B8860B, #FFD700, #FFF8DC, #FFD700, #B8860B);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: goldShine 4s linear infinite;
        }
        .gold-line {
          background-image: linear-gradient(90deg, transparent, #B8860B, #FFD700, #FFF8DC, #FFD700, #B8860B, transparent);
          background-size: 200% auto;
          animation: goldShine 5s linear infinite;
        }
      `}</style>

      {/* Yuqori yorqin oltin chiziq */}
      <div className="gold-line absolute top-0 left-0 w-full h-[3px]"></div>

      {/* Fon yorug'lik effektlari */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-120px] left-[8%] w-[320px] h-[320px] bg-[#FFD700]/20 rounded-full blur-[140px]"></div>
        <div className="absolute top-[-120px] right-[8%] w-[320px] h-[320px] bg-[#B8860B]/25 rounded-full blur-[140px]"></div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="group flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-br from-[#FFF3B0] via-[#FFD700] to-[#B8860B] shadow-[0_0_30px_rgba(255,215,0,0.5)]">
              <img
                className="rounded-2xl w-full h-full object-cover bg-black"
                src="/QOZONDA.jpg"
                alt="Olimjon G' logo"
              />
            </div>
            <div className="flex flex-col">
              <span className="gold-text font-display text-2xl font-extrabold uppercase tracking-[0.18em]">
                Olimjon G'
              </span>
              <span className="text-[8px] text-[#FFD700]/70 uppercase tracking-[0.4em] font-bold">
                MILLIY TAOMLAR
              </span>
            </div>
          </Link>

          {/* DESKTOP LINKLAR */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((item) => (
              <Link key={item.name} to={item.link} className={linkStyle}>
                {item.name}
              </Link>
            ))}
          </div>

          {/* LOGIN */}
          <div className="hidden lg:flex">
            <Link to="/login">
              <button
                className="
                  group relative overflow-hidden
                  px-8 py-3 rounded-2xl
                  border border-[#FFD700]/60 bg-black/60 backdrop-blur-xl
                  text-[#FFD700] uppercase tracking-[0.25em] text-sm font-black
                  transition-all duration-300
                  hover:border-[#FFD700] hover:scale-105
                  shadow-[0_0_20px_rgba(255,215,0,0.25)]
                  hover:shadow-[0_0_45px_rgba(255,215,0,0.65)]
                "
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#B8860B] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <span className="relative z-10 group-hover:text-black transition">
                  Login
                </span>
              </button>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden text-[#FFD700] border border-[#FFD700]/40 rounded-xl hover:bg-[#FFD700]/10 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-300 px-3 py-1 text-2xl"
            onClick={() => setOpenNav(!openNav)}
            aria-label="Menyuni ochish"
          >
            {openNav ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE MENYU */}
        {openNav && (
          <div className="lg:hidden mt-4 rounded-3xl border border-[#FFD700]/40 bg-black/95 backdrop-blur-3xl overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.2)]">
            <div className="flex flex-col p-4">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  onClick={() => setOpenNav(false)}
                  className="
                    group relative px-5 py-4 rounded-2xl
                    text-[#F5E6B8]/85 uppercase tracking-[0.25em] text-sm font-bold
                    transition-all duration-300
                    hover:bg-[#FFD700]/10 hover:text-[#FFD700] overflow-hidden
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#FFD700]/25 to-transparent group-hover:w-full transition-all duration-500"></div>
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}

              <Link to="/login" onClick={() => setOpenNav(false)} className="mt-3">
                <button
                  className="
                    w-full py-4 rounded-2xl
                    bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#B8860B]
                    text-black font-black uppercase tracking-[0.25em]
                    transition-all duration-300 hover:scale-[1.02] active:scale-95
                    shadow-[0_0_35px_rgba(255,215,0,0.5)]
                  "
                >
                  Login
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavbarDefault;
