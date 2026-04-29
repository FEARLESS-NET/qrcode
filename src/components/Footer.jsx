import { Typography } from "@material-tailwind/react";

export function SimpleFooter() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/40 backdrop-blur-xl text-white">

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

      <div className="px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT */}
        <Typography className="text-sm opacity-80">
          © {new Date().getFullYear()} 🍽️ Restaurant. All rights reserved.
        </Typography>

        <ul className="flex flex-wrap items-center gap-6 text-sm">

          <li>
            <a className="hover:text-yellow-400 transition" href="#">
              About
            </a>
          </li>

          <li>
            <a className="hover:text-yellow-400 transition" href="#">
              Menu
            </a>
          </li>

          <li>
            <a className="hover:text-yellow-400 transition" href="#">
              Careers
            </a>
          </li>

          <li>
            <a className="hover:text-yellow-400 transition" href="#">
              Contact
            </a>
          </li>

        </ul>

        <div className="flex gap-3">

          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black transition cursor-pointer">
            f
          </div>

          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black transition cursor-pointer">
            in
          </div>

          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black transition cursor-pointer">
            ig
          </div>

        </div>

      </div>
    </footer>
  );
}