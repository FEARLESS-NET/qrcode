import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";
import Reports from "../components/Reports.jsx";

const TABS = ["Menu", "Stollar", "Bronlar", "Zakazlar", "Hisobotlar"];
// ✅ TUZATILDI
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'https://backend-4-9otm.onrender.com';

// ✅ YANGI: via.placeholder.com o'chib qolgani uchun olib tashlandi.
// Bu — brauzer ichida chiziladigan SVG rasm, hech qanday tashqi so'rov yubormaydi,
// hech qachon "ishlamay qolmaydi", va hattoki internet uzilsa ham ko'rinaveradi.
const NO_IMAGE_URL = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' fill='%23888' font-family='sans-serif' font-size='20' text-anchor='middle' dominant-baseline='middle'%3ERasm yo'q%3C/text%3E%3C/svg%3E";

// ✅ TUZATILDI: Rasm URL + WebP QO'SHILDI
const getImageUrl = (imagePath) => {
  if (!imagePath) return NO_IMAGE_URL;
  if (imagePath.startsWith("http")) {
    // ✅ TUZATILDI: fm=webp faqat Unsplash havolalariga qo'shiladi (boshqa
    // saytlardan qo'yilgan silkalar bu parametrni tushunmasligi mumkin edi)
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

// Google qidiruv/redirect havolalari rasm emas, veb-sahifa — <img> ularni ko'rsata olmaydi.
// google imgres havolasidan haqiqiy rasm (imgurl parametri) ajratib olinadi, qolganlari rad etiladi.
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
  } catch { /* to'liq URL bo'lmasa — tegmaymiz */ }
  return { url };
};

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Menu");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth || auth !== "true") {
      navigate("/login", { replace: true });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  // MENU
  const [menus, setMenus] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", retsept: "", image: "", category: "" });

  const getMenus = async () => {
    try {
      const res = await axiosInstance.get("/menus");
      setMenus(res.data.menus || []);
    } catch (err) { console.error(err); }
  };

  // STOLLAR
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

  // BRONLAR
  const [reservations, setReservations] = useState([]);
  const [deletingCompleted, setDeletingCompleted] = useState(false);
  const [deletingAllReservations, setDeletingAllReservations] = useState(false);

  const getReservations = async () => {
    try {
      const res = await axiosInstance.get("/reservations");
      setReservations(res.data.reservations || []);
    } catch (err) { console.error(err); }
  };

  // ZAKAZLAR
  const [orders, setOrders] = useState([]);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [deletingCompletedOrders, setDeletingCompletedOrders] = useState(false);
  const [deletingAllOrders, setDeletingAllOrders] = useState(false);

  const getOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) { console.error(err); }
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

  useEffect(() => {
    getMenus();
    getTables();
    getReservations();
    getOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && document.hasFocus()) {
        getReservations();
        getOrders();
        getTables();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // URL yozilib, "Biriktirish" bosilmagan bo'lsa ham URL ishlatiladi
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

      let payload, config;
      if (image instanceof File) {
        // Fayl yuklash — backendda multer buni qabul qiladi
        payload = new FormData();
        payload.append("name", form.name);
        payload.append("price", form.price);
        payload.append("retsept", form.retsept);
        payload.append("category", form.category);
        payload.append("image", image);
        config = { headers: { "Content-Type": "multipart/form-data" } };
      } else {
        // URL yoki rasmsiz — oddiy JSON (express.json() buni to'g'ri o'qiydi)
        payload = { name: form.name, price: form.price, retsept: form.retsept, category: form.category, image };
        config = {};
      }

      if (editingId) {
        await axiosInstance.put(`/menus/${editingId}`, payload, config);
        setEditingId(null);
      } else {
        await axiosInstance.post("/menus", payload, config);
      }
      setForm({ name: "", price: "", retsept: "", image: "", category: "" });
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

  const handleEdit = (menu) => { setForm(menu); setEditingId(menu._id); };

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
      setEditingDelivery(null);
    } catch (err) { 
      alert('Xatolik: ' + (err.response?.data?.message)); 
    }
  };

  const statusColor = {
    pending: "text-[#FFDD73] border-[#FFC93C]/30 bg-[#FFC93C]/10",
    confirmed: "text-green-400 border-green-500/30 bg-green-500/10",
    cancelled: "text-red-400 border-red-500/30 bg-red-500/10",
    preparing: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    ready: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
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
    cyan: "text-cyan-400",
    blue: "text-blue-400",
    yellow: "text-[#FFDD73]",
    purple: "text-purple-400",
    orange: "text-[#FF7A3D]",
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#130e0a] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            loading="lazy"
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80&fm=webp" 
            alt="Restaurant" 
            className="w-full h-full object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 border-4 border-[#FFC93C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFDD73] text-xl font-bold">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#130e0a] text-white px-4 sm:px-6 lg:px-10 py-12">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          loading="lazy"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80&fm=webp" 
          alt="Restaurant background" 
          className="w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-[#130e0a]/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC93C]/5 via-transparent to-[#E08A3C]/5" />
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#E08A3C]/10 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-[#FFDD73]/10 blur-[200px] animate-pulse delay-700" />
        {/* Signature: embers drifting up, as if rising off a qozon — layered for depth */}
        {[...Array(16)].map((_, i) => (
          <span
            key={`far-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 6.2 + 2) % 100}%`,
              "--size": `${2 + (i % 3)}px`,
              filter: "blur(0.5px)",
              opacity: 0.45,
              animationDuration: `${9 + (i % 6) * 1.4}s`,
              animationDelay: `${i * 0.6}s`,
              "--drift": `${((i % 5) - 2) * 30}px`,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <span
            key={`near-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 8.1 + 6) % 100}%`,
              "--size": `${4 + (i % 4)}px`,
              animationDuration: `${6 + (i % 4) * 1.2}s`,
              animationDelay: `${i * 0.5}s`,
              "--drift": `${((i % 3) - 1) * 55}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-12 border-b border-[#FFC93C]/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#FFC93C]/20 bg-[#FFC93C]/10 backdrop-blur-xl mb-3">
              <div className="w-2 h-2 rounded-full bg-[#FFDD73] animate-pulse"></div>
              <span className="text-[#FFDD73] uppercase tracking-[0.3em] text-[10px] font-black">Boshqaruv</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl font-bold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB0] via-[#FFA23D] to-[#FF5A1F]">Admin Panel</h2>
            <p className="text-gray-500 mt-2 text-sm tracking-widest">Restoran boshqaruv tizimi</p>
          </div>
          <button onClick={handleLogout} className="px-8 py-4 rounded-2xl border border-red-500/40 text-red-400 font-bold transition-all hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">🚪 Chiqish</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Menyu", value: menus.length, color: "yellow" },
            { label: "Jami Stollar", value: tableStats.total, color: "blue" },
            { label: "Bronlar", value: reservations.filter(r => r.status === "pending").length, color: "yellow", suffix: " yangi" },
            { label: "Zakazlar", value: orders.filter(o => o.status === "pending").length, color: "purple", suffix: " yangi" },
            { label: "Yo'lda", value: orders.filter(o => o.deliveryStatus === "on_the_way").length, color: "orange", suffix: " ta" },
          ].map((s, i) => (
            <div key={i} className="card-luxe p-5 text-center hover:scale-[1.03] transition-transform">
              <p className={`font-display text-4xl font-bold ${colorMap[s.color]}`}>{s.value}{s.suffix || ""}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest mt-1 font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-10 flex-wrap">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all ${activeTab === tab ? "bg-gradient-to-r from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F] text-black shadow-[0_0_40px_rgba(255,180,40,0.4)] animate-glowPulse" : "border border-white/10 bg-white/[0.03] text-gray-400 hover:border-[#FFC93C]/30 hover:text-white"}`}>{tab}</button>
          ))}
        </div>

        {activeTab === "Menu" && (
          <div>
            <form onSubmit={handleSubmit} className="card-luxe p-8 sm:p-10 mb-12">
              <h3 className="font-display text-[#FFDD73] font-bold text-3xl mb-8">{editingId ? "📝 Tahrirlash" : "➕ Yangi Taom"}</h3>

              <div className="mb-5">
                <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-2 font-bold">Rasm</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0], imageUrl: "" })} className="text-gray-400 text-sm flex-1" />
                  <div className="flex items-center gap-2 flex-1">
                    <input type="text" value={form.imageUrl || ""} placeholder="Yoki rasm URL manzilini joylashtiring..." onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-2 py-3 outline-none text-white text-sm placeholder:text-gray-700 focus:border-[#FFDD73] focus:shadow-[0_0_20px_rgba(255,180,40,0.05)] transition-all" />
                    <button type="button" onClick={() => { if (!form.imageUrl?.trim()) return; const checked = normalizeImageUrl(form.imageUrl); if (checked.error) { alert("❌ " + checked.error); return; } setForm({ ...form, image: checked.url, imageUrl: checked.url }); }} className="px-3 py-3 rounded-xl bg-[#FFC93C]/15 border border-[#FFC93C]/30 text-[#FFDD73] text-sm font-bold hover:bg-[#FFDD73] hover:text-black transition-all whitespace-nowrap">Biriktirish</button>
                  </div>
                </div>

                {(form.image || form.imageUrl?.trim()) && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      loading="lazy"
                      src={form.image instanceof File ? URL.createObjectURL(form.image) : getImageUrl(typeof form.image === "string" && form.image.trim() ? form.image : form.imageUrl?.trim())}
                      alt="preview"
                      className="w-24 h-24 object-cover rounded-xl border border-[#FFC93C]/20"
                      onError={(e) => { e.target.src = NO_IMAGE_URL; }}
                    />
                    <span className="text-green-400 text-xs font-bold">✅ Rasm tanlandi</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {["name", "price", "retsept", "category"].map((key) => (
                  <div key={key}>
                    <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-2 font-bold">{key === "name" ? "Nomi" : key === "price" ? "Narxi (so'm)" : key === "retsept" ? "Retsept" : "Kategoriya"}</label>
                    <input value={typeof form[key] === "string" ? form[key] : ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} type={key === "price" ? "number" : "text"} min={key === "price" ? "0" : undefined} required className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white focus:border-[#FFDD73] focus:shadow-[0_0_25px_rgba(255,180,40,0.05)] transition-all" />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button type="submit" className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F] text-black font-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,180,40,0.3)] transition-all">{editingId ? "Yangilash" : "Saqlash"}</button>
                {editingId && (<button type="button" onClick={() => { setEditingId(null); setForm({ name: "", price: "", retsept: "", image: "", category: "" }); }} className="px-10 py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">Bekor</button>)}
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div key={menu._id} className="card-luxe group overflow-hidden hover:scale-[1.015] transition-transform">
                  <div className="h-52 overflow-hidden">
                    <img
                      loading="lazy"
                      src={getImageUrl(menu.image)}
                      alt={menu.name}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                      onError={(e) => {
                        console.log("❌ Rasm yuklanmadi:", e.target.src);
                        e.target.src = NO_IMAGE_URL;
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between"><h3 className="font-display font-bold text-2xl">{menu.name}</h3><span className="text-[#FFDD73] font-bold">{Number(menu.price).toLocaleString()} so'm</span></div>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{menu.retsept}</p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleEdit(menu)} className="flex-1 py-2.5 rounded-xl bg-[#FFC93C]/15 border border-[#FFC93C]/30 text-[#FFDD73] text-sm font-bold hover:bg-[#FFDD73] hover:text-black transition-all">Tahrirlash</button>
                      <button onClick={() => handleDelete(menu._id)} className="flex-1 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">O'chirish</button>
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
                  <p className={`font-display text-4xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mt-2 font-bold">{s.label}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleTableSubmit} className="card-luxe p-6 mb-10">
              <h3 className="font-display text-[#FFDD73] font-bold text-2xl mb-6">➕ Yangi Stol</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-2 font-bold">Stol raqami</label><input value={tableForm.number} onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })} type="number" required placeholder="1" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-[#FFDD73] transition-all" /></div>
                <div><label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-2 font-bold">Sig'im (kishi)</label><input value={tableForm.capacity} onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })} type="number" required placeholder="4" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-[#FFDD73] transition-all" /></div>
                <div><label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-2 font-bold">Joylashuv</label><input value={tableForm.location} onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })} placeholder="Ichki zal" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-[#FFDD73] transition-all" /></div>
              </div>
              <button type="submit" className="mt-6 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F] text-black font-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,180,40,0.2)] transition-all">Stol Qo'shish</button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div key={table._id} className={`relative rounded-2xl border p-5 transition-all ${table.isAvailable ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                  <div className="flex justify-between items-start">
                    <div><p className="font-display text-3xl font-bold text-[#FFDD73]">#{table.number}</p><p className="text-gray-400 text-sm mt-1">{table.capacity} kishi</p>{table.location && <p className="text-gray-500 text-xs">{table.location}</p>}</div>
                    <span className={`w-3 h-3 rounded-full mt-1 ${table.isAvailable ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]" : "bg-red-500 shadow-[0_0_10px_rgba(248,113,113,0.3)]"}`} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => toggleTableAvailability(table)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${table.isAvailable ? "border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white" : "border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black"}`}>{table.isAvailable ? "Band qilish" : "Bo'shatish"}</button>
                    <button onClick={() => handleTableDelete(table._id)} className="px-3 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-xs hover:bg-red-500 hover:text-white transition-all">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Bronlar" && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <h3 className="font-display text-[#FFDD73] font-bold text-2xl">📋 Bronlar</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleDeleteCompletedReservations} disabled={deletingCompleted} className="px-5 py-2.5 rounded-xl bg-[#FF5A1F]/20 border border-[#FF5A1F]/40 text-[#FF7A3D] text-sm font-bold hover:bg-[#FF5A1F] hover:text-white transition-all disabled:opacity-50">{deletingCompleted ? "⏳..." : "🗑 Yakunlanganlarni o'chirish"}</button>
                <button onClick={handleDeleteAllReservations} disabled={deletingAllReservations} className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">{deletingAllReservations ? "⏳..." : "🔥 Barchasini o'chirish"}</button>
              </div>
            </div>

            <div className="space-y-4">
              {reservations.length === 0 ? (
                <p className="text-gray-500 text-center py-20 text-xl">Hali bron yo'q</p>
              ) : (
                reservations.map((r) => (
                  <div key={r._id} className="card-luxe p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-display font-bold text-2xl">{r.customerName}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border font-bold ${statusColor[r.status]}`}>{statusLabel[r.status]}</span>
                        </div>
                        <p className="text-gray-400 text-sm">📞 {r.phone}</p>
                        <p className="text-gray-400 text-sm">🪑 Stol #{r.tableId?.number} &nbsp;|&nbsp; 👥 {r.guestCount} kishi</p>
                        <p className="text-gray-400 text-sm">📆 {r.date} &nbsp;⏰ {r.time}</p>
                        {r.diningArea && <p className="text-[#FFDD73] text-sm">📍 {diningAreaMap[r.diningArea] || r.diningArea}</p>}
                        {r.note && <p className="text-gray-500 text-xs">📝 {r.note}</p>}
                      </div>
                      {r.status === "pending" && (
                        <div className="flex gap-2 items-start">
                          <button onClick={() => updateReservationStatus(r._id, "confirmed")} className="px-6 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-bold hover:bg-green-500 hover:text-black transition-all">✅ Tasdiqlash</button>
                          <button onClick={() => updateReservationStatus(r._id, "cancelled")} className="px-6 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">❌ Bekor</button>
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
              <h3 className="font-display text-[#FFDD73] font-bold text-2xl">📦 Zakazlar</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleDeleteCompletedOrders} disabled={deletingCompletedOrders} className="px-5 py-2.5 rounded-xl bg-[#FF5A1F]/20 border border-[#FF5A1F]/40 text-[#FF7A3D] text-sm font-bold hover:bg-[#FF5A1F] hover:text-white transition-all disabled:opacity-50">{deletingCompletedOrders ? "⏳..." : "🗑 Yakunlanganlarni o'chirish"}</button>
                <button onClick={handleDeleteAllOrders} disabled={deletingAllOrders} className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">{deletingAllOrders ? "⏳..." : "🔥 Barchasini o'chirish"}</button>
              </div>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-20 text-xl">Hali zakaz yo'q</p>
              ) : (
                orders.map((o) => (
                  <div key={o._id} className="card-luxe p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-display font-bold text-2xl">{o.customerName}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border font-bold ${statusColor[o.status]}`}>{statusLabel[o.status]}</span>
                          <span className="text-xs px-3 py-1 rounded-full border border-[#FFC93C]/20 text-[#FFDD73] bg-[#FFC93C]/10 font-bold">{deliveryTypeMap[o.deliveryType] || o.deliveryType}</span>
                          {o.deliveryStatus && o.deliveryStatus !== 'pending' && (<span className="text-xs px-3 py-1 rounded-full border border-[#FFC93C]/30 text-[#FFDD73] bg-[#FFC93C]/10 font-bold">{deliveryStatusLabels[o.deliveryStatus] || o.deliveryStatus}</span>)}
                        </div>
                        <p className="text-gray-400 text-sm">📞 {o.phone}</p>
                        {o.deliveryType === "dine-in" && o.tableNumber && (
                          <p className="text-[#FFDD73] text-sm">
                            🪑 Stol #{o.tableNumber} {o.tableLocation ? `📍 ${o.tableLocation}` : ''}
                          </p>
                        )}
                        {o.deliveryType === "delivery" && o.address && <p className="text-gray-400 text-sm">📍 {o.address}</p>}
                        {o.deliveryType === "delivery" && o.location?.coordinates?.length === 2 && !(o.location.coordinates[0] === 0 && o.location.coordinates[1] === 0) && (
                          <a href={`https://www.google.com/maps?q=${o.location.coordinates[1]},${o.location.coordinates[0]}`} target="_blank" rel="noopener noreferrer" className="inline-block text-[#FFDD73] text-xs underline hover:text-[#FFEBB0]">🗺 Xaritada ko'rish</a>
                        )}
                        {o.deliveryType === "takeaway" && <p className="text-gray-400 text-sm">🥡 Olib ketish</p>}
                        <div className="mt-2 space-y-1">
                          {o.items?.map((item, idx) => (<p key={idx} className="text-gray-300 text-sm">• {item.name} x{item.quantity} — {(item.price * item.quantity).toLocaleString()} so'm</p>))}
                        </div>
                        <p className="text-[#FFDD73] font-black mt-2">💰 Jami: {o.totalPrice?.toLocaleString()} so'm</p>
                        {o.note && <p className="text-gray-500 text-xs">📝 {o.note}</p>}
                        {o.courierName && <p className="text-green-400 text-xs font-bold">👤 Kuryer: {o.courierName}</p>}
                      </div>
                      <div className="flex flex-col gap-2 items-start">
                        {o.status === "pending" && (<button onClick={() => updateOrderStatus(o._id, "confirmed")} className="px-6 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-bold hover:bg-green-500 hover:text-black transition-all whitespace-nowrap">✅ Qabul</button>)}
                        {o.status === "confirmed" && (<button onClick={() => updateOrderStatus(o._id, "preparing")} className="px-6 py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all whitespace-nowrap">👨‍🍳 Tayyorlanmoqda</button>)}
                        {o.status === "preparing" && (<button onClick={() => updateOrderStatus(o._id, "ready")} className="px-6 py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-sm font-bold hover:bg-cyan-400 hover:text-black transition-all whitespace-nowrap">🎉 Tayyor</button>)}
                        {o.status === "ready" && o.deliveryType === "delivery" && o.deliveryStatus === "pending" && (
                          <button onClick={() => { const courierName = prompt("Kuryer ismi:"); const courierPhone = prompt("Kuryer telefon raqami:"); if (courierName) updateDeliveryStatus(o._id, "on_the_way", courierName, courierPhone); }} className="px-6 py-2.5 rounded-xl bg-[#FFC93C]/15 border border-[#FFC93C]/30 text-[#FFDD73] text-sm font-bold hover:bg-[#FFC93C] hover:text-black transition-all whitespace-nowrap">🚚 Yo'lga chiqarish</button>
                        )}
                        {o.deliveryStatus === "on_the_way" && (<button onClick={() => updateDeliveryStatus(o._id, "delivered")} className="px-6 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-bold hover:bg-green-500 hover:text-black transition-all whitespace-nowrap">✅ Yetkazildi</button>)}
                        {o.status !== "cancelled" && o.status !== "ready" && (<button onClick={() => updateOrderStatus(o._id, "cancelled")} className="px-6 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">❌ Bekor</button>)}
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
    </div>
  );
};

export default Admin;