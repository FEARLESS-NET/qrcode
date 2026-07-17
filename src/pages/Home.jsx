import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#130e0a] text-white">

      {/* BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover scale-110 opacity-40 animate-slowZoom"
          src="https://images.unsplash.com/photo-1776993298422-3e8c397d0235?auto=format&fit=crop&w=1740&q=80"
          alt="QOZONDA restorani interyeri"
        />
        <div className="absolute inset-0 bg-[#130e0a]/70"></div>
        <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-[#FFC93C]/20 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-[#FFA23D]/20 rounded-full blur-[180px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,180,40,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,180,40,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}></div>
        {/* Signature: embers drifting up, as if rising off a qozon */}
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

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10 py-24 sm:py-28">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          
          {/* LEFT */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-[#FFC93C]/20 bg-[#FFC93C]/10 backdrop-blur-xl mb-6 sm:mb-8">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFDD73] animate-pulse"></div>
              <span className="text-[#FFDD73] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[9px] sm:text-[11px] font-black">
                MILLIY TAOMLAR
              </span>
            </div>

            <h1 className="font-display leading-[0.95] tracking-tight">
              <span className="block text-white text-2xl sm:text-3xl md:text-4xl font-display-italic normal-case text-gray-300">
                Xush kelibsiz
              </span>
              <span className="block mt-2 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB0] via-[#FFA23D] to-[#FF5A1F] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase">
                Qozonda
              </span>
              <span className="block text-white mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display-italic normal-case tracking-normal text-gray-300">
                dasturxoniga
              </span>
            </h1>

            <p className="mt-4 sm:mt-8 text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
              Qozonda milliy oshxonasining mazali retseptlari — barchasi oilangiz bilan unutilmas oqshom uchun.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6 sm:mt-10 justify-center lg:justify-start">
              <button 
                onClick={() => navigate("/menu")} 
                className="group relative overflow-hidden px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F] text-black font-black text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,180,40,0.5)] active:scale-95"
              >
                <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition duration-300"></span>
                Menyuni Ko‘rish
              </button>
              <button 
                onClick={() => navigate("/reservation")} 
                className="px-8 sm:px-12 py-4 sm:py-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl text-white font-bold text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.25em] transition-all duration-300 hover:bg-white/10 hover:border-[#FFC93C]/30 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,180,40,0.05)]"
              >
                Stol Bron Qilish
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-5 mt-10 sm:mt-16">
              {[
                { val: "12+", label: "Yillik Tajriba" },
                { val: "50K+", label: "Mijozlar" },
                { val: "100+", label: "Milliy Taom" },
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center hover:border-[#FFC93C]/20 transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB0] to-[#FF5A1F]">
                    {item.val}
                  </h3>
                  <p className="text-gray-500 text-[8px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.3em] mt-1 sm:mt-2 font-bold">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - IMAGE */}
          <div className="relative flex justify-center mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-[#FFC93C]/15 blur-[150px] rounded-full"></div>
            <div className="relative w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] rounded-[30px] sm:rounded-[40px] overflow-hidden border border-[#FFC93C]/20 bg-white/[0.03] backdrop-blur-3xl shadow-[0_0_100px_rgba(255,180,40,0.06)] group">
              <img 
                loading="lazy"
                src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80" 
                alt="QOZONDA baliq taomi" 
                className="w-full h-[400px] sm:h-[500px] lg:h-[650px] object-cover transition-all duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-black/50 border border-[#FFC93C]/20 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6">
                <span className="text-[#FFDD73] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[8px] sm:text-[10px] font-black">
                  Signature Taom
                </span>
                <h3 className="text-lg sm:text-2xl font-black mt-1 sm:mt-3">Olovda Pishirilgan Baliq</h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">
                  Achchiq pomidor sousi bilan, Qozondaning eng sevimli milliy taomi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-28 border-t border-[#FFC93C]/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <span className="text-[#FFC93C] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs font-black">
              Nega QOZONDA
            </span>
            <h2 className="font-display mt-3 sm:mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-tight">
              Yangi massaliqlardan <br className="block sm:hidden" />
              <span className="text-[#FFC93C]">Dasturxonga</span>
            </h2>
            <div className="divider-ikat mt-6 sm:mt-8">
              <span className="ikat-node"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: "🐟", title: "Tabiiy Baliq", text: "Har kuni yangi sazan va boshqa daryo baliqlaridan tayyorlangan taomlar." },
              { icon: "🥘", title: "Xorazm Oshxonasi", text: "Avlodlardan o'tib kelgan milliy retseptlar asosida pishiriladi." },
              { icon: "👨‍👩‍👧‍👦", title: "Oilaviy Muhit", text: "Daryo bo'yidagi qulay terrasa va samimiy oilaviy atmosfera." },
            ].map((item, i) => (
              <div 
                key={i} 
                className="card-luxe group relative overflow-hidden p-8 sm:p-10 lg:p-12 hover:scale-[1.015] transition-transform duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC93C]/10 via-transparent to-[#FF5A1F]/10 opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFDD73] to-[#FF5A1F] flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_45px_rgba(255,180,40,0.3)]">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mt-6 sm:mt-8">{item.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base mt-3 sm:mt-4 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* GALLERY */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16 lg:mt-20">
            {[
              { src: "https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=600&q=80", label: "Milliy Osh" },
              { src: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80", label: "Olovda Baliq" },
              { src: "https://images.unsplash.com/photo-1768697358705-c1b60333da35?auto=format&fit=crop&w=600&q=80", label: "Restoran Muhiti" },
              { src: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80&sat=-30", label: "Sazan Taomi" },
            ].map((g, i) => (
              <div key={i} className="group relative h-40 sm:h-48 md:h-56 lg:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#FFC93C]/10">
                <img 
                  loading="lazy"
                  src={g.src} 
                  alt={g.label} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <span className="absolute bottom-3 sm:bottom-4 left-3 sm:left-5 text-white text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] font-bold">
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