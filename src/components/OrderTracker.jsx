import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../api/axios';
import DeliveryTracker from './DeliveryTracker';

const OrderTracker = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletedOrderIds, setDeletedOrderIds] = useState([]);
 
  useEffect(() => {
    const saved = localStorage.getItem('deletedOrderIds');
    if (saved) {
      try {
        setDeletedOrderIds(JSON.parse(saved));
      } catch (e) {
        setDeletedOrderIds([]);
      }
    }
  }, []);

  const saveDeletedIds = (ids) => {
    localStorage.setItem('deletedOrderIds', JSON.stringify(ids));
    setDeletedOrderIds(ids);
  };

  const trackOrder = async (e) => {
    e.preventDefault();
    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();

    if (!trimmedPhone || !trimmedName) {
      setError('Iltimos, telefon raqami va ismni to\'liq kiriting!');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedOrder(null);

    try {
      const params = {};
      if (trimmedPhone) params.phone = trimmedPhone;
      if (trimmedName) params.name = trimmedName;

      const res = await axiosInstance.get('/orders/search', { params });
      
      const filteredOrders = (res.data.orders || []).filter(
        (order) => !deletedOrderIds.includes(order._id)
      );
      
      setOrders(filteredOrders);
      
      if (filteredOrders.length > 0) {
        setSelectedOrder(filteredOrders[0]);
      } else {
        if (res.data.orders?.length > 0 && filteredOrders.length === 0) {
          setError('Barcha zakazlar tarixdan o\'chirilgan');
        } else {
          setError('Bu ma\'lumotlar bilan zakaz topilmadi');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Ushbu zakazni tarixingizdan butunlay o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.")) {
      return;
    }

    setDeleteLoading(true);
    try {
      const newDeletedIds = [...deletedOrderIds, orderId];
      saveDeletedIds(newDeletedIds);
      
      const updatedOrders = orders.filter((o) => o._id !== orderId);
      setOrders(updatedOrders);
      
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(updatedOrders.length > 0 ? updatedOrders[0] : null);
      }
      
      alert('✅ Zakaz tarixdan o\'chirildi!');
    } catch (err) {
      alert('❌ Xatolik: ' + (err.response?.data?.message || 'Zakaz o\'chirilmadi'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteAllOrders = async () => {
    if (orders.length === 0) {
      alert('O\'chirish uchun zakazlar mavjud emas');
      return;
    }
    
    if (!window.confirm(`Barcha ${orders.length} ta zakazni tarixdan o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      const allIds = orders.map((o) => o._id);
      const newDeletedIds = [...deletedOrderIds, ...allIds];
      saveDeletedIds(newDeletedIds);
      
      setOrders([]);
      setSelectedOrder(null);
      
      alert(`✅ Barcha ${allIds.length} ta zakaz tarixdan o\'chirildi!`);
    } catch (err) {
      alert('❌ Xatolik yuz berdi');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestoreDeleted = () => {
    if (deletedOrderIds.length === 0) {
      alert('O\'chirilgan zakazlar mavjud emas');
      return;
    }
    
    if (window.confirm(`Barcha ${deletedOrderIds.length} ta o'chirilgan zakazni qayta tiklash?`)) {
      saveDeletedIds([]);
      alert('✅ Barcha zakazlar qayta tiklandi!');
      if (phone || name) {
        trackOrder(new Event('submit'));
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white">🚚 Zakaz Holati</h2>
        <p className="text-gray-400 mt-3">Zakazingizni telefon raqam orqali kuzating</p>
        
        {deletedOrderIds.length > 0 && (
          <p className="text-gray-500 text-xs mt-3 font-bold">
            📌 {deletedOrderIds.length} ta zakaz tarixdan o'chirilgan
          </p>
        )}
      </div>

      <form onSubmit={trackOrder} className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998 90 000 00 00"
          required
          className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 focus:border-[#FFDD73] focus:shadow-[0_0_25px_rgba(255,180,40,0.05)] transition-all"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ismingiz"
          required
          className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 focus:border-[#FFDD73] focus:shadow-[0_0_25px_rgba(255,180,40,0.05)] transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F] text-black font-black uppercase tracking-[0.25em] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,180,40,0.3)] disabled:opacity-50"
        >
          {loading ? '⏳...' : '🔍 Qidirish'}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-center font-bold">
          ⚠️ {error}
        </div>
      )}

      {orders.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <p className="text-gray-400 text-sm font-bold">
              📋 {orders.length} ta zakaz topildi
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAllOrders}
                disabled={deleteLoading}
                className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 px-3 py-1.5 rounded-xl border border-red-500/20 hover:border-red-500/50"
              >
                {deleteLoading ? '⏳...' : '🗑 Barchasini o\'chirish'}
              </button>
              {deletedOrderIds.length > 0 && (
                <button
                  onClick={handleRestoreDeleted}
                  className="text-green-400 hover:text-green-300 text-xs font-bold uppercase tracking-widest transition-all px-3 py-1.5 rounded-xl border border-green-500/20 hover:border-green-500/50"
                >
                  ↩️ Qayta tiklash
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {orders.map((order, idx) => (
              <button
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedOrder?._id === order._id
                    ? 'bg-gradient-to-r from-[#FFDD73] to-[#E08A3C] text-black'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:border-[#FFC93C]/30'
                }`}
              >
                #{idx + 1} - {new Date(order.createdAt).toLocaleDateString()}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">📭 Hozircha zakazlar mavjud emas</p>
          <p className="text-gray-600 text-sm mt-2">Yangi zakaz berish uchun menyuga o'ting</p>
        </div>
      )}

      {selectedOrder && (
        <div className="relative">
          <DeliveryTracker order={selectedOrder} />
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={() => handleDeleteOrder(selectedOrder._id)}
              disabled={deleteLoading}
              className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {deleteLoading ? '⏳...' : '🗑 Bu zakazni o\'chirish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;