import React, { useState } from 'react';
import { axiosInstance } from '../api/axios';

const PaymentModal = ({ isOpen, onClose, orderId, totalPrice, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [error, setError] = useState('');

  const paymentMethods = [
    { id: 'click', name: 'Click', icon: '💳', color: 'from-blue-500 to-blue-700' },
    { id: 'payme', name: 'Payme', icon: '📱', color: 'from-purple-500 to-purple-700' },
    { id: 'uzumbank', name: 'UzumBank', icon: '🏦', color: 'from-green-500 to-green-700' },
    { id: 'cash', name: 'Naqd pul', icon: '💰', color: 'from-yellow-500 to-orange-500' },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('To\'lov usulini tanlang!');
      return;
    }

    if (selectedMethod === 'cash') {
      onSuccess('cash');
      onClose();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = `/payment/${selectedMethod}`;
      const res = await axiosInstance.post(endpoint, {
        orderId,
        amount: totalPrice,
        phone: '+998901234567', // Mijoz telefon raqami
      });

      if (res.data.paymentUrl) {
        // Yangi oynada to'lov sahifasini ochish
        window.open(res.data.paymentUrl, '_blank');
        onSuccess(selectedMethod);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'To\'lovda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-[32px] p-6 sm:p-10 max-w-lg w-full shadow-[0_0_80px_rgba(255,215,0,0.1)] animate-fadeInUp">
        
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(255,215,0,0.3)]">
            💳
          </div>
          <h2 className="text-2xl font-black mt-4 text-white">To'lov</h2>
          <p className="text-gray-400 text-sm mt-2">
            Jami: <span className="text-yellow-400 font-bold">{totalPrice.toLocaleString()} so'm</span>
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`
                relative p-4 rounded-2xl border transition-all
                ${selectedMethod === method.id
                  ? `border-yellow-400 bg-yellow-500/10 shadow-[0_0_30px_rgba(255,215,0,0.2)]`
                  : 'border-white/10 bg-white/[0.03] hover:border-yellow-500/30'
                }
              `}
            >
              <div className="text-2xl">{method.icon}</div>
              <p className="text-white text-sm font-bold mt-1">{method.name}</p>
              {selectedMethod === method.id && (
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-yellow-400"></div>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Buttons */}
        <button
          onClick={handlePayment}
          disabled={loading || !selectedMethod}
          className="
            w-full py-4 rounded-2xl
            bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500
            text-black font-black uppercase tracking-[0.2em]
            transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {loading ? '⏳ Jarayon...' : 'To\'lovni amalga oshirish'}
        </button>

        <p className="text-center text-gray-600 text-xs mt-4">
          Xavfsiz to'lov tizimi. Ma'lumotlaringiz himoyalangan.
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;