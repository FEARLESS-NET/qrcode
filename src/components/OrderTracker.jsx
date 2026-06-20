import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../api/axios';
import DeliveryTracker from './DeliveryTracker';

const OrderTracker = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const trackOrder = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Iltimos, telefon raqamini kiriting!');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedOrder(null);

    try {
      const res = await axiosInstance.get(`/orders/phone/${phone.trim()}`);
      setOrders(res.data.orders || []);
      if (res.data.orders?.length > 0) {
        setSelectedOrder(res.data.orders[0]);
      } else {
        setError('Bu raqam bilan zakaz topilmadi');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white">🚚 Zakaz Holati</h2>
        <p className="text-gray-400 mt-2">Zakazingizni telefon raqam orqali kuzating</p>
      </div>

      {/* Search form */}
      <form onSubmit={trackOrder} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998 90 000 00 00"
          className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 focus:border-cyan-400 transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-black font-black uppercase tracking-[0.2em] transition-all hover:scale-105 disabled:opacity-50"
        >
          {loading ? '⏳...' : '🔍 Qidirish'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Barcha zakazlar */}
      {orders.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm">
            {orders.length} ta zakaz topildi
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {orders.map((order, idx) => (
              <button
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedOrder?._id === order._id
                    ? 'bg-cyan-400 text-black'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:border-cyan-500/30'
                }`}
              >
                #{idx + 1} - {new Date(order.createdAt).toLocaleDateString()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Tracker */}
      {selectedOrder && (
        <DeliveryTracker order={selectedOrder} />
      )}
    </div>
  );
};

export default OrderTracker;
