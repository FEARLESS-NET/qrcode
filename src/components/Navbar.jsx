import React, { useEffect, useState } from "react";
import { Typography, IconButton, Collapse } from "@material-tailwind/react";
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
    relative text-white/70 hover:text-yellow-400
    uppercase tracking-[0.25em] text-sm font-bold
    transition-all duration-300
    after:absolute after:left-0 after:-bottom-2
    after:w-0 after:h-[2px]
    after:bg-gradient-to-r after:from-yellow-400 after:to-orange-500
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
      border-b border-yellow-500/15
      bg-gradient-to-r from-black/60 via-black/40 to-black/60
      backdrop-blur-[40px] backdrop-saturate-200
      shadow-[0_8px_50px_rgba(0,0,0,0.8)]
    ">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-120px] left-[10%] w-[300px] h-[300px] bg-yellow-500/15 rounded-full blur-[150px]"></div>
        <div className="absolute top-[-120px] right-[10%] w-[300px] h-[300px] bg-orange-500/15 rounded-full blur-[150px]"></div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between">

          <Typography
            as={Link}
            to="/"
            className="group flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center text-black text-2xl shadow-[0_0_40px_rgba(255,215,0,0.3)]">
              <img className="rounded-2xl" src="sazanchik.jpg" alt="Sazanchik logo" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500">
                SAZANCHIK
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">
                Milliy Taom & Baliq
              </span>
            </div>
          </Typography>

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
                border border-yellow-500/20 bg-white/[0.03] backdrop-blur-xl
                text-white uppercase tracking-[0.25em] text-sm font-bold
                transition-all duration-300
                hover:border-yellow-500/50 hover:scale-105
                hover:shadow-[0_0_40px_rgba(255,215,0,0.3)]
              ">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <span className="relative z-10 group-hover:text-black transition">Login</span>
              </button>
            </Link>
          </div>

          <IconButton
            variant="text"
            ripple={false}
            className="lg:hidden text-yellow-400 hover:bg-white/5 transition-all duration-300 pb-6"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? <span className="text-3xl">✕</span> : <span className="text-3xl">☰</span>}
          </IconButton>

        </div>

        <Collapse open={openNav}>
          <div className="lg:hidden mt-6 rounded-3xl border border-yellow-500/15 bg-black/95 backdrop-blur-3xl overflow-hidden shadow-[0_0_60px_rgba(255,215,0,0.06)]">
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
                    hover:bg-yellow-500/15 hover:text-yellow-400 overflow-hidden
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-yellow-500/15 to-transparent group-hover:w-full transition-all duration-500"></div>
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}

              <Link to="/login" onClick={() => setOpenNav(false)} className="mt-3">
                <button className="
                  w-full py-4 rounded-2xl
                  bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500
                  text-black font-black uppercase tracking-[0.25em]
                  transition-all duration-300 hover:scale-[1.02] active:scale-95
                  shadow-[0_0_40px_rgba(255,215,0,0.3)]
                ">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </Collapse>

      </div>
    </div>
  );
}

export default NavbarDefault;