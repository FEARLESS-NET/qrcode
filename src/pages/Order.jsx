import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../api/axios";
import PaymentModal from "../components/PaymentModal";
import DeliveryTracker from "../components/DeliveryTracker";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3005';

const Order = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  // ✅ Telegram ulanish holati
  const [telegramLinked, setTelegramLinked] = useState(() => !!localStorage.getItem("telegramId"));
  const [telegramLinking, setTelegramLinking] = useState(false);
  const [telegramError, setTelegramError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    deliveryType: "dine-in",
    address: "",
    tableNumber: "",
    note: "",
  });

  // Menularni yuklash
  useEffect(() => {
    axiosInstance.get("/menus")
      .then((res) => {
        setMenus(Array.isArray(res.data.menus) ? res.data.menus : []);
      })
      .catch(err => console.error("Menu yuklash xatosi:", err));
  }, []);

  // ✅ Geolokatsiyani aniqlash (foydalanuvchi tugma bosganda ishga tushadi)
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

        // ✅ Koordinatadan manzilni aniqlash (reverse geocoding)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=uz`
          );
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x200?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  // ✅ Mijozni Telegram botiga ulash — token yaratib, botga yo'naltiradi,
  // so'ng natijani har 3 soniyada tekshirib turadi (polling).
 // ✅ Telegram ulanish funksiyasi (to'g'irlangan)
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
    const maxAttempts = 40; // 40 * 3s = 120s

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

 // Faqat handleSubmit funksiyasini almashtiring:

const handleSubmit = async (e) => {
  e.preventDefault();
  if (cart.length === 0) return setError("Kamida bitta taom tanlang!");

  if (form.deliveryType === "dine-in" && !form.tableNumber) {
    return setError("Dine-in uchun stol raqamini kiriting!");
  }

  if (form.deliveryType === "delivery" && !form.address.trim()) {
    return setError("Yetkazish uchun manzil kiritilishi shart!");
  }

  setLoading(true);
  setError("");
  try {
    // ✅ Lokatsiyani tayyorlash
    let locationData = location || { type: "Point", coordinates: [0, 0] };
    
    // Agar lokatsiya bo'lmasa va delivery bo'lsa, manzildan aniqlash
    if (form.deliveryType === "delivery" && form.address && (!location || location.coordinates[0] === 0)) {
      // Bu yerda manzilni koordinataga aylantirish mumkin (Geocoding API)
      // Hozircha default qoldiramiz
    }

    const orderData = {
      ...form,
      items: cart,
      totalPrice,
      tableNumber: form.deliveryType === "dine-in" ? parseInt(form.tableNumber) : null,
      location: locationData,
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      // ✅ Telegram ID (mijozning Telegram ID si)
      telegramId: localStorage.getItem('telegramId') || null,
    };

    const res = await axiosInstance.post("/orders", orderData);
    
    setCurrentOrderId(res.data.order._id);
    setLastOrder(res.data.order);
    setShowPayment(true);
    
    setCart([]);
    setForm({ customerName: "", phone: "", deliveryType: "dine-in", address: "", tableNumber: "", note: "" });
    
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white px-4 sm:px-6 lg:px-10 py-24">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(20,184,166,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(20,184,166,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
          }}
        />
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-teal-500/15 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-amber-600/15 blur-[180px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-teal-400 uppercase tracking-[0.4em] text-xs font-black">
            Online Xizmat
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-amber-400">
            Online Zakaz
          </h1>
          <p className="mt-4 text-gray-400">Taomlarni tanlang va buyurtma bering</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => navigate("/track")}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-bold hover:border-teal-500/30 hover:text-white transition-all"
            >
              🚚 Zakaz holati
            </button>
          </div>
          {locationError && (
            <p className="text-yellow-400 text-xs mt-2">⚠️ {locationError}</p>
          )}
          {location && !locationError && (
            <p className="text-green-400 text-xs mt-2">✅ Lokatsiya aniqlandi</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Menu */}
          <div className="lg:col-span-2 space-y-10">
            {Object.keys(groupedMenus).length === 0 ? (
              <div className="text-center text-gray-500 py-20">
                <p className="text-xl">Menu hali yuklanmoqda...</p>
                <p className="text-sm mt-2">Iltimos, biroz kuting</p>
              </div>
            ) : (
              Object.keys(groupedMenus).map((cat) => (
                <div key={cat}>
                  <h3 className="text-teal-400 font-bold uppercase tracking-widest text-sm mb-5 border-b border-teal-500/10 pb-3">
                    {cat}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {groupedMenus[cat].map((menu) => {
                      const qty = getQty(menu._id);
                      return (
                        <div
                          key={menu._id}
                          className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                            qty > 0
                              ? "border-teal-400/50 bg-teal-500/5 shadow-[0_0_25px_rgba(20,184,166,0.1)]"
                              : "border-white/10 bg-white/[0.03] hover:border-teal-500/30"
                          }`}
                        >
                          <img
                            src={getImageUrl(menu.image)}
                            alt={menu.name}
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                            }}
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h4 className="font-bold text-white">{menu.name}</h4>
                                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{menu.retsept}</p>
                              </div>
                              <span className="text-teal-400 font-black text-sm whitespace-nowrap">
                                {Number(menu.price).toLocaleString()} so'm
                              </span>
                            </div>

                            {qty === 0 ? (
                              <button
                                onClick={() => addToCart(menu)}
                                className="mt-4 w-full py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold text-sm transition-all hover:bg-teal-400 hover:text-black hover:scale-105"
                              >
                                + Qo'shish
                              </button>
                            ) : (
                              <div className="mt-4 flex items-center justify-between gap-3">
                                <button
                                  onClick={() => removeFromCart(menu._id)}
                                  className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-lg hover:bg-red-500 hover:text-white transition-all"
                                >
                                  −
                                </button>
                                <span className="text-white font-black text-lg">{qty}</span>
                                <button
                                  onClick={() => addToCart(menu)}
                                  className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-black text-lg hover:bg-teal-400 hover:text-black transition-all"
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

          {/* Cart + Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white/[0.03] border border-teal-500/15 backdrop-blur-3xl rounded-[24px] p-6">
                <h3 className="text-teal-400 font-black uppercase tracking-widest text-sm mb-5">
                  🛒 Savat {cart.length > 0 && `(${cart.length} xil)`}
                </h3>

                {cart.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-6">Hali hech narsa tanlanmagan</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.menuItem} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          {item.name} <span className="text-gray-600">x{item.quantity}</span>
                        </span>
                        <span className="text-teal-400 font-bold">
                          {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-white/10 pt-3 flex justify-between font-black text-lg">
                      <span>Jami:</span>
                      <span className="text-teal-400">{totalPrice.toLocaleString()} so'm</span>
                    </div>
                  </div>
                )}
              </div>

              {success && (
                <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-center">
                  ✅ Zakazingiz qabul qilindi! Tez orada bog'lanamiz.
                </div>
              )}

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-teal-500/15 backdrop-blur-3xl rounded-[24px] p-6 space-y-4">
                <h3 className="text-teal-400 font-black uppercase tracking-widest text-sm mb-2">📋 Ma'lumotlar</h3>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1 block">Ism</label>
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Sardor Alimov"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm placeholder:text-gray-700 focus:border-teal-400 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1 block">Telefon</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+998 90 000 00 00"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm placeholder:text-gray-700 focus:border-teal-400 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2 block">Tur</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "dine-in", label: "🍽 Restoran" },
                      { val: "takeaway", label: "🥡 Olib ketish" },
                      { val: "delivery", label: "🚚 Yetkazish" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setForm({ ...form, deliveryType: opt.val, address: "", tableNumber: "" })}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          form.deliveryType === opt.val
                            ? "border-teal-400 bg-teal-500/10 text-teal-400"
                            : "border-white/10 bg-white/[0.03] text-gray-500 hover:border-teal-500/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.deliveryType === "dine-in" && (
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1 block">Stol raqami *</label>
                    <input
                      name="tableNumber"
                      type="number"
                      value={form.tableNumber}
                      onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                      placeholder="12"
                      required
                      min={1}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm placeholder:text-gray-700 focus:border-teal-400 transition-all"
                    />
                  </div>
                )}

                {form.deliveryType === "delivery" && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block">Manzil *</label>
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={locationLoading}
                        className="text-[10px] font-bold text-teal-400 hover:text-teal-300 transition-all disabled:opacity-50 whitespace-nowrap"
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
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm placeholder:text-gray-700 focus:border-teal-400 transition-all"
                    />
                    {locationError && (
                      <p className="text-yellow-400 text-[10px] mt-1">⚠️ {locationError}</p>
                    )}
                    {location && !locationError && (
                      <p className="text-green-400 text-[10px] mt-1">✅ Aniq joylashuv olindi — kuryer xaritada ko'radi</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1 block">Izoh</label>
                  <input
                    name="note"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Qo'shimcha izoh..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm placeholder:text-gray-700 focus:border-teal-400 transition-all"
                  />
                </div>

                {/* ✅ Telegram orqali ulanish — zakaz holati haqida shaxsiy xabar olish uchun */}
                <div className="p-3 rounded-xl border border-teal-500/15 bg-teal-500/5">
                  {telegramLinked ? (
                    <p className="text-green-400 text-xs font-bold text-center">
                      ✅ Telegram ulangan — zakaz holati haqida shu yerga xabar olasiz
                    </p>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={connectTelegram}
                        disabled={telegramLinking}
                        className="w-full py-2.5 rounded-xl border border-teal-500/30 text-teal-400 text-xs font-bold hover:bg-teal-500/10 transition-all disabled:opacity-50"
                      >
                        {telegramLinking ? "⏳ Kutilmoqda... (botda Start bosing)" : "📲 Telegram orqali ulanish"}
                      </button>
                      <p className="text-gray-500 text-[10px] mt-2 text-center">
                        Ulansangiz, zakaz holati haqida Telegram orqali xabar olasiz
                      </p>
                      {telegramError && (
                        <p className="text-red-400 text-[10px] mt-1 text-center">{telegramError}</p>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-amber-400 text-black font-black uppercase tracking-[0.2em] text-sm transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(20,184,166,0.4)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "⏳ Yuborilmoqda..." : "🛒 Zakaz Berish"}
                </button>
              </form>

              {/* Zakaz holatini kuzatish */}
              <button
                onClick={() => navigate("/track")}
                className="w-full py-3 rounded-xl border border-teal-500/20 text-teal-400 text-sm font-bold hover:bg-teal-500/10 transition-all"
              >
                🚚 Zakaz holatini kuzatish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        orderId={currentOrderId}
        totalPrice={totalPrice}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Order;