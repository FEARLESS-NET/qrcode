import React, { useEffect, useState } from "react";
import {
  Typography,
  IconButton,
  Collapse,
} from "@material-tailwind/react";

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

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg">
      
      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="flex items-center justify-between text-white">

          
          <Typography
            as={Link}
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
          >
            🍽️ Restaurant
          </Typography>

          
          <div className="hidden lg:flex items-center gap-8">

            <Link to="/" className="hover:text-yellow-400 transition">
              Home
            </Link>

            <Link to="/menu" className="hover:text-yellow-400 transition">
              Menu
            </Link>

            <Link to="/admin" className="hover:text-yellow-400 transition">
              Admin
            </Link>

            <Link to="/login">
              <button className="px-4 py-2 rounded-lg border border-white/30 hover:bg-white/20 transition">
                Login
              </button>
            </Link>
          </div>

          
          <IconButton
            variant="text"
            ripple={false}
            className="lg:hidden text-white pb-8"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <span className="text-2xl">✖</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </IconButton>
        </div>

        
        <Collapse open={openNav}>
          <div className="flex flex-col gap-4 mt-4 pb-4 text-white lg:hidden">

            <Link to="/" onClick={() => setOpenNav(false)}>
              Home
            </Link>

            <Link to="/menu" onClick={() => setOpenNav(false)}>
              Menu
            </Link>

            <Link to="/admin" onClick={() => setOpenNav(false)}>
              Admin
            </Link>

            <Link to="/login" onClick={() => setOpenNav(false)}>
              Login
            </Link>

          </div>
        </Collapse>

      </div>
    </div>
  );
}