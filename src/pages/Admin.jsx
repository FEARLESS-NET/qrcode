import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";
import Reports from "../components/Reports";
import OrderTracker from "../components/OrderTracker";

const TABS = ["Menu", "Stollar", "Bronlar", "Zakazlar", "Yetkazib berish", "Hisobotlar"];

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Menu");

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) navigate("/login");
  }, [navigate]);

  // ── MENU ──
  const [menus, setMenus] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", retsept: "", image: "", category: "" });

  const getMenus = async () => {
    try {
      const res = await axiosInstance.get("/menus");
      setMenus(res.data.menus || []);
    } catch (err) { console.error(err); }
  };

  // ── STOLLAR ──
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

  // ── BRONLAR ──
  const [reservations, setReservations] = useState([]);

  const getReservations = async () => {
    try {
      const res = await axiosInstance.get("/reservations");
      setReservations(res.data.reservations || []);
    } catch (err) { console.error(err); }
  };

  // ── ZAKAZLAR ──
  const [orders, setOrders] = useState([]);
  const [editingDelivery, setEditingDelivery] = useState(null);

  const getOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) { console.error(err); }
  };

  // Birinchi yuklanish
  useEffect(() => {
    getMenus();
    getTables();
    getReservations();
    getOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  // ── MENU SUBMIT ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("retsept", form.retsept);
      formData.append("category", form.category);
      if (form.image instanceof File) formData.append("image", form.image);

      if (editingId) {
        await axiosInstance.put(`/menus/${editingId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        setEditingId(null);
      } else {
        await axiosInstance.post("/menus", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setForm({ name: "", price: "", retsept: "", image: "", category: "" });
      getMenus();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
      try { await axiosInstance.delete(`/menus/${id}`); getMenus(); }
      catch (err) { console.error(err); }
    }
  };

  const handleEdit = (menu) => { setForm(menu); setEditingId(menu._id); };

  // ── TABLE SUBMIT ──
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

  // ── RESERVATION STATUS ──
  const updateReservationStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/reservations/${id}`, { status });
      getReservations();
    } catch (err) { console.error(err); }
  };

  // ── ORDER STATUS ──
  const updateOrderStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/orders/${id}/status`, { status });
      getOrders();
    } catch (err) { console.error(err); }
  };

  // ── ✅ DELIVERY STATUS YANGILASH ──
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
      alert('Xatolik: ' + err.response?.data?.message); 
    }
  };

  const statusColor = {
    pending: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white px-4 sm:px-6 lg:px-10 py-10">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)`, backgroundSize: "55px 55px" }} />
        <div className="absolute top-[-15%] left-[-10%] w-[650px] h-[650px] bg-cyan-500/20 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[650px] h-[650px] bg-purple-600/20 blur-[180px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-10 border-b border-cyan-500/20 pb-7">
          <div>
            <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              ADMIN PANEL
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Restoran boshqaruv tizimi</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-2xl border border-red-500/40 text-red-400 transition-all hover:bg-red-500 hover:text-white hover:scale-105"
          >
            🚪 Chiqish
          </button>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Menyu", value: menus.length, color: "cyan" },
            { label: "Jami Stollar", value: tableStats.total, color: "blue" },
            { label: "Bronlar", value: reservations.filter(r => r.status === "pending").length, color: "yellow", suffix: " yangi" },
            { label: "Zakazlar", value: orders.filter(o => o.status === "pending").length, color: "purple", suffix: " yangi" },
            { label: "Yo'lda", value: orders.filter(o => o.deliveryStatus === "on_the_way").length, color: "orange", suffix: " ta" },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center">
              <p className={`text-3xl font-black text-${s.color}-400`}>{s.value}{s.suffix || ""}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "bg-cyan-400 text-black shadow-[0_0_30px_rgba(0,255,255,0.4)]"
                  : "border border-white/10 bg-white/[0.03] text-gray-400 hover:border-cyan-500/30 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── TAB: MENU ── */}
        {activeTab === "Menu" && (
          <div>
            <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-cyan-500/20 backdrop-blur-3xl rounded-[30px] p-6 sm:p-8 mb-10">
              <h3 className="text-cyan-400 font-black text-xl mb-6">
                {editingId ? "📝 Tahrirlash" : "➕ Yangi Taom"}
              </h3>
              <div className="mb-4">
                <label className="text-xs uppercase text-gray-500 block mb-2">Rasm yuklash</label>
                <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} className="text-gray-400 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {["name", "price", "retsept", "category"].map((key) => (
                  <div key={key}>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-2">
                      {key === "name" ? "Nomi" : key === "price" ? "Narxi (so'm)" : key === "retsept" ? "Retsept" : "Kategoriya"}
                    </label>
                    <input
                      value={typeof form[key] === "string" ? form[key] : ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      type={key === "price" ? "number" : "text"}
                      min={key === "price" ? "0" : undefined}
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white focus:border-cyan-400 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="px-8 py-4 rounded-2xl bg-cyan-400 text-black font-black hover:scale-105 hover:bg-cyan-300 transition-all">
                  {editingId ? "Yangilash" : "Saqlash"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", price: "", retsept: "", image: "", category: "" }); }}
                    className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    Bekor
                  </button>
                )}
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div key={menu._id} className="group relative overflow-hidden rounded-[24px] border border-cyan-500/20 bg-white/[0.03] backdrop-blur-3xl transition-all hover:scale-[1.02] hover:border-cyan-400/50">
                  <div className="h-48 overflow-hidden">
                    <img src={menu.image || "https://via.placeholder.com/400x200?text=No+Image"} alt={menu.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between">
                      <h3 className="font-black text-lg">{menu.name}</h3>
                      <span className="text-green-400 font-bold">{Number(menu.price).toLocaleString()} so'm</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{menu.retsept}</p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleEdit(menu)} className="flex-1 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold hover:bg-yellow-400 hover:text-black transition-all">Tahrirlash</button>
                      <button onClick={() => handleDelete(menu._id)} className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all">O'chirish</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: STOLLAR ── */}
        {activeTab === "Stollar" && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Jami", value: tableStats.total, color: "text-white" },
                { label: "Bo'sh", value: tableStats.available, color: "text-green-400" },
                { label: "Band", value: tableStats.booked, color: "text-red-400" },
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center">
                  <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleTableSubmit} className="bg-white/[0.03] border border-cyan-500/20 rounded-[24px] p-6 mb-8">
              <h3 className="text-cyan-400 font-black text-lg mb-5">➕ Yangi Stol</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase text-gray-500 block mb-2">Stol raqami</label>
                  <input value={tableForm.number} onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })} type="number" required placeholder="1" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-cyan-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs uppercase text-gray-500 block mb-2">Sig'im (kishi)</label>
                  <input value={tableForm.capacity} onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })} type="number" required placeholder="4" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-cyan-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs uppercase text-gray-500 block mb-2">Joylashuv</label>
                  <input value={tableForm.location} onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })} placeholder="Ichki zal" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-cyan-400 transition-all" />
                </div>
              </div>
              <button type="submit" className="mt-5 px-8 py-3 rounded-2xl bg-cyan-400 text-black font-black hover:scale-105 transition-all">Stol Qo'shish</button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div key={table._id} className={`relative rounded-2xl border p-5 transition-all ${table.isAvailable ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-3xl font-black">#{table.number}</p>
                      <p className="text-gray-400 text-sm mt-1">{table.capacity} kishi</p>
                      {table.location && <p className="text-gray-500 text-xs">{table.location}</p>}
                    </div>
                    <span className={`w-3 h-3 rounded-full mt-1 ${table.isAvailable ? "bg-green-400" : "bg-red-500"}`} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => toggleTableAvailability(table)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${table.isAvailable ? "border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white" : "border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black"}`}>
                      {table.isAvailable ? "Band qilish" : "Bo'shatish"}
                    </button>
                    <button onClick={() => handleTableDelete(table._id)} className="px-3 py-2 rounded-xl border border-red-500/20 text-red-400 text-xs hover:bg-red-500 hover:text-white transition-all">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: BRONLAR ── */}
        {activeTab === "Bronlar" && (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <p className="text-gray-500 text-center py-20 text-xl">Hali bron yo'q</p>
            ) : (
              reservations.map((r) => (
                <div key={r._id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-black text-lg">{r.customerName}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full border font-bold ${statusColor[r.status]}`}>
                          {statusLabel[r.status]}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">📞 {r.phone}</p>
                      <p className="text-gray-400 text-sm">🪑 Stol #{r.tableId?.number} &nbsp;|&nbsp; 👥 {r.guestCount} kishi</p>
                      <p className="text-gray-400 text-sm">📆 {r.date} &nbsp;⏰ {r.time}</p>
                      {r.diningArea && <p className="text-yellow-400 text-sm">📍 {diningAreaMap[r.diningArea] || r.diningArea}</p>}
                      {r.note && <p className="text-gray-500 text-xs">📝 {r.note}</p>}
                    </div>
                    {r.status === "pending" && (
                      <div className="flex gap-2 items-start">
                        <button onClick={() => updateReservationStatus(r._id, "confirmed")} className="px-5 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold hover:bg-green-500 hover:text-black transition-all">✅ Tasdiqlash</button>
                        <button onClick={() => updateReservationStatus(r._id, "cancelled")} className="px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">❌ Bekor</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB: ZAKAZLAR ── */}
        {activeTab === "Zakazlar" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-20 text-xl">Hali zakaz yo'q</p>
            ) : (
              orders.map((o) => (
                <div key={o._id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-black text-lg">{o.customerName}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full border font-bold ${statusColor[o.status]}`}>
                          {statusLabel[o.status]}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-gray-400">
                          {deliveryTypeMap[o.deliveryType] || o.deliveryType}
                        </span>
                        {o.deliveryStatus && o.deliveryStatus !== 'pending' && (
                          <span className="text-xs px-3 py-1 rounded-full border border-yellow-500/30 text-yellow-400 bg-yellow-500/10">
                            {deliveryStatusLabels[o.deliveryStatus] || o.deliveryStatus}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">📞 {o.phone}</p>
                      {o.deliveryType === "dine-in" && o.tableNumber && <p className="text-yellow-400 text-sm">🪑 Stol #{o.tableNumber}</p>}
                      {o.deliveryType === "delivery" && o.address && <p className="text-gray-400 text-sm">📍 {o.address}</p>}
                      {o.deliveryType === "takeaway" && <p className="text-gray-400 text-sm">🥡 Olib ketish</p>}
                      <div className="mt-2 space-y-1">
                        {o.items?.map((item, idx) => (
                          <p key={idx} className="text-gray-300 text-sm">
                            • {item.name} x{item.quantity} — {(item.price * item.quantity).toLocaleString()} so'm
                          </p>
                        ))}
                      </div>
                      <p className="text-cyan-400 font-black mt-2">💰 Jami: {o.totalPrice?.toLocaleString()} so'm</p>
                      {o.note && <p className="text-gray-500 text-xs">📝 {o.note}</p>}
                      {o.courierName && (
                        <p className="text-green-400 text-xs">👤 Kuryer: {o.courierName}</p>
                      )}
                    </div>
                    {o.status !== "cancelled" && o.status !== "ready" && (
                      <div className="flex flex-col gap-2 items-start">
                        {o.status === "pending" && <button onClick={() => updateOrderStatus(o._id, "confirmed")} className="px-5 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold hover:bg-green-500 hover:text-black transition-all whitespace-nowrap">✅ Qabul</button>}
                        {o.status === "confirmed" && <button onClick={() => updateOrderStatus(o._id, "preparing")} className="px-5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all whitespace-nowrap">👨‍🍳 Tayyorlanmoqda</button>}
                        {o.status === "preparing" && (
                          <>
                            <button onClick={() => updateOrderStatus(o._id, "ready")} className="px-5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-bold hover:bg-cyan-400 hover:text-black transition-all whitespace-nowrap">🎉 Tayyor</button>
                            {o.deliveryType === "delivery" && (
                              <button onClick={() => {
                                const courierName = prompt("Kuryer ismi:");
                                const courierPhone = prompt("Kuryer telefon raqami:");
                                if (courierName) updateDeliveryStatus(o._id, "on_the_way", courierName, courierPhone);
                              }} className="px-5 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500 hover:text-black transition-all whitespace-nowrap">🚚 Yo'lga chiqarish</button>
                            )}
                          </>
                        )}
                        {o.deliveryStatus === "on_the_way" && (
                          <button onClick={() => updateDeliveryStatus(o._id, "delivered")} className="px-5 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold hover:bg-green-500 hover:text-black transition-all whitespace-nowrap">✅ Yetkazildi</button>
                        )}
                        <button onClick={() => updateOrderStatus(o._id, "cancelled")} className="px-5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">❌ Bekor</button>
                      </div>
                    )}
                    {o.status === "ready" && o.deliveryType === "delivery" && o.deliveryStatus === "pending" && (
                      <button onClick={() => {
                        const courierName = prompt("Kuryer ismi:");
                        const courierPhone = prompt("Kuryer telefon raqami:");
                        if (courierName) updateDeliveryStatus(o._id, "on_the_way", courierName, courierPhone);
                      }} className="px-5 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500 hover:text-black transition-all whitespace-nowrap">🚚 Yo'lga chiqarish</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB: YETKAZIB BERISH ── */}
        {activeTab === "Yetkazib berish" && (
          <OrderTracker />
        )}

        {/* ── TAB: HISOBOTLAR ── */}
        {activeTab === "Hisobotlar" && (
          <Reports />
        )}
      </div>
    </div>
  );
};

export default Admin;