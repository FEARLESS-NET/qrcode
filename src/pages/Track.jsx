import React from 'react';
import OrderTracker from '../components/OrderTracker';

const Track = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#130e0a] text-white px-4 sm:px-6 lg:px-10 py-24 sm:py-28">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80&fm=webp"
          alt="Restaurant background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#130e0a]/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC93C]/5 via-transparent to-[#E08A3C]/5" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#E08A3C]/15 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#FFDD73]/15 blur-[200px] animate-pulse delay-700" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,180,40,0.03) 50px, rgba(255,180,40,0.03) 51px),
            repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(255,180,40,0.03) 50px, rgba(255,180,40,0.03) 51px)
          `
        }} />
        
        {/* Ember particles */}
        {[...Array(16)].map((_, i) => (
          <span
            key={`far-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 6.2 + 2) % 100}%`,
              '--size': `${2 + (i % 3)}px`,
              filter: 'blur(0.5px)',
              opacity: 0.45,
              animationDuration: `${9 + (i % 6) * 1.4}s`,
              animationDelay: `${i * 0.6}s`,
              '--drift': `${((i % 5) - 2) * 30}px`,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <span
            key={`near-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 8.1 + 6) % 100}%`,
              '--size': `${4 + (i % 4)}px`,
              animationDuration: `${6 + (i % 4) * 1.2}s`,
              animationDelay: `${i * 0.5}s`,
              '--drift': `${((i % 3) - 1) * 55}px`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#FFC93C]/20 bg-[#FFC93C]/10 backdrop-blur-xl mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFDD73] animate-pulse"></div>
            <span className="text-[#FFDD73] uppercase tracking-[0.4em] text-[11px] font-black">
              🚀 Real-time Tracking
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB0] via-[#FFA23D] to-[#FF5A1F] drop-shadow-[0_0_50px_rgba(255,180,40,0.15)]">
            Zakazni Kuzatish
          </h1>
          <p className="mt-4 text-gray-400 text-lg font-light tracking-wider">
            Zakazingizning holatini real vaqtda kuzatib boring
          </p>
            
        </div>

        <div className="bg-white/[0.03] border border-[#FFC93C]/15 backdrop-blur-3xl rounded-[32px] p-8 sm:p-12 hover:border-[#FFC93C]/30 transition-all duration-500 shadow-[0_0_60px_rgba(255,180,40,0.05)]">
          <OrderTracker />
        </div>
      </div>

      <style>{`
        .ember-particle {
          position: fixed;
          bottom: -10px;
          width: var(--size, 3px);
          height: var(--size, 3px);
          background: radial-gradient(circle, #FFDD73, #E08A3C);
          border-radius: 50%;
          pointer-events: none;
          animation: floatUp linear infinite;
          box-shadow: 0 0 10px rgba(255, 180, 40, 0.3);
          z-index: 1;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-110vh) translateX(var(--drift, 0px)) scale(0.3); opacity: 0; }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-glowPulse {
          animation: glowPulse 2s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 180, 40, 0.2); }
          50% { box-shadow: 0 0 40px rgba(255, 180, 40, 0.4); }
        }
        .card-luxe {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 200, 60, 0.1);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-luxe:hover {
          border-color: rgba(255, 200, 60, 0.3);
          box-shadow: 0 0 40px rgba(255, 180, 40, 0.05);
        }
      `}</style>
    </div>
  );
};

export default Track;