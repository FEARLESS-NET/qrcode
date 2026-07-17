import React from 'react';

const DeliveryTracker = ({ order }) => {
  if (!order) return null;

  const isCancelled = order.status === 'cancelled';
  const isDelivery = order.deliveryType === 'delivery';

  const steps = isDelivery
    ? [
        { key: 'pending', label: '⏳ Kutilmoqda', icon: '🕐', bg: 'bg-gray-600' },
        { key: 'confirmed', label: '✅ Tasdiqlandi', icon: '✅', bg: 'bg-green-500' },
        { key: 'preparing', label: '👨‍🍳 Tayyorlanmoqda', icon: '👨‍🍳', bg: 'bg-blue-500' },
        { key: 'ready', label: '🎉 Tayyor', icon: '🎉', bg: 'bg-teal-500' },
        { key: 'on_the_way', label: "🚚 Yo'lda", icon: '🚚', bg: 'bg-[#FFC93C]' },
        { key: 'delivered', label: '✅ Yetkazildi', icon: '🏁', bg: 'bg-green-500' },
      ]
    : [
        { key: 'pending', label: '⏳ Kutilmoqda', icon: '🕐', bg: 'bg-gray-600' },
        { key: 'confirmed', label: '✅ Tasdiqlandi', icon: '✅', bg: 'bg-green-500' },
        { key: 'preparing', label: '👨‍🍳 Tayyorlanmoqda', icon: '👨‍🍳', bg: 'bg-blue-500' },
        {
          key: 'ready',
          label: order.deliveryType === 'takeaway' ? '🥡 Tayyor, kuting' : '🍽 Tayyor, taklif etiladi',
          icon: '🎉',
          bg: 'bg-teal-500',
        },
      ];

  const getCurrentKey = () => {
    if (order.deliveryStatus === 'delivered') return 'delivered';
    if (order.deliveryStatus === 'on_the_way') return 'on_the_way';
    if (order.status === 'ready') return 'ready';
    if (order.status === 'preparing') return 'preparing';
    if (order.status === 'confirmed') return 'confirmed';
    return 'pending';
  };

  const currentIndex = isCancelled ? -1 : steps.findIndex((s) => s.key === getCurrentKey());
  
  const deliveryTypeLabels = {
    'dine-in': '🍽 Restoran',
    'takeaway': '🥡 Olib ketish',
    'delivery': '🚚 Yetkazish',
  };

  const statusLabels = {
    'pending': '⏳ Kutilmoqda',
    'confirmed': '✅ Tasdiqlandi',
    'preparing': '👨‍🍳 Tayyorlanmoqda',
    'ready': '🎉 Tayyor',
    'cancelled': '❌ Bekor qilingan',
  };

  // ✅ Stol joylashuvi map
  const locationMap = {
    'main_hall': '🏛 Asosiy zal',
    'terrace': '🌿 Terassa',
    'vip_room': '👑 VIP xona',
    'garden': '🌳 Bog\'',
  };

  return (
    <div className="bg-white/[0.03] border border-[#FFC93C]/15 rounded-2xl p-4 sm:p-6 hover:border-[#FFC93C]/30 transition-all">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <h3 className="text-[#FFDD73] font-bold text-xs sm:text-sm uppercase tracking-widest">
          🚚 Yetkazib berish holati
        </h3>
        <span className="text-[10px] sm:text-xs px-3 py-1.5 rounded-full bg-[#FFC93C]/15 text-[#FFDD73] border border-[#FFC93C]/20 font-bold">
          #{order._id?.slice(-6)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-3 bg-white/5 rounded-xl">
        <div>
          <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold">Mijoz</p>
          <p className="text-white font-bold text-xs sm:text-sm">{order.customerName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold">Telefon</p>
          <p className="text-white text-xs sm:text-sm">{order.phone}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold">Tur</p>
          <p className="text-white text-xs sm:text-sm">{deliveryTypeLabels[order.deliveryType] || order.deliveryType}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold">Jami</p>
          <p className="text-[#FFDD73] font-bold text-xs sm:text-sm">{order.totalPrice?.toLocaleString()} so'm</p>
        </div>
      </div>

      {/* ✅ STOL JOYLASHUVI - YANGI QO'SHILDI */}
      {order.deliveryType === 'dine-in' && (
        <div className="mb-4 p-3 bg-[#FFC93C]/10 border border-[#FFC93C]/20 rounded-xl">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">🪑 Stol</p>
            <p className="text-white font-bold text-sm">
              #{order.tableNumber || 'Belgilanmagan'}
            </p>
            {order.tableLocation && (
              <span className="text-[#FFDD73] text-xs font-bold">
                📍 {order.tableLocation}
              </span>
            )}
            {order.diningArea && (
              <span className="text-gray-400 text-xs">
                {locationMap[order.diningArea] || order.diningArea}
              </span>
            )}
          </div>
        </div>
      )}

      {order.deliveryType === 'delivery' && order.address && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">📍 Manzil</p>
          <p className="text-white text-xs sm:text-sm">{order.address}</p>
        </div>
      )}

      {isCancelled && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-center text-sm">
          ❌ Bu zakaz bekor qilingan
        </div>
      )}

      <div className={`relative flex items-center justify-between mb-6 mt-4 overflow-x-auto ${isCancelled ? 'opacity-40 pointer-events-none' : ''}`}>
        {steps.map((step, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1 min-w-[50px] sm:min-w-[60px]">
              <div className="relative">
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold
                  transition-all duration-500
                  ${isActive ? step.bg + ' text-white shadow-[0_0_25px_rgba(255,180,40,0.15)]' : 'bg-gray-800 text-gray-500'}
                  ${isCurrent ? 'ring-4 ring-[#FFDD73]/50 animate-pulse' : ''}
                `}>
                  {step.icon}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`
                    absolute top-1/2 left-full w-full h-[2px] -translate-y-1/2
                    transition-all duration-500
                    ${isActive && idx < currentIndex ? 'bg-[#FFC93C]' : 'bg-gray-700'}
                  `} />
                )}
              </div>
              <p className={`text-[8px] sm:text-[10px] mt-2 text-center transition-all duration-300 font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-between items-center p-3 bg-white/5 rounded-xl gap-2">
        <div>
          <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold">Hozirgi bosqich</p>
          <p className="text-[#FFDD73] font-bold text-xs sm:text-sm">
            {isCancelled ? '❌ Bekor qilingan' : (steps[currentIndex]?.label || statusLabels[order.status])}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold">Zakaz holati</p>
          <p className={`text-xs sm:text-sm font-bold ${order.status === 'cancelled' ? 'text-red-400' : 'text-green-400'}`}>
            {statusLabels[order.status] || order.status}
          </p>
        </div>
      </div>

      {order.courierName && (
        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold mb-1">👤 Kuryer ma'lumotlari</p>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-white text-xs sm:text-sm font-bold">{order.courierName}</p>
              {order.courierPhone && (
                <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">{order.courierPhone}</p>
              )}
            </div>
            {order.courierPhone && (
              <a
                href={`tel:${order.courierPhone}`}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] sm:text-xs font-bold hover:bg-green-500 hover:text-black transition-all whitespace-nowrap"
              >
                📞 Qo'ng'iroq qilish
              </a>
            )}
          </div>
          {order.deliveryTime && (
            <p className="text-gray-400 text-[10px] sm:text-xs mt-2">⏱ Yetkazish vaqti: {order.deliveryTime}</p>
          )}
        </div>
      )}

      <div className="mt-4">
        <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold mb-2">📦 Taomlar</p>
        <div className="space-y-1">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex flex-wrap justify-between text-xs sm:text-sm">
              <span className="text-gray-300">{item.name} x{item.quantity}</span>
              <span className="text-[#FFDD73] font-bold">{(item.price * item.quantity).toLocaleString()} so'm</span>
            </div>
          ))}
        </div>
      </div>

      {order.note && (
        <div className="mt-3 p-2 bg-gray-500/10 border border-gray-500/20 rounded-xl">
          <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold">📝 Izoh</p>
          <p className="text-gray-400 text-xs sm:text-sm">{order.note}</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracker;