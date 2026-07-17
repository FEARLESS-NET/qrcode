import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function NavbarDefault() {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkStyle = `
    relative text-white/70 hover:text-[#FFDD73]
    uppercase tracking-[0.25em] text-sm font-bold
    transition-all duration-300
    after:absolute after:left-0 after:-bottom-2
    after:w-0 after:h-[2px]
    after:bg-gradient-to-r after:from-[#FFDD73] after:to-[#FF5A1F]
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
    <div className="
      fixed top-0 left-0 w-full z-50 overflow-hidden
      border-b border-[#FFC93C]/15
      bg-gradient-to-r from-black/60 via-black/40 to-black/60
      backdrop-blur-[40px] backdrop-saturate-200
      shadow-[0_8px_50px_rgba(0,0,0,0.8)]
    ">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-120px] left-[10%] w-[300px] h-[300px] bg-[#FFC93C]/15 rounded-full blur-[150px]"></div>
        <div className="absolute top-[-120px] right-[10%] w-[300px] h-[300px] bg-[#FF5A1F]/15 rounded-full blur-[150px]"></div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,180,40,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,180,40,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4  py-2">
        <div className="flex items-center justify-between">

          <Link
            to="/"
            className="group flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F] flex items-center justify-center text-black text-2xl shadow-[0_0_40px_rgba(255,180,40,0.3)]">
              <img className="rounded-2xl" src="/QOZONDA.jpg" alt="QOZONDA LOGO" />
            </div>
            <div className="flex flex-col ">
              <span className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB0] via-[#FFA23D] to-[#FF5A1F]">
                Qozonda
              </span>
              <span className="text-[7px] text-gray-500 uppercase tracking-[0.4em] font-bold">
                MILLIY TAOMLAR
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((item) => (
              <Link key={item.name} to={item.link} className={linkStyle}>
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex">
            <Link to="/login">
              <button className="
                group relative overflow-hidden
                px-8 py-3.5 rounded-2xl
                border border-[#FFC93C]/20 bg-white/[0.03] backdrop-blur-xl
                text-white uppercase tracking-[0.25em] text-sm font-bold
                transition-all duration-300
                hover:border-[#FFC93C]/50 hover:scale-105
                hover:shadow-[0_0_40px_rgba(255,180,40,0.3)]
              ">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <span className="relative z-10 group-hover:text-black transition">Login</span>
              </button>
            </Link>
          </div>

          <button
            className="lg:hidden text-[#FFDD73] hover:bg-white/5 transition-all duration-300 p-2 text-3xl"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? "✕" : "☰"}
          </button>

        </div>

        {openNav && (
          <div className="lg:hidden mt-6 rounded-3xl border border-[#FFC93C]/15 bg-black/95 backdrop-blur-3xl overflow-hidden shadow-[0_0_60px_rgba(255,180,40,0.06)]">
            <div className="flex flex-col p-4">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  onClick={() => setOpenNav(false)}
                  className="
                    group relative px-5 py-4 rounded-2xl
                    text-white/80 uppercase tracking-[0.25em] text-sm font-bold
                    transition-all duration-300
                    hover:bg-[#FFC93C]/15 hover:text-[#FFDD73] overflow-hidden
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#FFC93C]/15 to-transparent group-hover:w-full transition-all duration-500"></div>
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}

              <Link to="/login" onClick={() => setOpenNav(false)} className="mt-3">
                <button className="
                  w-full py-4 rounded-2xl
                  bg-gradient-to-r from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F]
                  text-black font-black uppercase tracking-[0.25em]
                  transition-all duration-300 hover:scale-[1.02] active:scale-95
                  shadow-[0_0_40px_rgba(255,180,40,0.3)]
                ">
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