import React, { useEffect, useState } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
} from "@material-tailwind/react";
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

  return (
    <Navbar className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-lg border-b border-white/20 shadow-lg px-6 py-3">
      
      <div className="flex items-center justify-between text-white">

        
        <Typography
          as={Link}
          to="/"
          className="text-xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
        >
          🍽️ Restaurant
        </Typography>

       
        <div className="hidden lg:flex items-center gap-8">

          <Link to="/" className="relative group">
            <span>Home</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full"></span>
          </Link>

          <Link to="/menu" className="relative group">
            <span>Menu</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full"></span>
          </Link>

          <Link to="/admin" className="relative group">
            <span>Admin</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full"></span>
          </Link>

        </div>

        
        <div className="hidden lg:flex gap-3">
          <button className="px-4 py-1 rounded-lg border border-white/30 hover:bg-white/20 transition">
            Log in
          </button>

          <button className="px-4 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:scale-105 transition">
            Sign up
          </button>
        </div>

     
        <IconButton
          variant="text"
          className="lg:hidden text-white"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? "✖" : "☰"}
        </IconButton>
      </div>

     
      <MobileNav open={openNav}>
        <div className="mt-4 flex flex-col gap-4 text-white">
          <Link to="/" onClick={() => setOpenNav(false)}>Home</Link>
          <Link to="/menu" onClick={() => setOpenNav(false)}>Menu</Link>
          <Link to="/admin" onClick={() => setOpenNav(false)}>Admin</Link>
        </div>
      </MobileNav>
    </Navbar>
  );
}