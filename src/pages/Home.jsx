import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img
          className="absolute inset-0 w-full h-full object-cover scale-110 opacity-40 animate-slowZoom"
          src="https://images.unsplash.com/photo-1776993298422-3e8c397d0235?auto=format&fit=crop&w=1740&q=80"
          alt="Sazanchik restorani interyeri"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/70"></div>
        <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-yellow-500/20 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-amber-400/20 rounded-full blur-[180px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,215,0,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,215,0,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}></div>
      </div>

      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10 py-28">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-yellow-500/20 bg-yellow-500/10 backdrop-blur-xl mb-8">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse"></div>
              <span className="text-yellow-400 uppercase tracking-[0.4em] text-[11px] font-black">
                 MILLIY TAOMLAR
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight uppercase">
              <span className="block text-white">Xush kelibsiz</span>
              <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500">QOZONDA</span>
              <span className="block text-white mt-3 text-3xl sm:text-4xl lg:text-5xl normal-case tracking-normal text-gray-300">dasturxoniga</span>
            </h1>

            <p className="mt-8 text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
               milliy oshxonasining mazali retseptlari — barchasi oilangiz bilan unutilmas oqshom uchun.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mt-10 justify-center lg:justify-start">
              <button onClick={() => navigate("/menu")} className="group relative overflow-hidden px-12 py-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black font-black text-sm uppercase tracking-[0.3em] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] active:scale-95">
                <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition duration-300"></span>
                Menyuni Ko‘rish
              </button>
              <button onClick={() => navigate("/reservation")} className="px-12 py-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl text-white font-bold text-sm uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white/10 hover:border-yellow-500/30 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.05)]">
                Stol Bron Qilish
              </button>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-16">
              {[
                { val: "12+", label: "Yillik Tajriba" },
                { val: "50K+", label: "Mijozlar" },
                { val: "100+", label: "Milliy Taom" },
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 backdrop-blur-xl rounded-1xl p-5 text-center hover:border-yellow-500/20 transition-all duration-300">
                  <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500">{item.val}</h3>
                  <p className="text-gray-500 text-[11px] uppercase tracking-[0.3em] mt-2 font-bold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-yellow-500/15 blur-[150px] rounded-full"></div>
            <div className="relative w-full max-w-[500px] rounded-[40px] overflow-hidden border border-yellow-500/20 bg-white/[0.03] backdrop-blur-3xl shadow-[0_0_100px_rgba(255,215,0,0.06)] group">
              <img src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80" alt="Sazanchikning tabiiy baliq taomi" className="w-full h-[650px] object-cover transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-black/50 border border-yellow-500/20 backdrop-blur-2xl rounded-3xl p-6">
                <span className="text-yellow-400 uppercase tracking-[0.4em] text-[10px] font-black">Signature Taom</span>
                <h3 className="text-2xl font-black mt-3">Olovda Pishirilgan Baliq</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">Achchiq pomidor sousi bilan, Sazanchikning eng sevimli milliy taomi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-28 border-t border-yellow-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-20">
            <span className="text-yellow-500 uppercase tracking-[0.5em] text-xs font-black">Nega qozonda</span>
            <h2 className="mt-5 text-5xl sm:text-3xl font-black uppercase">yangi massaliqlardan <span className="text-yellow-500">Dasturxonga</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🐟", title: "Tabiiy Baliq", text: "Har kuni yangi sazan va boshqa daryo baliqlaridan tayyorlangan taomlar." },
              { icon: "🥘", title: "Xorazm Oshxonasi", text: "Avlodlardan o'tib kelgan milliy retseptlar asosida pishiriladi." },
              { icon: "👨‍👩‍👧‍👦", title: "Oilaviy Muhit", text: "Daryo bo'yidagi qulay terrasa va samimiy oilaviy atmosfera." },
            ].map((item, i) => (
              <div key={i} className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.03] backdrop-blur-3xl p-12 hover:border-yellow-500/30 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(255,215,0,0.05)] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-5xl shadow-[0_0_45px_rgba(255,215,0,0.3)]">{item.icon}</div>
                  <h3 className="text-2xl font-black mt-8">{item.title}</h3>
                  <p className="text-gray-400 mt-4 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {[
              { src: "https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=600&q=80", label: "Milliy Osh" },
              { src: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80", label: "Olovda Baliq" },
              { src: "https://images.unsplash.com/photo-1768697358705-c1b60333da35?auto=format&fit=crop&w=600&q=80", label: "Restoran Muhiti" },
              { src: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80&sat=-30", label: "Sazan Taomi" },
            ].map((g, i) => (
              <div key={i} className="group relative h-56 sm:h-64 rounded-3xl overflow-hidden border border-yellow-500/10">
                <img src={g.src} alt={g.label} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <span className="absolute bottom-4 left-5 text-white text-xs uppercase tracking-[0.25em] font-bold">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;