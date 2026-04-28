import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* HERO SECTION */}
      <div className="relative h-screen w-full flex items-center justify-center">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            className="h-full w-full object-cover opacity-60 scale-105 animate-slowZoom" 
            src="https://bunny-wp-pullzone-tnssu64psr.b-cdn.net/wp-content/uploads/sites/6/2025/10/@mooncakepictures-skylon-evening-dinner.jpg" 
            alt="Restaurant Atmosphere" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/50"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-yellow-500 font-medium tracking-[0.4em] uppercase text-sm mb-4 block animate-fadeInUp">
            Xush Kelibsiz bizning Restoranimizga
          </span>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter animate-fadeInUp delay-100">
            Haqiqiy <span className="text-yellow-500">Lazzat</span> <br /> 
            Maskaniga
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fadeInUp delay-200">
            Bizning oshpazlarimiz tomonidan tayyorlangan eksklyuziv taomlar 
            sizga unutilmas gastronomik zavq bag'ishlaydi.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fadeInUp delay-300">
            <button 
              onClick={() => navigate('/menu')}
              className="px-10 py-4 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-yellow-500/20"
            >
              Menyuni Ko'rish
            </button>
            <button 
              className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Biz Haqimizda
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-yellow-500 to-transparent"></div>
        </div>
      </div>

      {/* QUICK STATS SECTION */}
      <div className="relative z-10 bg-[#0a0a0a] py-20 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { label: 'Yillik Tajriba', val: '12+' },
              { label: 'Mohir Oshpazlar', val: '8' },
              { label: 'Mamnun Mijozlar', val: '50k+' },
              { label: 'Maxsus Taomlar', val: '100+' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-black text-yellow-500">{stat.val}</h3>
                <p className="text-gray-500 text-sm uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURE SECTION */}
      <div className="container mx-auto px-6 py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-yellow-500/20 rounded-2xl blur-2xl group-hover:bg-yellow-500/30 transition duration-500"></div>
            <img 
              className="relative rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition duration-700 w-full h-[500px] object-cover" 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80" 
              alt="Interior" 
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ajoyib Atmosfera va <br /> 
              <span className="text-yellow-500">Sifatli Xizmat</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Biz faqat eng yangi mahsulotlardan foydalanamiz. Har bir taomimiz 
              o'ziga xos hikoyaga ega va sizga eng yaxshi xizmatni ko'rsatish bizning 
              oliy maqsadimizdir.
            </p>
            <ul className="space-y-4">
              {['Fresh Ingredients', 'Expert Chefs', 'Cozy Ambience'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white font-medium">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;