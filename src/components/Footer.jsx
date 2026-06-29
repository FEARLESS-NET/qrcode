import React from "react";

export function SimpleFooter() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t border-yellow-500/15
        bg-gradient-to-r
        from-black/60
        via-black/40
        to-black/60
        backdrop-blur-[40px]
        backdrop-saturate-[200%]
        text-white
        shadow-[0_-10px_70px_rgba(0,0,0,0.8)]
      "
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute -top-20 left-0 w-[300px] h-[300px] bg-yellow-500/15 rounded-full blur-[150px]" />
        <div className="absolute -bottom-20 right-0 w-[300px] h-[300px] bg-orange-500/15 rounded-full blur-[150px]" />
      </div>

      <div className="relative h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent shadow-[0_0_30px_rgba(255,215,0,0.3)]" />

      <div
        className="
          relative z-10
          px-6 sm:px-10
          py-10
          flex flex-col lg:flex-row
          items-center justify-between
          gap-8
        "
      >
        <p
          className="
            text-sm
            text-gray-400
            tracking-[0.2em]
            uppercase
            text-center lg:text-left
            font-bold
          "
        >
          © {new Date().getFullYear()} 🐟 Sazanchik. Barcha huquqlar himoyalangan.
        </p>

        <ul
          className="
            flex flex-wrap
            items-center justify-center
            gap-6 sm:gap-10
            text-xs sm:text-sm
            uppercase
            tracking-[0.3em]
          "
        >
          {["Biz haqimizda", "Menyu", "Bron", "Aloqa"].map((item, i) => (
            <li key={i}>
              <a
                className="
                  relative
                  text-gray-400
                  transition-all duration-300
                  hover:text-yellow-400
                  font-bold
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-[1px]
                  after:w-0
                  after:bg-yellow-400
                  hover:after:w-full
                  after:transition-all
                "
                href={item === "Menyu" ? "/menu" : item === "Bron" ? "/reservation" : "/"}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default SimpleFooter;