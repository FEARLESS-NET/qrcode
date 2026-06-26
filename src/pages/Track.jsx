import React from 'react';
import OrderTracker from '../components/OrderTracker';

const Track = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white px-4 sm:px-6 lg:px-10 py-28">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-yellow-500/15 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-400/15 blur-[200px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <OrderTracker />
      </div>
    </div>
  );
};

export default Track;