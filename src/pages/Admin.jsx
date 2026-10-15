/**
 * ADMIN PAGE – ADMIN PANEL
 * Tablar: Menu, Stollar, Bronlar, Zakazlar, Hisobotlar.
 * Menu: CRUD (rasm yuklash URL yoki fayl). Retsept o'rniga gramm va porsiya kiritiladi.
 * Stollar: qo'shish, o'chirish, band/bo'sh qilish.
 * Bronlar: ko'rish, tasdiqlash, bekor qilish, yakunlanganlarni o'chirish.
 * Zakazlar: holatini o'zgartirish (pending→confirmed→preparing→ready), yetkazib berish holati (on_the_way→delivered), kuryer tayinlash, chek chop etish.
 * Hisobotlar: kunlik statistikani ko'rish, reset qilish, o'chirish.
 * JWT autentifikatsiya (token localStorage da saqlanadi).
 */
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";
import Reports from "../components/Reports.jsx";

const TABS = ["Menu", "Stollar", "Bronlar", "Zakazlar", "Hisobotlar"];
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'https://backend-4-9otm.onrender.com';
const NO_IMAGE_URL = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' fill='%23888' font-family='sans-serif' font-size='20' text-anchor='middle' dominant-baseline='middle'%3ERasm yo'q%3C/text%3E%3C/svg%3E";

/* Qayta ishlatiladigan stillar (oltin + qora) */
const goldGrad = "bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#B8860B]";
const goldText =
  "text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#E0A100]";
const labelCls =
  "text-[11px] uppercase tracking-[0.3em] text-[#FFE27A] block mb-2 font-extrabold";
const inputCls =
  "w-full bg-black/70 border border-[#FFD700]/30 rounded-2xl px-5 py-4 outline-none text-white font-medium placeholder:text-gray-400 focus:border-[#FFD700] focus:shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:border-[#FFD700]/60 transition-all";
const inputSmCls =
  "w-full bg-black/70 border border-[#FFD700]/30 rounded-xl px-4 py-3 outline-none text-white font-medium placeholder:text-gray-400 focus:border-[#FFD700] focus:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:border-[#FFD700]/60 transition-all";

const getImageUrl = (imagePath) => {
  if (!imagePath) return NO_IMAGE_URL;
  if (imagePath.startsWith("http")) {
    if (imagePath.includes('images.unsplash.com')) {
      return imagePath.includes('?') ? `${imagePath}&fm=webp` : `${imagePath}?fm=webp`;
    }
    return imagePath;
  }
  if (imagePath.startsWith("/uploads/")) {
    return `${BASE_URL}${imagePath}`;
  }
  return `${BASE_URL}/uploads/${imagePath}`;
};

const normalizeImageUrl = (raw) => {
  const url = (raw || "").trim();
  if (!url) return { url: "" };
  try {
    const u = new URL(url);
    if (u.hostname === "www.google.com" || u.hostname === "google.com" || u.hostname.startsWith("www.google.")) {
      const imgurl = u.searchParams.get("imgurl");
      if (imgurl) return { url: imgurl };
      return { error: "Bu Google qidiruv havolasi — rasm emas!\n\nRasmning o'zini oching, ustiga o'ng tugmani bosing va \"Rasm manzilini nusxalash\" (Copy Image Address) ni tanlang." };
    }
  } catch { }
  return { url };
};

const emptyForm = { name: "", price: "", grams: "", portion: "", image: "", category: "" };

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Menu");
  const [loading, setLoading] = useState(true);

  // ✅ JWT token tekshiruvi
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const [menus, setMenus] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const getMenus = async () => {
    try {
      const res = await axiosInstance.get("/menus");
      setMenus(res.data.menus || []);
    } catch (err) { console.error(err); }
  };

  const [tables, setTables] = useState([]);
  const [tableStats, setTableStats] = useState({ total: 0, available: 0, booked: 0 });
  const [tableForm, setTableForm] = useState({ number: "", capacity: "", location: "" });

  const getTables = async () => {
    try {
      const res = await axiosInstance.get("/tables");
      setTables(res.data.tables || []);
      setTableStats(res.data.stats || {});
    } catch (err) { console.error(err); }
  };

  const [reservations, setReservations] = useState([]);
  const [deletingCompleted, setDeletingCompleted] = useState(false);
  const [deletingAllReservations, setDeletingAllReservations] = useState(false);

  const getReservations = async () => {
    try {
      const res = await axiosInstance.get("/reservations");
      setReservations(res.data.reservations || []);
    } catch (err) { console.error(err); }
  };

  const [orders, setOrders] = useState([]);
  const [deletingCompletedOrders, setDeletingCompletedOrders] = useState(false);
  const [deletingAllOrders, setDeletingAllOrders] = useState(false);

  const getOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) { console.error(err); }
  };

  const handlePrintReceipt = async (orderId) => {
    try {
      const response = await axiosInstance.get(`/receipt/${orderId}/download`, {
        responseType: 'blob'
      });

      const html = await response.data.text();

      const oldIframe = document.getElementById('receipt-print-frame');
      if (oldIframe) oldIframe.remove();

      const iframe = document.createElement('iframe');
      iframe.id = 'receipt-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();

      const cleanup = () => {
        const el = document.getElementById('receipt-print-frame');
        if (el) el.remove();
      };

      const triggerPrint = () => {
        try {
          iframe.contentWindow.focus();
          setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(cleanup, 1000);
          }, 400);
        } catch (e) {
          console.error('❌ Print xatosi:', e);
          alert('Chekni chop etishda xatolik yuz berdi.');
          cleanup();
        }
      };

      if (doc.readyState === 'complete') {
        triggerPrint();
      } else {
        iframe.onload = triggerPrint;
      }
    } catch (err) {
      console.error('❌ Chek yuklash xatosi:', err);
      alert('Chek yuklashda xatolik yuz berdi: ' + err.message);
    }
  };

  const handleDeleteCompletedReservations = async () => {
    const completed = reservations.filter(r => r.status === "confirmed" || r.status === "cancelled");
    if (completed.length === 0) {
      alert("O'chirish uchun yakunlangan bronlar mavjud emas!");
      return;
    }
    if (!window.confirm(`⚠️ YAKUNLANGAN BRONLARNI O'CHIRISH!\n\n📌 ${completed.length} ta bron o'chiriladi\n📌 Status: confirmed / cancelled\n📌 Bu amalni qaytarib bo'lmaydi!\n\nDavom etasizmi?`)) return;

    setDeletingCompleted(true);
    try {
      const res = await axiosInstance.delete("/reservations/completed");
      alert(res.data.message);
      getReservations();
    } catch (err) {
      alert("❌ Xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setDeletingCompleted(false);
    }
  };

  const handleDeleteAllReservations = async () => {
    if (reservations.length === 0) {
      alert("O'chirish uchun bronlar mavjud emas!");
      return;
    }
    if (!window.confirm(`⚠️ BARCHA BRONLARNI BUTUNLAY O'CHIRISH!\n\n📌 ${reservations.length} ta bron butunlay o'chiriladi\n📌 Status: barcha (pending, confirmed, cancelled)\n📌 Bu amalni qaytarib bo'lmaydi!\n\nDavom etasizmi?`)) return;

    setDeletingAllReservations(true);
    try {
      const res = await axiosInstance.delete("/reservations/force");
      alert(res.data.message);
      getReservations();
    } catch (err) {
      alert("❌ Xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setDeletingAllReservations(false);
    }
  };

  const handleDeleteCompletedOrders = async () => {
    const completed = orders.filter(o => o.status === "ready" || o.deliveryStatus === "delivered");
    if (completed.length === 0) {
      alert("O'chirish uchun yakunlangan zakazlar mavjud emas!");
      return;
    }
    if (!window.confirm(`⚠️ YAKUNLANGAN ZAKAZLARNI O'CHIRISH!\n\n📌 ${completed.length} ta zakaz o'chiriladi\n📌 Status: ready / delivered\n📌 Bu amalni qaytarib bo'lmaydi!\n\nDavom etasizmi?`)) return;

    setDeletingCompletedOrders(true);
    try {
      const res = await axiosInstance.delete("/orders/completed");
      alert(res.data.message);
      getOrders();
    } catch (err) {
      alert("❌ Xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setDeletingCompletedOrders(false);
    }
  };

  const handleDeleteAllOrders = async () => {
    if (orders.length === 0) {
      alert("O'chirish uchun zakazlar mavjud emas!");
      return;
    }
    if (!window.confirm(`⚠️ BARCHA ZAKAZLARNI BUTUNLAY O'CHIRISH!\n\n📌 ${orders.length} ta zakaz butunlay o'chiriladi\n📌 Status: barcha (pending, confirmed, preparing, ready, cancelled)\n📌 Bu amalni qaytarib bo'lmaydi!\n\nDavom etasizmi?`)) return;

    setDeletingAllOrders(true);
    try {
      const res = await axiosInstance.delete("/orders/force");
      alert(res.data.message);
      getOrders();
    } catch (err) {
      alert("❌ Xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setDeletingAllOrders(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let image = form.image instanceof File
        ? form.image
        : (typeof form.image === "string" && form.image.trim()) || form.imageUrl?.trim() || "";

      if (typeof image === "string" && image) {
        const checked = normalizeImageUrl(image);
        if (checked.error) {
          alert("❌ " + checked.error);
          return;
        }
        image = checked.url;
      }

      // Gramm va porsiya "retsept" maydoniga yoziladi (backend o'zgarmaydi)
      const retsept = `${form.grams} gr • ${form.portion} porsiya`;

      let payload, config;
      if (image instanceof File) {
        payload = new FormData();
        payload.append("name", form.name);
        payload.append("price", form.price);
        payload.append("retsept", retsept);
        payload.append("category", form.category);
        payload.append("image", image);
        config = { headers: { "Content-Type": "multipart/form-data" } };
      } else {
        payload = { name: form.name, price: form.price, retsept, category: form.category, image };
        config = {};
      }

      if (editingId) {
        await axiosInstance.put(`/menus/${editingId}`, payload, config);
        setEditingId(null);
      } else {
        await axiosInstance.post("/menus", payload, config);
      }
      setForm(emptyForm);
      getMenus();
    } catch (err) {
      console.error(err);
      alert("❌ Saqlashda xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
      try { await axiosInstance.delete(`/menus/${id}`); getMenus(); }
      catch (err) { console.error(err); }
    }
  };

  // Tahrirlashda "retsept" ichidan gramm va porsiyani ajratib olamiz
  const handleEdit = (menu) => {
    const g = (menu.retsept || "").match(/(\d+)\s*gr/i);
    const p = (menu.retsept || "").match(/(\d+)\s*porsiya/i);
    setForm({ ...menu, grams: g ? g[1] : "", portion: p ? p[1] : "" });
    setEditingId(menu._id);
  };

  const handleTableSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/tables", tableForm);
      setTableForm({ number: "", capacity: "", location: "" });
      getTables();
    } catch (err) { alert(err.response?.data?.message || "Xatolik"); }
  };

  const handleTableDelete = async (id) => {
    if (window.confirm("Stolni o'chirasizmi?")) {
      try { await axiosInstance.delete(`/tables/${id}`); getTables(); }
      catch (err) { console.error(err); }
    }
  };

  const toggleTableAvailability = async (table) => {
    try {
      await axiosInstance.put(`/tables/${table._id}`, { isAvailable: !table.isAvailable });
      getTables();
    } catch (err) { console.error(err); }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/reservations/${id}`, { status });
      getReservations();
    } catch (err) { console.error(err); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/orders/${id}/status`, { status });
      getOrders();
    } catch (err) { console.error(err); }
  };

  const updateDeliveryStatus = async (id, deliveryStatus, courierName = '', courierPhone = '') => {
    try {
      await axiosInstance.patch(`/orders/${id}/delivery`, {
        deliveryStatus,
        courierName,
        courierPhone,
        deliveryTime: deliveryStatus === 'delivered' ? new Date().toLocaleString() : undefined
      });
      getOrders();
    } catch (err) {
      alert('Xatolik: ' + (err.response?.data?.message));
    }
  };

  const refreshAll = () => {
    getMenus();
    getTables();
    getReservations();
    getOrders();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshAll();
      }
    }, 5000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAll();
      }
    };
    const handleFocus = () => refreshAll();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // ✅ Chiqish – token va user ma'lumotlarini o'chiramiz
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  const statusColor = {
    pending: "text-[#FFE27A] border-[#FFD700]/60 bg-[#FFD700]/15",
    confirmed: "text-green-300 border-green-400/60 bg-green-500/15",
    cancelled: "text-red-300 border-red-400/60 bg-red-500/15",
    preparing: "text-blue-300 border-blue-400/60 bg-blue-500/15",
    ready: "text-cyan-300 border-cyan-400/60 bg-cyan-500/15",
  };

  const statusLabel = {
    pending: "⏳ Kutilmoqda",
    confirmed: "✅ Tasdiqlandi",
    cancelled: "❌ Bekor",
    preparing: "👨‍🍳 Tayyorlanmoqda",
    ready: "🎉 Tayyor",
  };

  const deliveryStatusLabels = {
    'pending': '⏳ Kutilmoqda',
    'preparing': '👨‍🍳 Tayyorlanmoqda',
    'on_the_way': '🚚 Yo\'lda',
    'delivered': '✅ Yetkazildi',
  };

  const diningAreaMap = {
    main_hall: "🏛 Asosiy zal",
    terrace: "🌿 Terassa",
    vip_room: "👑 VIP xona",
    garden: "🌳 Bog'",
  };

  const deliveryTypeMap = {
    "dine-in": "🍽 Restoran",
    "takeaway": "🥡 Olib ketish",
    "delivery": "🚚 Yetkazish",
  };

  const colorMap = {
    cyan: "text-cyan-300",
    blue: "text-blue-300",
    yellow: "text-[#FFD700]",
    purple: "text-purple-300",
    orange: "text-[#FF8A4D]",
  };

  const menuFieldLabel = {
    name: "Nomi",
    price: "Narxi (so'm)",
    grams: "Grami (gr)",
    portion: "Porsiyasi (soni)",
    category: "Kategoriya",
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            loading="lazy"
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1920&q=80&fm=webp"
            alt="Restaurant"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-xl font-bold">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white px-3 sm:px-6 lg:px-10 py-12">

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1920&q=80&fm=webp"
          alt="Restaurant background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/85" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-transparent to-[#B8860B]/10" />
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#FFD700]/15 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-[#B8860B]/20 blur-[200px] animate-pulse delay-700" />

        {[...Array(16)].map((_, i) => (
          <span key={`far-${i}`} className="ember-particle" style={{
            left: `${(i * 6.2 + 2) % 100}%`,
            "--size": `${2 + (i % 3)}px`,
            filter: "blur(0.5px)",
            opacity: 0.45,
            animationDuration: `${9 + (i % 6) * 1.4}s`,
            animationDelay: `${i * 0.6}s`,
            "--drift": `${((i % 5) - 2) * 30}px`,
          }} />
        ))}
        {[...Array(12)].map((_, i) => (
          <span key={`near-${i}`} className="ember-particle" style={{
            left: `${(i * 8.1 + 6) % 100}%`,
            "--size": `${4 + (i % 4)}px`,
            animationDuration: `${6 + (i % 4) * 1.2}s`,
            animationDelay: `${i * 0.5}s`,
            "--drift": `${((i % 3) - 1) * 55}px`,
          }} />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-10 sm:mb-12 border-b border-[#FFD700]/40 pb-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#FFD700]/50 bg-[#FFD700]/10 backdrop-blur-xl mb-3">
              <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700] animate-pulse"></div>
              <span className="text-[#FFE27A] uppercase tracking-[0.3em] text-[10px] font-black">Boshqaruv</span>
            </div>
            <h2 className={`font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight ${goldText} drop-shadow-[0_0_35px_rgba(255,215,0,0.35)]`}>Admin Panel</h2>
            <p className="text-gray-100 mt-2 text-sm tracking-widest font-medium">Restoran boshqaruv tizimi</p>
          </div>
          <button onClick={handleLogout} className="px-8 py-4 rounded-2xl border border-red-400/60 bg-black/60 text-red-300 font-bold transition-all hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]">🚪 Chiqish</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-10">
          {[
            { label: "Menyu", value: menus.length, color: "yellow" },
            { label: "Jami Stollar", value: tableStats.total, color: "blue" },
            { label: "Bronlar", value: reservations.filter(r => r.status === "pending").length, color: "yellow", suffix: " yangi" },
            { label: "Zakazlar", value: orders.filter(o => o.status === "pending").length, color: "purple", suffix: " yangi" },
            { label: "Yo'lda", value: orders.filter(o => o.deliveryStatus === "on_the_way").length, color: "orange", suffix: " ta" },
          ].map((s, i) => (
            <div key={i} className="card-luxe p-5 text-center hover:scale-[1.03] transition-transform">
              <p className={`font-display text-3xl sm:text-4xl font-extrabold ${colorMap[s.color]}`}>{s.value}{s.suffix || ""}</p>
              <p className="text-[#F5E6B8] text-xs uppercase tracking-widest mt-1 font-extrabold">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-10 flex-wrap">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${activeTab === tab ? `${goldGrad} text-black shadow-[0_0_40px_rgba(255,215,0,0.55)] animate-glowPulse` : "border border-[#FFD700]/40 bg-black/60 text-[#F5E6B8] hover:border-[#FFD700] hover:text-[#FFD700]"}`}>{tab}</button>
          ))}
        </div>

        {activeTab === "Menu" && (
          <div>
            <form onSubmit={handleSubmit} className="card-luxe p-6 sm:p-10 mb-12">
              <h3 className={`font-display font-extrabold text-2xl sm:text-3xl mb-8 ${goldText}`}>{editingId ? "📝 Tahrirlash" : "➕ Yangi Taom"}</h3>

              <div className="mb-5">
                <label className={labelCls}>Rasm</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0], imageUrl: "" })} className="text-gray-100 text-sm flex-1" />
                  <div className="flex items-center gap-2 flex-1">
                    <input type="text" value={form.imageUrl || ""} placeholder="Yoki rasm URL manzilini joylashtiring..." onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className={`flex-1 ${inputSmCls} !px-3`} />
                    <button type="button" onClick={() => { if (!form.imageUrl?.trim()) return; const checked = normalizeImageUrl(form.imageUrl); if (checked.error) { alert("❌ " + checked.error); return; } setForm({ ...form, image: checked.url, imageUrl: checked.url }); }} className="px-4 py-3 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/60 text-[#FFD700] text-sm font-extrabold hover:bg-[#FFD700] hover:text-black transition-all whitespace-nowrap">Biriktirish</button>
                  </div>
                </div>

                {(form.image || form.imageUrl?.trim()) && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      loading="lazy"
                      src={form.image instanceof File ? URL.createObjectURL(form.image) : getImageUrl(typeof form.image === "string" && form.image.trim() ? form.image : form.imageUrl?.trim())}
                      alt="preview"
                      className="w-24 h-24 object-cover rounded-xl border-2 border-[#FFD700]/60"
                      onError={(e) => { e.target.src = NO_IMAGE_URL; }}
                    />
                    <span className="text-green-300 text-xs font-bold">✅ Rasm tanlandi</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {["name", "price", "grams", "portion", "category"].map((key) => (
                  <div key={key}>
                    <label className={labelCls}>{menuFieldLabel[key]}</label>
                    <input
                      value={typeof form[key] === "string" || typeof form[key] === "number" ? form[key] : ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      type={["price", "grams", "portion"].includes(key) ? "number" : "text"}
                      min={["price", "grams", "portion"].includes(key) ? "0" : undefined}
                      placeholder={key === "grams" ? "300" : key === "portion" ? "1" : undefined}
                      required
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button type="submit" className={`px-10 py-4 rounded-2xl ${goldGrad} text-black font-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-all`}>{editingId ? "Yangilash" : "Saqlash"}</button>
                {editingId && (<button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-10 py-4 rounded-2xl border border-[#FFD700]/50 text-[#F5E6B8] font-bold hover:bg-[#FFD700]/15 transition-all">Bekor</button>)}
              </div>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {menus.map((menu) => (
                <div key={menu._id} className="card-luxe group overflow-hidden hover:scale-[1.015] transition-transform">
                  <div className="relative h-36 sm:h-56 overflow-hidden">
                    <img
                      loading="lazy"
                      src={getImageUrl(menu.image)}
                      alt={menu.name}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = NO_IMAGE_URL; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    {menu.category && (
                      <span className="absolute top-3 right-3 bg-black/80 border border-[#FFD700]/60 px-3 py-1 rounded-xl text-[#FFD700] text-[10px] uppercase tracking-widest font-extrabold backdrop-blur-xl">
                        {menu.category}
                      </span>
                    )}
                    <span className={`absolute bottom-2 left-2 px-2.5 py-1 rounded-lg ${goldGrad} text-black text-xs sm:text-sm font-black shadow-[0_0_12px_rgba(255,215,0,0.6)]`}>
                      {Number(menu.price).toLocaleString()} so'm
                    </span>
                  </div>
                  <div className="p-3 sm:p-5">
                    <h3 className="font-display font-extrabold text-lg sm:text-2xl text-[#FFE27A] group-hover:text-white transition-colors line-clamp-1">
                      {menu.name}
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm mt-1 line-clamp-2 font-medium">{menu.retsept}</p>
                    <div className="flex gap-2 sm:gap-3 mt-4">
                      <button onClick={() => handleEdit(menu)} className="flex-1 py-2.5 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/60 text-[#FFD700] text-xs sm:text-sm font-extrabold hover:bg-[#FFD700] hover:text-black transition-all">Tahrirlash</button>
                      <button onClick={() => handleDelete(menu._id)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-400/60 text-red-300 text-xs sm:text-sm font-extrabold hover:bg-red-500 hover:text-white transition-all">O'chirish</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Stollar" && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: "Jami", value: tableStats.total, color: "text-white" },
                { label: "Bo'sh", value: tableStats.available, color: "text-green-400" },
                { label: "Band", value: tableStats.booked, color: "text-red-400" },
              ].map((s, i) => (
                <div key={i} className="card-luxe p-5 text-center hover:scale-[1.03] transition-transform">
                  <p className={`font-display text-4xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[#F5E6B8] text-xs uppercase tracking-widest mt-2 font-extrabold">{s.label}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleTableSubmit} className="card-luxe p-6 mb-10">
              <h3 className={`font-display font-extrabold text-2xl mb-6 ${goldText}`}>➕ Yangi Stol</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className={labelCls}>Stol raqami</label><input value={tableForm.number} onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })} type="number" required placeholder="1" className={inputSmCls} /></div>
                <div><label className={labelCls}>Sig'im (kishi)</label><input value={tableForm.capacity} onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })} type="number" required placeholder="4" className={inputSmCls} /></div>
                <div><label className={labelCls}>Joylashuv</label><input value={tableForm.location} onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })} placeholder="Ichki zal" className={inputSmCls} /></div>
              </div>
              <button type="submit" className={`mt-6 px-10 py-3.5 rounded-2xl ${goldGrad} text-black font-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all`}>Stol Qo'shish</button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div key={table._id} className={`relative rounded-2xl border-2 p-5 transition-all ${table.isAvailable ? "border-green-400/50 bg-green-500/10" : "border-red-400/50 bg-red-500/10"}`}>
                  <div className="flex justify-between items-start">
                    <div><p className="font-display text-3xl font-extrabold text-[#FFD700]">#{table.number}</p><p className="text-white text-sm font-semibold mt-1">{table.capacity} kishi</p>{table.location && <p className="text-[#F5E6B8] text-xs font-medium">{table.location}</p>}</div>
                    <span className={`w-3.5 h-3.5 rounded-full mt-1 ${table.isAvailable ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" : "bg-red-500 shadow-[0_0_12px_rgba(248,113,113,0.8)]"}`} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => toggleTableAvailability(table)} className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold border transition-all ${table.isAvailable ? "border-red-400/60 text-red-300 hover:bg-red-500 hover:text-white" : "border-green-400/60 text-green-300 hover:bg-green-500 hover:text-black"}`}>{table.isAvailable ? "Band qilish" : "Bo'shatish"}</button>
                    <button onClick={() => handleTableDelete(table._id)} className="px-3 py-2.5 rounded-xl border border-red-400/50 text-red-300 text-xs hover:bg-red-500 hover:text-white transition-all">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Bronlar" && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <h3 className={`font-display font-extrabold text-2xl ${goldText}`}>📋 Bronlar</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleDeleteCompletedReservations} disabled={deletingCompleted} className="px-5 py-2.5 rounded-xl bg-[#FF5A1F]/20 border border-[#FF8A4D]/60 text-[#FF9A63] text-sm font-extrabold hover:bg-[#FF5A1F] hover:text-white transition-all disabled:opacity-50">{deletingCompleted ? "⏳..." : "🗑 Yakunlanganlarni o'chirish"}</button>
                <button onClick={handleDeleteAllReservations} disabled={deletingAllReservations} className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-400/60 text-red-300 text-sm font-extrabold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">{deletingAllReservations ? "⏳..." : "🔥 Barchasini o'chirish"}</button>
              </div>
            </div>

            <div className="space-y-4">
              {reservations.length === 0 ? (
                <p className="text-gray-100 text-center py-20 text-xl font-medium">Hali bron yo'q</p>
              ) : (
                reservations.map((r) => (
                  <div key={r._id} className="card-luxe p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-display font-extrabold text-2xl text-[#FFE27A]">{r.customerName}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border font-bold ${statusColor[r.status]}`}>{statusLabel[r.status]}</span>
                        </div>
                        <p className="text-white/90 text-sm font-medium">📞 {r.phone}</p>
                        <p className="text-white/90 text-sm font-medium">🪑 Stol #{r.tableId?.number} &nbsp;|&nbsp; 👥 {r.guestCount} kishi</p>
                        <p className="text-white/90 text-sm font-medium">📆 {r.date} &nbsp;⏰ {r.time}</p>
                        {r.diningArea && <p className="text-[#FFD700] text-sm font-semibold">📍 {diningAreaMap[r.diningArea] || r.diningArea}</p>}
                        {r.note && <p className="text-gray-200 text-xs">📝 {r.note}</p>}
                      </div>
                      {r.status === "pending" && (
                        <div className="flex gap-2 items-start">
                          <button onClick={() => updateReservationStatus(r._id, "confirmed")} className="px-6 py-2.5 rounded-xl bg-green-500/20 border border-green-400/60 text-green-300 text-sm font-extrabold hover:bg-green-500 hover:text-black transition-all">✅ Tasdiqlash</button>
                          <button onClick={() => updateReservationStatus(r._id, "cancelled")} className="px-6 py-2.5 rounded-xl bg-red-500/20 border border-red-400/60 text-red-300 text-sm font-extrabold hover:bg-red-500 hover:text-white transition-all">❌ Bekor</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "Zakazlar" && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <h3 className={`font-display font-extrabold text-2xl ${goldText}`}>📦 Zakazlar</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleDeleteCompletedOrders} disabled={deletingCompletedOrders} className="px-5 py-2.5 rounded-xl bg-[#FF5A1F]/20 border border-[#FF8A4D]/60 text-[#FF9A63] text-sm font-extrabold hover:bg-[#FF5A1F] hover:text-white transition-all disabled:opacity-50">{deletingCompletedOrders ? "⏳..." : "🗑 Yakunlanganlarni o'chirish"}</button>
                <button onClick={handleDeleteAllOrders} disabled={deletingAllOrders} className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-400/60 text-red-300 text-sm font-extrabold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">{deletingAllOrders ? "⏳..." : "🔥 Barchasini o'chirish"}</button>
              </div>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-100 text-center py-20 text-xl font-medium">Hali zakaz yo'q</p>
              ) : (
                orders.map((o) => (
                  <div key={o._id} className="card-luxe p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-display font-extrabold text-2xl text-[#FFE27A]">{o.customerName}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border font-bold ${statusColor[o.status]}`}>{statusLabel[o.status]}</span>
                          <span className="text-xs px-3 py-1 rounded-full border border-[#FFD700]/50 text-[#FFE27A] bg-[#FFD700]/10 font-bold">{deliveryTypeMap[o.deliveryType] || o.deliveryType}</span>
                          {o.deliveryStatus && o.deliveryStatus !== 'pending' && (<span className="text-xs px-3 py-1 rounded-full border border-[#FFD700]/60 text-[#FFE27A] bg-[#FFD700]/15 font-bold">{deliveryStatusLabels[o.deliveryStatus] || o.deliveryStatus}</span>)}
                        </div>
                        <p className="text-white/90 text-sm font-medium">📞 {o.phone}</p>
                        {o.deliveryType === "dine-in" && o.tableNumber && (
                          <p className="text-[#FFD700] text-sm font-semibold">🪑 Stol #{o.tableNumber} {o.tableLocation ? `📍 ${o.tableLocation}` : ''}</p>
                        )}
                        {o.deliveryType === "delivery" && o.address && <p className="text-white/90 text-sm font-medium">📍 {o.address}</p>}
                        {o.deliveryType === "takeaway" && <p className="text-white/90 text-sm font-medium">🥡 Olib ketish</p>}
                        <div className="mt-2 space-y-1">
                          {o.items?.map((item, idx) => (<p key={idx} className="text-white text-sm font-medium">• {item.name} x{item.quantity} — {(item.price * item.quantity).toLocaleString()} so'm</p>))}
                        </div>
                        <p className="text-[#FFD700] font-black mt-2">💰 Jami: {o.totalPrice?.toLocaleString()} so'm</p>
                        {o.note && <p className="text-gray-200 text-xs">📝 {o.note}</p>}
                        {o.courierName && <p className="text-green-300 text-xs font-bold">👤 Kuryer: {o.courierName}</p>}
                      </div>

                      <div className="flex flex-col gap-2 items-start">
                        {o.status === "pending" && (
                          <button onClick={() => updateOrderStatus(o._id, "confirmed")} className="px-6 py-2.5 rounded-xl bg-green-500/20 border border-green-400/60 text-green-300 text-sm font-extrabold hover:bg-green-500 hover:text-black transition-all whitespace-nowrap">✅ Qabul</button>
                        )}
                        {o.status === "confirmed" && (
                          <button onClick={() => updateOrderStatus(o._id, "preparing")} className="px-6 py-2.5 rounded-xl bg-blue-500/20 border border-blue-400/60 text-blue-300 text-sm font-extrabold hover:bg-blue-500 hover:text-white transition-all whitespace-nowrap">👨‍🍳 Tayyorlanmoqda</button>
                        )}
                        {o.status === "preparing" && (
                          <button onClick={() => updateOrderStatus(o._id, "ready")} className="px-6 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 text-sm font-extrabold hover:bg-cyan-400 hover:text-black transition-all whitespace-nowrap">🎉 Tayyor</button>
                        )}
                        {o.status === "ready" && o.deliveryType === "delivery" && o.deliveryStatus === "pending" && (
                          <button onClick={() => { const courierName = prompt("Kuryer ismi:"); const courierPhone = prompt("Kuryer telefon raqami:"); if (courierName) updateDeliveryStatus(o._id, "on_the_way", courierName, courierPhone); }} className="px-6 py-2.5 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/60 text-[#FFD700] text-sm font-extrabold hover:bg-[#FFD700] hover:text-black transition-all whitespace-nowrap">🚚 Yo'lga chiqarish</button>
                        )}
                        {o.deliveryStatus === "on_the_way" && (
                          <button onClick={() => updateDeliveryStatus(o._id, "delivered")} className="px-6 py-2.5 rounded-xl bg-green-500/20 border border-green-400/60 text-green-300 text-sm font-extrabold hover:bg-green-500 hover:text-black transition-all whitespace-nowrap">✅ Yetkazildi</button>
                        )}
                        {o.status !== "cancelled" && o.status !== "ready" && (
                          <button onClick={() => updateOrderStatus(o._id, "cancelled")} className="px-6 py-2.5 rounded-xl bg-red-500/20 border border-red-400/60 text-red-300 text-sm font-extrabold hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">❌ Bekor</button>
                        )}

                        {o.status === "ready" && (
                          <button
                            onClick={() => handlePrintReceipt(o._id)}
                            className="px-6 py-2.5 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/60 text-[#FFD700] text-sm font-extrabold hover:bg-[#FFD700] hover:text-black transition-all whitespace-nowrap flex items-center gap-2 animate-pulse"
                          >
                            🧾 Chek chiqarish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "Hisobotlar" && <Reports />}
      </div>

      <style>{`
        .ember-particle {
          position: fixed;
          bottom: -10px;
          width: var(--size, 3px);
          height: var(--size, 3px);
          background: radial-gradient(circle, #FFF3B0, #FFD700);
          border-radius: 50%;
          pointer-events: none;
          animation: floatUp linear infinite;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
          z-index: 1;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-110vh) translateX(var(--drift, 0px)) scale(0.3); opacity: 0; }
        }
        .card-luxe {
          background: linear-gradient(180deg, #1c1503, #000);
          border: 1px solid rgba(255, 215, 0, 0.4);
          border-radius: 24px;
          box-shadow: 0 0 22px rgba(255, 215, 0, 0.12);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-luxe:hover {
          border-color: rgba(255, 215, 0, 0.8);
          box-shadow: 0 0 36px rgba(255, 215, 0, 0.3);
        }
        .menu-leader {
          display: flex;
          align-items: baseline;
          gap: 8px;
          position: relative;
        }
        .leader-fill {
          flex: 1;
          min-width: 12px;
          border-bottom: 2px dotted rgba(255, 215, 0, 0.4);
          height: 0;
          margin: 0 4px;
        }
        .text-gold-gradient {
          background: linear-gradient(135deg, #FFF3B0, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .animate-glowPulse {
          animation: glowPulse 2s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }
        .divider-ikat {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
        }
        .divider-ikat::before,
        .divider-ikat::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
        }
        .ikat-node {
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #FFF3B0, #FFD700);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default Admin;
