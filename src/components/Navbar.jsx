import React, { useEffect, useState } from "react";
import { Typography, IconButton, Collapse } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function NavbarDefault() {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sizning original stilizatsiyangiz (tagchiziq animatsiyasi bilan)
  const linkStyle =
    "relative text-white/80 hover:text-yellow-400 transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300";

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        
        <div className="flex items-center justify-between text-white">

          {/* LOGO */}
          <Typography
            as={Link}
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            🍽️ Restaurant
          </Typography>

          {/* CENTER LINKS (Desktop - 960px dan kattada ko'rinadi) */}
          <div className="hidden lg:flex items-center gap-12 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className={linkStyle}>
              Home
            </Link>
            <Link to="/menu" className={linkStyle}>
              Menu
            </Link>
            <Link to="/admin" className={linkStyle}>
              Admin
            </Link>
          </div>

          {/* LOGIN BUTTON (Desktop) */}
          <div className="hidden lg:flex">
            <Link to="/login">
              <button className="px-5 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/10 hover:border-yellow-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                Login
              </button>
            </Link>
          </div>

          {/* MOBILE BUTTON (Faqat telefonda ko'rinadi) */}
          <IconButton
            variant="text"
            ripple={false}
            className="lg:hidden text-white ml-auto"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </IconButton>
        </div>

        {/* MOBILE MENU (Collapse) */}
        <Collapse open={openNav}>
          <div className="lg:hidden flex flex-col gap-5 mt-4 bg-black/95 p-6 rounded-xl border border-white/10">
            
            {/* Mobil linklar uchun linkStyle ni saqlab qoldik, faqat blok ko'rinishida */}
            <Link to="/" className={`w-fit ${linkStyle}`} onClick={() => setOpenNav(false)}>
              Home
            </Link>

            <Link to="/menu" className={`w-fit ${linkStyle}`} onClick={() => setOpenNav(false)}>
              Menu
            </Link>

            <Link to="/admin" className={`w-fit ${linkStyle}`} onClick={() => setOpenNav(false)}>
              Admin
            </Link>

            <Link to="/login" onClick={() => setOpenNav(false)} className="mt-2">
              <button className="w-full border border-yellow-400/50 py-3 rounded-lg text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300">
                Login
              </button>
            </Link>

          </div>
        </Collapse>

      </div>
    </div>
  );
}