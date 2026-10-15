/**
 * HOME PAGE – BOSH SAHIFA
 * Restoran brendingi, hero qism, statistikalar, xususiyatlar va galereya.
 * Foydalanuvchini menyu yoki bron qilishga yo'naltiradi.
 */
import React from "react";
import { useNavigate } from "react-router-dom";

const goldGrad = "bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#B8860B]";
const goldText =
  "text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#E0A100]";
const panelCls =
  "rounded-3xl bg-gradient-to-b from-[#1c1503] to-black border border-[#FFD700]/40 shadow-[0_0_30px_rgba(255,215,0,0.15)]";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* FON */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover scale-110 opacity-40 animate-slowZoom"
          src="https://images.unsplash.com/photo-1776993298422-3e8c397d0235?auto=format&fit=crop&w=1740&q=80&fm=webp"
          alt="Olimjon G' restorani interyeri"
        />
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-[#FFD700]/20 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-[#B8860B]/25 rounded-full blur-[180px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,215,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,215,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}></div>
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="ember-particle"
            style={{
              left: `${(i * 7 + 3) % 100}%`,
              animationDuration: `${6 + (i % 5) * 1.5}s`,
              animationDelay: `${i * 0.7}s`,
              "--drift": `${((i % 3) - 1) * 40}px`,
            }}
          />
        ))}
      </div>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10 py-24 sm:py-28">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-[#FFD700]/50 bg-[#FFD700]/10 backdrop-blur-xl mb-6 sm:mb-8">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700] animate-pulse"></div>
              <span className="text-[#FFE27A] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[9px] sm:text-[11px] font-black">
                MILLIY TAOMLAR
              </span>
            </div>

            <h1 className="font-display leading-[0.95] tracking-tight">
              <span className="block text-white text-2xl sm:text-3xl md:text-4xl font-display-italic normal-case [text-shadow:0_2px_6px_rgba(0,0,0,0.9)]">
                Xush kelibsiz
              </span>
              <span className={`block mt-2 ${goldText} text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase drop-shadow-[0_0_35px_rgba(255,215,0,0.35)]`}>
                Olimjon G'
              </span>
              <span className="block text-white mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display-italic normal-case tracking-normal [text-shadow:0_2px_6px_rgba(0,0,0,0.9)]">
                dasturxoniga
              </span>
            </h1>

            <p className="mt-4 sm:mt-8 text-base sm:text-lg lg:text-xl text-white/90 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0 [text-shadow:0_2px_6px_rgba(0,0,0,0.9)]">
              Olimjon G' milliy oshxonasining mazali retseptlari — barchasi oilangiz bilan unutilmas oqshom uchun.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6 sm:mt-10 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/menu")}
                className={`group relative overflow-hidden px-8 sm:px-12 py-4 sm:py-5 rounded-2xl ${goldGrad} text-black font-black text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] active:scale-95`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative">Menyuni Ko'rish</span>
              </button>
              <button
                onClick={() => navigate("/reservation")}
                className="px-8 sm:px-12 py-4 sm:py-5 rounded-2xl border-2 border-[#FFD700]/60 bg-black/60 backdrop-blur-xl text-[#FFD700] font-black text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.25em] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FF5A1F] hover:to-[#E11D48] hover:border-[#FF8A5C] hover:text-white hover:scale-105 hover:shadow-[0_0_40px_rgba(255,90,31,0.6)] active:scale-95"
              >
                Stol Bron Qilish
              </button>
            </div>

            {/* STATISTIKA */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 mt-10 sm:mt-16">
              {[
                { val: "12+", label: "Yillik Tajriba" },
                { val: "50K+", label: "Mijozlar" },
                { val: "100+", label: "Milliy Taom" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-black/60 border border-[#FFD700]/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-[0_0_18px_rgba(255,215,0,0.12)] hover:border-[#FFD700] hover:shadow-[0_0_28px_rgba(255,215,0,0.4)] transition-all duration-300 hover:scale-[1.03]"
                >
                  <h3 className={`text-xl sm:text-2xl lg:text-3xl font-black ${goldText}`}>
                    {item.val}
                  </h3>
                  <p className="text-[#F5E6B8] text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.3em] mt-1 sm:mt-2 font-extrabold">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SIGNATURE TAOM */}
          <div className="relative flex justify-center mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-[#FFD700]/20 blur-[150px] rounded-full"></div>
            <div className="relative w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] rounded-[30px] sm:rounded-[40px] overflow-hidden border-2 border-[#FFD700]/50 bg-black/40 backdrop-blur-3xl shadow-[0_0_80px_rgba(255,215,0,0.25)] group">
              <img
                loading="lazy"
                src="https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=1200&q=80&fm=webp"
                alt="Olimjon G' milliy oshi"
                className="w-full h-[400px] sm:h-[500px] lg:h-[650px] object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-black/75 border border-[#FFD700]/50 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_0_25px_rgba(255,215,0,0.2)]">
                <span className="text-[#FFD700] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[9px] sm:text-[11px] font-black">
                  Signature Taom
                </span>
                <h3 className={`text-xl sm:text-2xl font-black mt-1 sm:mt-3 ${goldText}`}>To'y Oshi (Palov)</h3>
                <p className="text-white/90 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed font-medium">
                  Qozonda dimlangan, go'sht va sariq sabzi bilan — Olimjon G'ning eng sevimli milliy taomi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEGA BIZ */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-28 border-t border-[#FFD700]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <span className="text-[#FFD700] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs font-black">
              Nega Olimjon G'
            </span>
            <h2 className="font-display mt-3 sm:mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
              Yangi mahsulotlardan <br className="block sm:hidden" />
              <span className={goldText}>Dasturxonga</span>
            </h2>
            <div className="divider-ikat mt-6 sm:mt-8">
              <span className="ikat-node"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: "🥩", title: "Tabiiy Mahsulotlar", text: "Har kuni yangi go'sht, sabzavot va ziravorlardan tayyorlangan taomlar." },
              { icon: "🥘", title: "Xorazm Oshxonasi", text: "Avlodlardan o'tib kelgan milliy retseptlar asosida pishiriladi." },
              { icon: "👨‍👩‍👧‍👦", title: "Oilaviy Muhit", text: "Qulay zal va samimiy oilaviy atmosfera." },
            ].map((item, i) => (
              <div
                key={i}
                className={`${panelCls} group relative overflow-hidden p-8 sm:p-10 lg:p-12 hover:border-[#FFD700] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:scale-[1.015] transition-all duration-500`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/15 via-transparent to-[#B8860B]/15 opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl ${goldGrad} flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_40px_rgba(255,215,0,0.45)]`}>
                    {item.icon}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold mt-6 sm:mt-8 text-[#FFE27A]">{item.title}</h3>
                  <p className="text-white/90 text-sm sm:text-base mt-3 sm:mt-4 leading-relaxed font-medium">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* GALEREYA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-12 sm:mt-16 lg:mt-20">
            {[
              { src: "https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=600&q=80&fm=webp", label: "Milliy Osh" },
              { src: "https://images.unsplash.com/photo-1768697358705-c1b60333da35?auto=format&fit=crop&w=600&q=80&fm=webp", label: "Restoran Muhiti" },
              { src: "https://images.unsplash.com/photo-1776993298422-3e8c397d0235?auto=format&fit=crop&w=600&q=80&fm=webp", label: "Dasturxon Interyeri" },
            ].map((g, i) => (
              <div
                key={i}
                className="group relative h-48 sm:h-56 lg:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#FFD700]/40 shadow-[0_0_18px_rgba(255,215,0,0.15)] hover:border-[#FFD700] hover:shadow-[0_0_30px_rgba(255,215,0,0.45)] transition-all duration-300"
              >
                <img
                  loading="lazy"
                  src={g.src}
                  alt={g.label}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"></div>
                <span className="absolute bottom-3 sm:bottom-4 left-3 sm:left-5 text-[#FFE27A] text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.25em] font-extrabold [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
                  {g.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
