import { Typography } from "@material-tailwind/react";

export function SimpleFooter() {
  return (
    <footer className="relative mt-24 bg-black text-white overflow-hidden">
      
      {/* TOP GLOW LINE */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>

      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.15),transparent_70%)] pointer-events-none"></div>

      <div className="relative px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* LEFT */}
        <div className="text-center md:text-left space-y-2">
          <Typography className="text-lg font-semibold tracking-wide">
            🍽️ Restaurant
          </Typography>
          <Typography className="text-sm opacity-70">
            © {new Date().getFullYear()} All rights reserved.
          </Typography>
        </div>

        {/* NAV LINKS */}
        <ul className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium">
          {["About", "Menu", "Careers", "Contact"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="relative group transition"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>

        {/* SOCIALS */}
        <div className="flex gap-4">
          {["f", "in", "ig"].map((icon, i) => (
            <div
              key={i}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 
              hover:bg-yellow-400 hover:text-black hover:scale-110 hover:shadow-[0_0_15px_rgba(255,215,0,0.6)] 
              transition-all duration-300 cursor-pointer"
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM LINE */}
      <div className="h-[1px] w-full bg-white/10"></div>
    </footer>
  );
}