/**
 * FOOTER – GLOBAL PASTKI QISM (Oltin + Qora)
 * Mualliflik huquqi, restoran havolalari (About, Menu, Reservation, Contact).
 * Gradient chiziq va fon effektlari.
 */
import React from "react";

export function SimpleFooter() {
  return (
    <footer
      className="
        relative overflow-hidden text-white
        bg-gradient-to-t from-black via-[#0a0804] to-[#120d03]
        border-t border-[#FFD700]/40
        shadow-[0_-8px_50px_rgba(255,215,0,0.18),0_-14px_80px_rgba(0,0,0,0.9)]
      "
    >
      {/* Shimmer animatsiya uchun keyframes */}
      <style>{`
        @keyframes footerGoldShine {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .footer-gold-text {
          background-image: linear-gradient(90deg, #B8860B, #FFD700, #FFF8DC, #FFD700, #B8860B);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: footerGoldShine 4s linear infinite;
        }
        .footer-gold-line {
          background-image: linear-gradient(90deg, transparent, #B8860B, #FFD700, #FFF8DC, #FFD700, #B8860B, transparent);
          background-size: 200% auto;
          animation: footerGoldShine 5s linear infinite;
        }
      `}</style>

      {/* Fon effektlari */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute -top-20 left-0 w-[320px] h-[320px] bg-[#FFD700]/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 right-0 w-[320px] h-[320px] bg-[#B8860B]/25 rounded-full blur-[140px]" />
      </div>

      {/* Yuqori yorqin oltin chiziq */}
      <div className="footer-gold-line relative h-[3px] w-full" />

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
            text-[#F5E6B8]/80
            tracking-[0.2em]
            uppercase
            text-center lg:text-left
            font-bold
          "
        >
          © {new Date().getFullYear()}{" "}
          <span className="footer-gold-text font-extrabold">Olimjon G'</span>. Barcha huquqlar
          himoyalangan.
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
                  text-[#F5E6B8]/80
                  transition-all duration-300
                  hover:text-[#FFD700]
                  hover:[text-shadow:0_0_14px_rgba(255,215,0,0.7)]
                  font-bold
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:h-[2px]
                  after:w-0
                  after:bg-gradient-to-r after:from-[#FFF3B0] after:via-[#FFD700] after:to-[#B8860B]
                  after:shadow-[0_0_10px_rgba(255,215,0,0.9)]
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
