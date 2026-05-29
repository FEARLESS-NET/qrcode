import { Typography } from "@material-tailwind/react";

export function SimpleFooter() {
  return (
    <footer
      className="
        relative
        
        overflow-hidden

        border-t border-yellow-500/10

        bg-gradient-to-r
        from-black/40
        via-black/20
        to-black/40

        backdrop-blur-[35px]
        backdrop-saturate-[180%]

        text-white

        shadow-[0_-10px_60px_rgba(0,0,0,0.7)]
      "
    >

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* GLOW */}
        <div className="absolute -top-20 left-0 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 right-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[120px]" />

      </div>

      {/* TOP LINE */}
      <div className="relative h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent shadow-[0_0_25px_rgba(255,215,0,0.4)]" />

      {/* CONTENT */}
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

        {/* LEFT */}
        <Typography
          className="
            text-sm
            text-gray-400
            tracking-[0.15em]
            uppercase
            text-center lg:text-left
          "
        >
          © {new Date().getFullYear()} 🍽️ Restaurant. All rights reserved.
        </Typography>

        {/* LINKS */}
        <ul
          className="
            flex flex-wrap
            items-center justify-center
            gap-4 sm:gap-8
            text-xs sm:text-sm
            uppercase
            tracking-[0.25em]
          "
        >

          {["About", "Menu", "Careers", "Contact"].map((item, i) => (
            <li key={i}>
              <a
                className="
                  relative
                  text-gray-400
                  transition-all duration-300
                  hover:text-yellow-400

                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-[1px]
                  after:w-0
                  after:bg-yellow-400
                  hover:after:w-full
                  after:transition-all
                "
                href={item === "Menu" ? "/menu" : "/"}
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