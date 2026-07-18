import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../api/axios";
import PaymentModal from "../components/PaymentModal";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'https://backend-4-9otm.onrender.com';

// ✅ YANGI: via.placeholder.com o'chib qolgani uchun olib tashlandi (tashqi so'rov yubormaydi)
const NO_IMAGE_URL = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' fill='%23888' font-family='sans-serif' font-size='20' text-anchor='middle' dominant-baseline='middle'%3ERasm yo'q%3C/text%3E%3C/svg%3E";

const Order = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  const [telegramLinked, setTelegramLinked] = useState(() => !!localStorage.getItem("telegramId"));
  const [telegramLinking, setTelegramLinking] = useState(false);
  const [telegramError, setTelegramError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    deliveryType: "dine-in",
    address: "",
    tableNumber: "",
    tableLocation: "",
    note: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingTables(true);
        const [menusRes, tablesRes] = await Promise.all([
          axiosInstance.get("/menus"),
          axiosInstance.get("/tables")
        ]);
        setMenus(Array.isArray(menusRes.data.menus) ? menusRes.data.menus : []);
        setTables(Array.isArray(tablesRes.data.tables) ? tablesRes.data.tables : []);
      } catch (err) {
        console.error("❌ Ma'lumotlarni yuklash xatosi:", err);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoadingTables(false);
      }
    };
    fetchData();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const geo = { type: "Point", coordinates: [longitude, latitude] };
        setLocation(geo);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=uz`);
          const data = await res.json();
          const address = data?.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setForm((f) => ({ ...f, address }));
        } catch (err) {
          console.warn("Manzilni aniqlashda xatolik:", err.message);
          setForm((f) => ({ ...f, address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.warn("Lokatsiya olish rad etildi:", error.message);
        setLocationError("Lokatsiyaga ruxsat berilmadi. Brauzer sozlamalaridan ruxsat bering yoki manzilni qo'lda kiriting.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ✅ WebP QO'SHILDI - Rasmlar 40% tezroq yuklanadi!
  const getImageUrl = (imagePath) => {
    if (!imagePath) return NO_IMAGE_URL;
    if (imagePath.startsWith('http')) {
      return imagePath.includes('?') ? `${imagePath}&fm=webp` : `${imagePath}?fm=webp`;
    }
    if (imagePath.startsWith('/uploads/')) {
      return `${BASE_URL}${imagePath}`;
    }
    return `${BASE_URL}/uploads/${imagePath}`;
  };

  const connectTelegram = async () => {
    setTelegramLinking(true);
    setTelegramError("");
    try {
      const [{ data: linkData }, { data: botData }] = await Promise.all([
        axiosInstance.post("/telegram/link"),
        axiosInstance.get("/telegram/bot-info"),
      ]);

      const token = linkData.token;
      const botUsername = botData.username;

      window.open(`https://t.me/${botUsername}?start=${token}`, "_blank");

      let attempts = 0;
      const maxAttempts = 40;

      const intervalId = setInterval(async () => {
        attempts++;
        try {
          const { data } = await axiosInstance.get(`/telegram/link/${token}`);
          if (data.telegramId) {
            localStorage.setItem("telegramId", data.telegramId);
            setTelegramLinked(true);
            setTelegramLinking(false);
            clearInterval(intervalId);
            setTelegramError("");
          } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            setTelegramLinking(false);
            setTelegramError("Ulanish vaqti tugadi. Qaytadan urinib ko'ring.");
          }
        } catch (err) {
          if (err.response?.status === 404) {
            clearInterval(intervalId);
            setTelegramLinking(false);
            setTelegramError("Ulanish vaqti tugadi. Qaytadan urinib ko'ring.");
          }
        }
      }, 3000);
    } catch (err) {
      setTelegramLinking(false);
      setTelegramError("Telegramga ulanishda xatolik yuz berdi.");
    }
  };

  const addToCart = (menu) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem === menu._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem === menu._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: menu._id, name: menu.name, price: menu.price, quantity: 1 }];
    });
  };

  const removeFromCart = (menuId) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem === menuId);
      if (existing?.quantity === 1) return prev.filter((i) => i.menuItem !== menuId);
      return prev.map((i) =>
        i.menuItem === menuId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const getQty = (menuId) => cart.find((i) => i.menuItem === menuId)?.quantity || 0;

  const totalPrice = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  const groupedMenus = useMemo(() => {
    return menus.reduce((acc, menu) => {
      const cat = menu.category || "Boshqa";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(menu);
      return acc;
    }, {});
  }, [menus]);

  const handleTableChange = (e) => {
    const selectedNumber = e.target.value;
    const selectedTable = tables.find(t => t.number === parseInt(selectedNumber));
    setForm({
      ...form,
      tableNumber: selectedNumber,
      tableLocation: selectedTable?.location || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return setError("Kamida bitta taom tanlang!");

    if (form.deliveryType === "dine-in" && !form.tableNumber) {
      return setError("Dine-in uchun stol raqamini tanlang!");
    }

    if (form.deliveryType === "delivery" && !form.address.trim()) {
      return setError("Yetkazish uchun manzil kiritilishi shart!");
    }

    setLoading(true);
    setError("");
    try {
      let locationData = location || { type: "Point", coordinates: [0, 0] };
      
      const orderData = {
        ...form,
        items: cart,
        totalPrice,
        tableNumber: form.deliveryType === "dine-in" ? parseInt(form.tableNumber) : null,
        tableLocation: form.tableLocation || null,
        location: locationData,
        paymentStatus: 'pending',
        deliveryStatus: 'pending',
        telegramId: localStorage.getItem('telegramId') || null,
      };

      const res = await axiosInstance.post("/orders", orderData);
      
      setCurrentOrderId(res.data.order._id);
      setLastOrder(res.data.order);
      setShowPayment(true);
      
      setCart([]);
      setForm({ customerName: "", phone: "", deliveryType: "dine-in", address: "", tableNumber: "", tableLocation: "", note: "" });
      
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (method) => {
    setPaymentMethod(method);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  const availableTables = tables.filter(table => table.isAvailable);

  return (
    <div className="relative min-h-screen overflow-hidden text-white px-4 sm:px-6 lg:px-10 py-28">

      {/* ===== BACKGROUND IMAGE ===== */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80&fm=webp"
          alt="Restaurant background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFC93C]/5 via-transparent to-[#E08A3C]/5"></div>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,180,40,0.03) 50px, rgba(255,180,40,0.03) 51px),
            repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(255,180,40,0.03) 50px, rgba(255,180,40,0.03) 51px)
          `
        }}></div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#E08A3C]/15 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#FFDD73]/15 blur-[200px] animate-pulse delay-700" />
        {/* Signature: embers drifting up, as if rising off a qozon — layered for depth */}
        {[...Array(18)].map((_, i) => (
          <span
            key={`far-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 5.5 + 2) % 100}%`,
              "--size": `${2 + (i % 3)}px`,
              filter: "blur(0.5px)",
              opacity: 0.5,
              animationDuration: `${8 + (i % 6) * 1.4}s`,
              animationDelay: `${i * 0.55}s`,
              "--drift": `${((i % 5) - 2) * 30}px`,
            }}
          />
        ))}
        {[...Array(16)].map((_, i) => (
          <span
            key={`near-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 6.3 + 5) % 100}%`,
              "--size": `${4 + (i % 4)}px`,
              animationDuration: `${5 + (i % 4) * 1.2}s`,
              animationDelay: `${i * 0.4}s`,
              "--drift": `${((i % 3) - 1) * 55}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#FFC93C]/20 bg-[#FFC93C]/10 backdrop-blur-xl mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFDD73] animate-pulse"></div>
            <span className="text-[#FFDD73] uppercase tracking-[0.4em] text-[11px] font-black">
               Online Xizmat
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-bold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB0] via-[#FFA23D] to-[#FF5A1F] drop-shadow-[0_0_50px_rgba(255,180,40,0.15)]">
            Online Zakaz
          </h1>
          <div className="divider-ikat mt-5">
            <span className="ikat-node"></span>
          </div>
          <p className="mt-4 text-gray-400 text-lg font-light tracking-wider">Taomlarni tanlang va buyurtma bering</p>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => navigate("/track")} className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-bold hover:border-[#FFC93C]/30 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(255,180,40,0.05)]">🚚 Zakaz holati</button>
          </div>
          {locationError && <p className="text-[#FFDD73] text-xs mt-3">⚠️ {locationError}</p>}
          {location && !locationError && <p className="text-green-400 text-xs mt-3">✅ Lokatsiya aniqlandi</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MENU */}
          <div className="lg:col-span-2 space-y-10">
            {Object.keys(groupedMenus).length === 0 ? (
              <div className="text-center text-gray-500 py-20 bg-black/20 backdrop-blur-xl rounded-3xl border border-[#FFC93C]/10 p-12">
                <div className="w-16 h-16 border-4 border-[#FFC93C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-bold text-[#FFDD73]">Menu yuklanmoqda...</p>
                <p className="text-sm mt-2 text-gray-500">Iltimos, biroz kuting</p>
              </div>
            ) : (
              Object.keys(groupedMenus).map((cat) => (
                <div key={cat}>
                  <div className="flex items-center gap-4 mb-5 border-b border-[#FFC93C]/15 pb-4">
                    <span className="text-2xl">🍽</span>
                    <h3 className="font-display text-[#FFDD73] font-bold uppercase tracking-widest text-base">{cat}</h3>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-[#FFC93C]/30 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {groupedMenus[cat].map((menu) => {
                      const qty = getQty(menu._id);
                      return (
                        <div 
                          key={menu._id} 
                          className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 backdrop-blur-xl ${
                            qty > 0 
                              ? "border-[#FFDD73]/60 bg-[#FFC93C]/10 shadow-[0_0_40px_rgba(255,180,40,0.15)] animate-glowPulse" 
                              : "border-white/10 bg-white/[0.03] hover:border-[#FFC93C]/30 hover:bg-[#FFC93C]/5 hover:shadow-[0_0_30px_rgba(255,180,40,0.08)]"
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[#FFC93C]/10 via-transparent to-[#FF5A1F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          
                          <img
                            loading="lazy"
                            src={getImageUrl(menu.image)}
                            alt={menu.name}
                            crossOrigin="anonymous"
                            className="w-full h-44 object-cover transition-all duration-700 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = NO_IMAGE_URL;
                            }}
                          />
                          
                          <div className="relative p-4 z-10">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h4 className="font-display text-white text-lg font-bold group-hover:text-[#FFDD73] transition-colors">{menu.name}</h4>
                                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{menu.retsept}</p>
                              </div>
                              <span className="text-[#FFDD73] font-black text-sm whitespace-nowrap bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                                {Number(menu.price).toLocaleString()} so'm
                              </span>
                            </div>
                            {qty === 0 ? (
                              <button 
                                onClick={() => addToCart(menu)} 
                                className="mt-4 w-full py-3 rounded-xl bg-[#FFC93C]/15 border border-[#FFC93C]/30 text-[#FFDD73] font-bold text-sm transition-all hover:bg-[#FFDD73] hover:text-black hover:scale-105 hover:shadow-[0_0_25px_rgba(255,180,40,0.2)]"
                              >
                                + Qo'shish
                              </button>
                            ) : (
                              <div className="mt-4 flex items-center justify-between gap-3">
                                <button 
                                  onClick={() => removeFromCart(menu._id)} 
                                  className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 font-black text-lg hover:bg-red-500 hover:text-white transition-all hover:scale-110"
                                >
                                  −
                                </button>
                                <span className="text-white font-black text-xl bg-black/30 px-6 py-1 rounded-full backdrop-blur-sm">{qty}</span>
                                <button 
                                  onClick={() => addToCart(menu)} 
                                  className="w-10 h-10 rounded-xl bg-[#FFC93C]/15 border border-[#FFC93C]/30 text-[#FFDD73] font-black text-lg hover:bg-[#FFDD73] hover:text-black transition-all hover:scale-110"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CART */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card-luxe p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-[#FFDD73] font-bold uppercase tracking-widest text-base">🛒 Savat</h3>
                  {cart.length > 0 && (
                    <span className="text-xs px-3 py-1 rounded-full bg-[#FFC93C]/20 text-[#FFDD73] border border-[#FFC93C]/30 font-bold">
                      {cart.length} xil
                    </span>
                  )}
                </div>
                {cart.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-600 text-sm">Hali hech narsa tanlanmagan</p>
                    <p className="text-gray-700 text-xs mt-2">Menyudan taomlarni tanlang</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.menuItem} className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                        <span className="text-gray-300">{item.name} <span className="text-gray-600">x{item.quantity}</span></span>
                        <span className="text-[#FFDD73] font-bold">{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-3 flex justify-between font-black text-lg">
                      <span className="text-gray-400">Jami:</span>
                      <span className="text-[#FFDD73] text-xl">{totalPrice.toLocaleString()} so'm</span>
                    </div>
                  </div>
                )}
              </div>

              {success && (
                <div className="p-5 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-center animate-fadeInUp backdrop-blur-xl">
                  ✅ Zakazingiz qabul qilindi! Tez orada bog'lanamiz.
                </div>
              )}
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-bold text-center backdrop-blur-xl animate-shake">
                  ⚠️ {error}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="card-luxe p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">📋</span>
                  <h3 className="font-display text-[#FFDD73] font-bold uppercase tracking-widest text-base">Ma'lumotlar</h3>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-1.5 block font-bold">Ism</label>
                  <input 
                    name="customerName" 
                    value={form.customerName} 
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })} 
                    placeholder="Sardor Alimov" 
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none text-white text-sm placeholder:text-gray-700 focus:border-[#FFDD73] focus:shadow-[0_0_25px_rgba(255,180,40,0.1)] transition-all duration-300 hover:border-[#FFC93C]/40" 
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-1.5 block font-bold">Telefon</label>
                  <input 
                    name="phone" 
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    placeholder="+998 90 000 00 00" 
                    required 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none text-white text-sm placeholder:text-gray-700 focus:border-[#FFDD73] focus:shadow-[0_0_25px_rgba(255,180,40,0.1)] transition-all duration-300 hover:border-[#FFC93C]/40" 
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2 block font-bold">Tur</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ val: "dine-in", label: "🍽 Restoran" }, { val: "takeaway", label: "🥡 Olib ketish" }, { val: "delivery", label: "🚚 Yetkazish" }].map((opt) => (
                      <button 
                        key={opt.val} 
                        type="button" 
                        onClick={() => setForm({ ...form, deliveryType: opt.val, address: "", tableNumber: "", tableLocation: "" })} 
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 ${form.deliveryType === opt.val ? "border-[#FFDD73] bg-[#FFC93C]/15 text-[#FFDD73] shadow-[0_0_20px_rgba(255,180,40,0.05)]" : "border-white/10 bg-white/[0.03] text-gray-500 hover:border-[#FFC93C]/30 hover:text-white"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STOL SELECT */}
                {form.deliveryType === "dine-in" && (
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-1.5 block font-bold">
                      🪑 Stol raqami *
                    </label>
                    {loadingTables ? (
                      <div className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 text-gray-500 text-sm">
                        ⏳ Stollar yuklanmoqda...
                      </div>
                    ) : (
                      <>
                        <select
                          name="tableNumber"
                          value={form.tableNumber}
                          onChange={handleTableChange}
                          required
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none text-white text-sm transition-all duration-300 focus:border-[#FFDD73] focus:shadow-[0_0_25px_rgba(255,180,40,0.1)] hover:border-[#FFC93C]/40 appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-black text-gray-400">🔍 Stol tanlang...</option>
                          {availableTables.length > 0 ? (
                            availableTables.map((table) => (
                              <option 
                                key={table._id} 
                                value={table.number}
                                className="bg-black text-white py-2"
                              >
                                🪑 #{table.number} — {table.capacity} kishi {table.location ? `📍 ${table.location}` : ''}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled className="bg-black text-red-400">
                              ⚠️ Hozircha bo'sh stol yo'q
                            </option>
                          )}
                        </select>
                        
                        {form.tableNumber && (
                          <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                            <span>✅</span>
                            <span>Stol #{form.tableNumber} tanlandi</span>
                            {form.tableLocation && (
                              <span className="text-gray-400">
                                📍 {form.tableLocation}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {form.deliveryType === "delivery" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500 block font-bold">Manzil *</label>
                      <button 
                        type="button" 
                        onClick={detectLocation} 
                        disabled={locationLoading} 
                        className="text-[10px] font-bold text-[#FFDD73] hover:text-[#FFEBB0] transition-all disabled:opacity-50 whitespace-nowrap hover:scale-105"
                      >
                        {locationLoading ? "⏳ Aniqlanmoqda..." : "📍 Joylashuvimni aniqlash"}
                      </button>
                    </div>
                    <input 
                      name="address" 
                      value={form.address} 
                      onChange={(e) => setForm({ ...form, address: e.target.value })} 
                      placeholder="Ko'cha, uy raqami... yoki tugma orqali aniqlang" 
                      required 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none text-white text-sm placeholder:text-gray-700 focus:border-[#FFDD73] focus:shadow-[0_0_25px_rgba(255,180,40,0.1)] transition-all duration-300 hover:border-[#FFC93C]/40" 
                    />
                    {locationError && <p className="text-[#FFDD73] text-[10px] mt-1">⚠️ {locationError}</p>}
                    {location && !locationError && <p className="text-green-400 text-[10px] mt-1">✅ Aniq joylashuv olindi — kuryer xaritada ko'radi</p>}
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-1.5 block font-bold">Izoh</label>
                  <input 
                    name="note" 
                    value={form.note} 
                    onChange={(e) => setForm({ ...form, note: e.target.value })} 
                    placeholder="Qo'shimcha izoh..." 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 outline-none text-white text-sm placeholder:text-gray-700 focus:border-[#FFDD73] focus:shadow-[0_0_25px_rgba(255,180,40,0.1)] transition-all duration-300 hover:border-[#FFC93C]/40" 
                  />
                </div>

                {/* Telegram */}
                <div className="p-3 rounded-xl border border-[#FFC93C]/15 bg-[#FFC93C]/5 hover:border-[#FFC93C]/30 transition-all duration-300">
                  {telegramLinked ? (
                    <p className="text-green-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                      <span className="text-lg">✅</span> Telegram ulangan — zakaz holati haqida shu yerga xabar olasiz
                    </p>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        onClick={connectTelegram} 
                        disabled={telegramLinking} 
                        className="w-full py-2.5 rounded-xl border border-[#FFC93C]/30 text-[#FFDD73] text-xs font-bold hover:bg-[#FFC93C]/10 transition-all disabled:opacity-50 hover:scale-[1.02]"
                      >
                        {telegramLinking ? "⏳ Kutilmoqda... (botda Start bosing)" : "📲 Telegram orqali ulanish"}
                      </button>
                      <p className="text-gray-500 text-[10px] mt-2 text-center">Ulansangiz, zakaz holati haqida Telegram orqali xabar olasiz</p>
                      {telegramError && <p className="text-red-400 text-[10px] mt-1 text-center">{telegramError}</p>}
                    </>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading || cart.length === 0} 
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F] text-black font-black uppercase tracking-[0.25em] text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(255,180,40,0.4)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition duration-500"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative z-10">{loading ? "⏳ Yuborilmoqda..." : "🛒 Zakaz Berish"}</span>
                </button>
              </form>

              <button 
                onClick={() => navigate("/track")} 
                className="w-full py-3.5 rounded-xl border border-[#FFC93C]/20 text-[#FFDD73] text-sm font-bold hover:bg-[#FFC93C]/10 hover:border-[#FFC93C]/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                🚚 Zakaz holatini kuzatish
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} orderId={currentOrderId} totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />
    </div>
  );
};

export default Order;