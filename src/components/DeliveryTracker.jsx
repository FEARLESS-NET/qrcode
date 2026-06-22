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
        { key: 'on_the_way', label: "🚚 Yo'lda", icon: '🚚', bg: 'bg-yellow-500' },
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

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-teal-400 font-bold text-sm uppercase tracking-widest">
          🚚 Yetkazib berish holati
        </h3>
        <span className="text-xs px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
          #{order._id?.slice(-6)}
        </span>
      </div>

      {/* Mijoz ma'lumotlari */}
      <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-white/5 rounded-xl">
        <div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Mijoz</p>
          <p className="text-white font-bold text-sm">{order.customerName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Telefon</p>
          <p className="text-white text-sm">{order.phone}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Tur</p>
          <p className="text-white text-sm">{deliveryTypeLabels[order.deliveryType] || order.deliveryType}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Jami</p>
          <p className="text-yellow-400 font-bold text-sm">{order.totalPrice?.toLocaleString()} so'm</p>
        </div>
      </div>

      {/* Manzil yoki stol */}
      {order.deliveryType === 'delivery' && order.address && (
        <div className="mb-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">📍 Manzil</p>
          <p className="text-white text-sm">{order.address}</p>
        </div>
      )}
      {order.deliveryType === 'dine-in' && order.tableNumber && (
        <div className="mb-4 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">🪑 Stol</p>
          <p className="text-white text-sm">#{order.tableNumber}</p>
        </div>
      )}

      {/* Bekor qilingan bo'lsa alohida banner */}
      {isCancelled && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-center">
          ❌ Bu zakaz bekor qilingan
        </div>
      )}

      {/* Progress bar */}
      <div className={`relative flex items-center justify-between mb-6 mt-4 ${isCancelled ? 'opacity-40 pointer-events-none' : ''}`}>
        {steps.map((step, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div className="relative">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                  transition-all duration-500
                  ${isActive ? step.bg + ' text-white shadow-[0_0_20px_rgba(20,184,166,0.2)]' : 'bg-gray-800 text-gray-500'}
                  ${isCurrent ? 'ring-4 ring-yellow-400/50 animate-pulse' : ''}
                `}>
                  {step.icon}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`
                    absolute top-1/2 left-full w-full h-[2px] -translate-y-1/2
                    transition-all duration-500
                    ${isActive && idx < currentIndex ? 'bg-yellow-500' : 'bg-gray-700'}
                  `} />
                )}
              </div>
              <p className={`text-[10px] mt-2 text-center transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Holat va vaqt */}
      <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
        <div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Hozirgi bosqich</p>
          <p className="text-yellow-400 font-bold text-sm">
            {isCancelled ? '❌ Bekor qilingan' : (steps[currentIndex]?.label || statusLabels[order.status])}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Zakaz holati</p>
          <p className={`text-sm font-bold ${order.status === 'cancelled' ? 'text-red-400' : 'text-green-400'}`}>
            {statusLabels[order.status] || order.status}
          </p>
        </div>
      </div>

      {/* Kuryer ma'lumotlari */}
      {order.courierName && (
        <div className="mt-3 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">👤 Kuryer ma'lumotlari</p>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-white text-sm font-bold">{order.courierName}</p>
              {order.courierPhone && (
                <p className="text-gray-400 text-xs mt-0.5">{order.courierPhone}</p>
              )}
            </div>
            {order.courierPhone && (
              <a
                href={`tel:${order.courierPhone}`}
                className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-500 hover:text-black transition-all whitespace-nowrap"
              >
                📞 Qo'ng'iroq qilish
              </a>
            )}
          </div>
          {order.deliveryTime && (
            <p className="text-gray-400 text-xs mt-2">⏱ Yetkazish vaqti: {order.deliveryTime}</p>
          )}
        </div>
      )}

      {/* Taomlar */}
      <div className="mt-4">
        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">📦 Taomlar</p>
        <div className="space-y-1">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-300">{item.name} x{item.quantity}</span>
              <span className="text-teal-400">{(item.price * item.quantity).toLocaleString()} so'm</span>
            </div>
          ))}
        </div>
      </div>

      {order.note && (
        <div className="mt-3 p-2 bg-gray-500/5 border border-gray-500/20 rounded-xl">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">📝 Izoh</p>
          <p className="text-gray-400 text-sm">{order.note}</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracker;