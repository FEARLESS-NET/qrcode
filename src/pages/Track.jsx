import React from 'react';
import OrderTracker from '../components/OrderTracker';

const Track = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white px-4 sm:px-6 lg:px-10 py-24">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(20,184,166,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(20,184,166,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
          }}
        />
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-teal-500/15 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-amber-600/15 blur-[180px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        <OrderTracker />
      </div>
    </div>
  );
};

export default Track;