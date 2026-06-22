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

  // ✅ LocalStorage dan o'chirilgan zakaz ID larini yuklash
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

  // ✅ O'chirilgan ID larni localStorage ga saqlash
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
      
      // ✅ O'chirilgan zakazlarni filtrlash (qaytib kelmasligi uchun)
      const filteredOrders = (res.data.orders || []).filter(
        (order) => !deletedOrderIds.includes(order._id)
      );
      
      setOrders(filteredOrders);
      
      if (filteredOrders.length > 0) {
        setSelectedOrder(filteredOrders[0]);
      } else {
        // ✅ Barcha zakazlar o'chirilgan bo'lsa
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

  // ✅ Bitta zakazni o'chirish
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Ushbu zakazni tarixingizdan butunlay o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.")) {
      return;
    }

    setDeleteLoading(true);
    try {
      // ✅ Backenddan o'chirish (agar kerak bo'lsa)
      // await axiosInstance.delete(`/orders/${orderId}`);
      
      // ✅ LocalStorage ga o'chirilgan ID ni qo'shish
      const newDeletedIds = [...deletedOrderIds, orderId];
      saveDeletedIds(newDeletedIds);
      
      // ✅ Ro'yxatdan o'chiramiz
      const updatedOrders = orders.filter((o) => o._id !== orderId);
      setOrders(updatedOrders);
      
      // ✅ Agar tanlangan zakaz o'chirilgan bo'lsa, boshqasini tanlaymiz
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

  // ✅ Barcha zakazlarni o'chirish
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
      // ✅ Barcha zakaz ID larini o'chirilganlar ro'yxatiga qo'shish
      const allIds = orders.map((o) => o._id);
      const newDeletedIds = [...deletedOrderIds, ...allIds];
      saveDeletedIds(newDeletedIds);
      
      // ✅ Ro'yxatni tozalash
      setOrders([]);
      setSelectedOrder(null);
      
      alert(`✅ Barcha ${allIds.length} ta zakaz tarixdan o\'chirildi!`);
    } catch (err) {
      alert('❌ Xatolik yuz berdi');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ✅ O'chirilgan zakazlarni qayta tiklash (agar xato bo'lsa)
  const handleRestoreDeleted = () => {
    if (deletedOrderIds.length === 0) {
      alert('O\'chirilgan zakazlar mavjud emas');
      return;
    }
    
    if (window.confirm(`Barcha ${deletedOrderIds.length} ta o'chirilgan zakazni qayta tiklash?`)) {
      saveDeletedIds([]);
      alert('✅ Barcha zakazlar qayta tiklandi!');
      // Qayta qidirishni amalga oshiramiz
      if (phone || name) {
        trackOrder(new Event('submit'));
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white">🚚 Zakaz Holati</h2>
        <p className="text-gray-400 mt-2">Zakazingizni telefon raqam orqali kuzating</p>
        
        {/* ✅ O'chirilgan zakazlar soni */}
        {deletedOrderIds.length > 0 && (
          <p className="text-gray-500 text-xs mt-2">
            📌 {deletedOrderIds.length} ta zakaz tarixdan o'chirilgan
          </p>
        )}
      </div>

      {/* Search form */}
      <form onSubmit={trackOrder} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998 90 000 00 00"
          required
          className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 focus:border-teal-400 transition-all"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ismingiz"
          required
          className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 focus:border-teal-400 transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-amber-400 text-black font-black uppercase tracking-[0.2em] transition-all hover:scale-105 disabled:opacity-50"
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
          <div className="flex justify-between items-center flex-wrap gap-2">
            <p className="text-gray-400 text-sm">
              📋 {orders.length} ta zakaz topildi
            </p>
            <div className="flex gap-2">
              {/* ✅ Barchasini o'chirish tugmasi */}
              <button
                onClick={handleDeleteAllOrders}
                disabled={deleteLoading}
                className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 px-3 py-1.5 rounded-xl border border-red-500/20 hover:border-red-500/50"
              >
                {deleteLoading ? '⏳...' : '🗑 Barchasini o\'chirish'}
              </button>
              
              {/* ✅ O'chirilganlarni tiklash (yashirin - agar xato bo'lsa) */}
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
          <div className="flex gap-2 mt-2 flex-wrap">
            {orders.map((order, idx) => (
              <button
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedOrder?._id === order._id
                    ? 'bg-teal-400 text-black'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:border-teal-500/30'
                }`}
              >
                #{idx + 1} - {new Date(order.createdAt).toLocaleDateString()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Hech qanday zakaz qolmagan holat */}
      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">📭 Hozircha zakazlar mavjud emas</p>
          <p className="text-gray-600 text-sm mt-2">Yangi zakaz berish uchun menyuga o'ting</p>
        </div>
      )}

      {/* Delivery Tracker + Delete button */}
      {selectedOrder && (
        <div className="relative">
          <DeliveryTracker order={selectedOrder} />
          
          {/* ✅ O'chirish tugmasi */}
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