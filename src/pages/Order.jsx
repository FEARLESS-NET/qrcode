/**
 * ORDER PAGE – ZAKAZ QILISH SAHIFASI
 * Chapda: savat (cart) + zakaz formasi. O'ngda: menyu (kategoriyalar) – qo'shish/ayirish.
 * Forma: Ism, telefon, yetkazib berish turi (dine-in, takeaway, delivery).
 * Dine-in da stol tanlash (real-time mavjudlik).
 * Delivery da manzil va lokatsiyani avtomatik aniqlash.
 * Telegram ulanish (token orqali).
 * Zakaz yuborilganda PaymentModal ochiladi.
 * Muvaffaqiyatli to'lovdan so'ng zakaz saqlanadi va hisobot yangilanadi.
 * Telefonda avval menyu, keyin zakaz formasi chiqadi.
 */
import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../api/axios";
import PaymentModal from "../components/PaymentModal";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'https://backend-4-9otm.onrender.com';
const NO_IMAGE_URL = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' fill='%23888' font-family='sans-serif' font-size='20' text-anchor='middle' dominant-baseline='middle'%3ERasm yo'q%3C/text%3E%3C/svg%3E";

/* Qayta ishlatiladigan stillar (oltin + qora) */
const panelCls =
  "rounded-2xl bg-gradient-to-b from-[#1c1503] to-black border border-[#FFD700]/40 shadow-[0_0_25px_rgba(255,215,0,0.15)]";
const labelCls =
  "text-[11px] uppercase tracking-[0.3em] text-[#FFE27A] mb-1.5 block font-extrabold";
const inputCls =
  "w-full bg-black/70 border border-[#FFD700]/30 rounded-xl px-4 py-3 outline-none text-white text-sm font-medium placeholder:text-gray-400 focus:border-[#FFD700] focus:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:border-[#FFD700]/60";
const goldGrad = "bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#B8860B]";

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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return NO_IMAGE_URL;
    if (imagePath.startsWith('http')) {
      if (imagePath.includes('images.unsplash.com')) {
        return imagePath.includes('?') ? `${imagePath}&fm=webp` : `${imagePath}?fm=webp`;
      }
      return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
      return `${BASE_URL}${imagePath}`;
    }
    return `${BASE_URL}/uploads/${imagePath}`;
  };

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
  const totalPrice = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);

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
        phone: form.deliveryType === "dine-in" ? (form.phone?.trim() || "restoran-mijozi") : form.phone,
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
    <div className="relative min-h-screen overflow-hidden text-white px-3 sm:px-6 lg:px-10 py-24 sm:py-28">

      {/* FON */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1920&q=80&fm=webp"
          alt="Restaurant background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/75 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 via-transparent to-[#B8860B]/10"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FFD700]/15 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#B8860B]/20 blur-[200px] animate-pulse delay-700" />

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

        {/* SARLAVHA */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#FFD700]/50 bg-[#FFD700]/10 backdrop-blur-xl mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700] animate-pulse"></div>
            <span className="text-[#FFE27A] uppercase tracking-[0.4em] text-[11px] font-black">
              Online Xizmat
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-7xl font-extrabold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#E0A100] drop-shadow-[0_0_40px_rgba(255,215,0,0.35)]">
            Online Zakaz
          </h1>
          <div className="divider-ikat mt-4">
            <span className="ikat-node"></span>
          </div>
          <p className="mt-3 text-white text-base sm:text-lg font-medium tracking-wider [text-shadow:0_2px_6px_rgba(0,0,0,0.9)]">
            Taomlarni tanlang va buyurtma bering
          </p>
          <div className="flex justify-center gap-4 mt-5">
            <button
              onClick={() => navigate("/track")}
              className="px-7 py-2.5 rounded-xl bg-black/60 border border-[#FFD700]/50 text-[#FFD700] text-sm font-bold hover:bg-[#FFD700] hover:text-black transition-all hover:shadow-[0_0_25px_rgba(255,215,0,0.5)]"
            >
              🚚 Zakaz holati
            </button>
          </div>
          {locationError && <p className="text-[#FFE27A] text-xs mt-3 font-semibold">⚠️ {locationError}</p>}
          {location && !locationError && <p className="text-green-400 text-xs mt-3 font-semibold">✅ Lokatsiya aniqlandi</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ===== CHAP: SAVAT + FORMA ===== */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-5">

              {/* SAVAT */}
              <div className={`${panelCls} p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-[#FFD700] font-extrabold uppercase tracking-widest text-base">🛒 Savat</h3>
                  {cart.length > 0 && (
                    <span className="text-xs px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFE27A] border border-[#FFD700]/50 font-bold">
                      {cart.length} xil
                    </span>
                  )}
                </div>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-200 text-sm font-medium">Hali hech narsa tanlanmagan</p>
                    <p className="text-gray-400 text-xs mt-2">Menyudan taomlarni tanlang</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.menuItem} className="flex justify-between items-center text-sm py-2 border-b border-[#FFD700]/20">
                        <span className="text-white font-medium">
                          {item.name} <span className="text-[#FFE27A] font-bold">x{item.quantity}</span>
                        </span>
                        <span className="text-[#FFD700] font-extrabold">{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-3 flex justify-between items-center font-black text-lg">
                      <span className="text-gray-200">Jami:</span>
                      <span className="text-[#FFD700] text-xl [text-shadow:0_0_14px_rgba(255,215,0,0.5)]">
                        {totalPrice.toLocaleString()} so'm
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {success && (
                <div className="p-4 rounded-2xl bg-green-500/20 border border-green-400/60 text-green-300 font-bold text-center animate-fadeInUp backdrop-blur-xl">
                  ✅ Zakazingiz qabul qilindi! Tez orada bog'lanamiz.
                </div>
              )}
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/20 border border-red-400/60 text-red-300 text-sm font-bold text-center backdrop-blur-xl animate-shake">
                  ⚠️ {error}
                </div>
              )}

              {/* FORMA */}
              <form onSubmit={handleSubmit} className={`${panelCls} p-5 space-y-4`}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg">📋</span>
                  <h3 className="font-display text-[#FFD700] font-extrabold uppercase tracking-widest text-base">Ma'lumotlar</h3>
                </div>

                <div>
                  <label className={labelCls}>Ism</label>
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Sardor Alimov"
                    required
                    className={inputCls}
                  />
                </div>

                {form.deliveryType !== "dine-in" && (
                  <div>
                    <label className={labelCls}>Telefon</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+998 90 000 00 00"
                      required
                      className={inputCls}
                    />
                    <p className="text-[11px] text-gray-300 mt-1.5">📱 Zakazni keyinroq kuzatish uchun kerak bo'ladi</p>
                  </div>
                )}

                <div>
                  <label className={labelCls}>Tur</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ val: "dine-in", label: "🍽 Restoran" }, { val: "takeaway", label: "🥡 Olib ketish" }, { val: "delivery", label: "🚚 Yetkazish" }].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setForm({ ...form, deliveryType: opt.val, address: "", tableNumber: "", tableLocation: "" })}
                        className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all duration-300 ${
                          form.deliveryType === opt.val
                            ? `${goldGrad} border-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.5)]`
                            : "border-[#FFD700]/30 bg-black/60 text-[#F5E6B8] hover:border-[#FFD700] hover:text-[#FFD700]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.deliveryType === "dine-in" && (
                  <div>
                    <label className={labelCls}>🪑 Stol raqami *</label>
                    {loadingTables ? (
                      <div className={`${inputCls} text-gray-300`}>⏳ Stollar yuklanmoqda...</div>
                    ) : (
                      <>
                        <select
                          name="tableNumber"
                          value={form.tableNumber}
                          onChange={handleTableChange}
                          required
                          className={`${inputCls} appearance-none cursor-pointer`}
                        >
                          <option value="" className="bg-black text-gray-300">🔍 Stol tanlang...</option>
                          {availableTables.length > 0 ? (
                            availableTables.map((table) => (
                              <option key={table._id} value={table.number} className="bg-black text-white py-2">
                                🪑 #{table.number} — {table.capacity} kishi {table.location ? `📍 ${table.location}` : ''}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled className="bg-black text-red-400">⚠️ Hozircha bo'sh stol yo'q</option>
                          )}
                        </select>
                        {form.tableNumber && (
                          <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-green-500/15 border border-green-400/40 text-green-300 text-xs font-semibold">
                            <span>✅</span>
                            <span>Stol #{form.tableNumber} tanlandi</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {form.deliveryType === "delivery" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`${labelCls} !mb-0`}>Manzil *</label>
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={locationLoading}
                        className="text-[11px] font-extrabold text-[#FFD700] hover:text-white transition-all disabled:opacity-50 whitespace-nowrap hover:scale-105"
                      >
                        {locationLoading ? "⏳ Aniqlanmoqda..." : "📍 Joylashuvimni aniqlash"}
                      </button>
                    </div>
                    <input
                      name="address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Ko'cha, uy raqami..."
                      required
                      className={inputCls}
                    />
                  </div>
                )}

                <div>
                  <label className={labelCls}>Izoh</label>
                  <input
                    name="note"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Qo'shimcha izoh..."
                    className={inputCls}
                  />
                </div>

                {/* TELEGRAM */}
                <div className="p-3 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/5 hover:border-[#FFD700]/60 transition-all duration-300">
                  {telegramLinked ? (
                    <p className="text-green-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                      <span className="text-lg">✅</span> Telegram ulangan — zakaz holati haqida shu yerga xabar olasiz
                    </p>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={connectTelegram}
                        disabled={telegramLinking}
                        className="w-full py-2.5 rounded-xl border border-[#FFD700]/50 text-[#FFD700] text-xs font-extrabold hover:bg-[#FFD700] hover:text-black transition-all disabled:opacity-50 hover:scale-[1.02]"
                      >
                        {telegramLinking ? "⏳ Kutilmoqda... (botda Start bosing)" : "📲 Telegram orqali ulanish"}
                      </button>
                      <p className="text-gray-200 text-[11px] mt-2 text-center">Ulansangiz, zakaz holati haqida Telegram orqali xabar olasiz</p>
                      {telegramError && <p className="text-red-300 text-[11px] mt-1 text-center font-semibold">{telegramError}</p>}
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className={`w-full py-4 rounded-2xl ${goldGrad} text-black font-black uppercase tracking-[0.25em] text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(255,215,0,0.6)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative z-10">{loading ? "⏳ Yuborilmoqda..." : "🛒 Zakaz Berish"}</span>
                </button>
              </form>

              <button
                onClick={() => navigate("/track")}
                className="w-full py-3 rounded-xl border border-[#FFD700]/50 bg-black/60 text-[#FFD700] text-sm font-bold hover:bg-[#FFD700] hover:text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] active:scale-[0.98]"
              >
                🚚 Zakaz holatini kuzatish
              </button>
            </div>
          </div>

          {/* ===== O'NG: TAOMLAR ===== */}
          <div className="order-1 lg:order-2 lg:col-span-2 space-y-8">
            {Object.keys(groupedMenus).length === 0 ? (
              <div className="text-center text-gray-200 py-16 bg-black/60 backdrop-blur-xl rounded-3xl border border-[#FFD700]/30 p-10">
                <div className="w-14 h-14 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-bold text-[#FFD700]">Menu yuklanmoqda...</p>
                <p className="text-sm mt-2 text-gray-300">Iltimos, biroz kuting</p>
              </div>
            ) : (
              Object.keys(groupedMenus).map((cat) => (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-4 border-b border-[#FFD700]/40 pb-3">
                    <span className="text-2xl">🍽</span>
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#E0A100]">
                      {cat}
                    </h3>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-[#FFD700]/50 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {groupedMenus[cat].map((menu) => {
                      const qty = getQty(menu._id);
                      return (
                        <div
                          key={menu._id}
                          className={`
                            group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300
                            bg-gradient-to-b from-[#1c1503] to-black
                            ${qty > 0
                              ? "border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                              : "border-[#FFD700]/40 shadow-[0_0_14px_rgba(255,215,0,0.12)] hover:border-[#FFD700] hover:shadow-[0_0_26px_rgba(255,215,0,0.4)] hover:scale-[1.03]"
                            }
                          `}
                        >
                          <div className="relative h-32 sm:h-36 overflow-hidden">
                            <img
                              loading="lazy"
                              src={getImageUrl(menu.image)}
                              alt={menu.name}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src = NO_IMAGE_URL;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            <span className={`absolute bottom-1.5 left-1.5 px-2.5 py-1 rounded-lg ${goldGrad} text-black text-xs sm:text-sm font-black shadow-[0_0_12px_rgba(255,215,0,0.6)]`}>
                              {Number(menu.price).toLocaleString()} so'm
                            </span>
                            {qty > 0 && (
                              <span className="absolute top-1.5 right-1.5 min-w-[26px] h-[26px] px-1.5 rounded-full bg-[#FFD700] text-black text-xs font-black flex items-center justify-center shadow-[0_0_12px_rgba(255,215,0,0.8)]">
                                {qty}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col flex-1 p-3">
                            <h4 className="text-base sm:text-lg font-display font-extrabold text-[#FFE27A] group-hover:text-white transition-colors line-clamp-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
                              {menu.name}
                            </h4>
                            <p className="text-white/90 text-xs sm:text-sm mt-1 line-clamp-2 font-normal leading-snug flex-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                              {menu.retsept}
                            </p>

                            {qty === 0 ? (
                              <button
                                onClick={() => addToCart(menu)}
                                className={`mt-3 w-full py-2 rounded-lg ${goldGrad} text-black text-xs sm:text-sm font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.7)] active:scale-95`}
                              >
                                Buyurtma
                              </button>
                            ) : (
                              <div className="mt-3 flex items-center justify-between gap-2">
                                <button
                                  onClick={() => removeFromCart(menu._id)}
                                  className="w-9 h-9 rounded-lg bg-red-500/25 border border-red-400/60 text-red-300 font-black text-lg hover:bg-red-500 hover:text-white transition-all hover:scale-110"
                                >
                                  −
                                </button>
                                <span className="text-white font-black text-lg bg-black/60 border border-[#FFD700]/40 px-4 py-0.5 rounded-full">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => addToCart(menu)}
                                  className={`w-9 h-9 rounded-lg ${goldGrad} text-black font-black text-lg hover:shadow-[0_0_18px_rgba(255,215,0,0.7)] transition-all hover:scale-110`}
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
        </div>
      </div>

      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} orderId={currentOrderId} totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />
    </div>
  );
};

export default Order;
