/**
 * RESERVATION PAGE – STOL BRON QILISH
 * Stollar statistikasi (jami, bo'sh, band).
 * Stol tanlash (interaktiv tugmalar).
 * Forma: Ism, telefon, sana, vaqt, mehmonlar soni, izoh, Telegram ulanish.
 * Yuborilganda admin Telegram xabar oladi, mijoz tasdiqlanganda xabar oladi.
 */
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";

/* Qayta ishlatiladigan stillar (oltin + qora) */
const goldGrad = "bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#B8860B]";
const goldText =
  "text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3B0] via-[#FFD700] to-[#E0A100]";
const labelCls =
  "text-[11px] uppercase tracking-[0.3em] text-[#FFE27A] font-extrabold mb-2 block";
const inputCls =
  "w-full bg-black/70 border border-[#FFD700]/30 rounded-2xl px-5 py-4 outline-none text-white font-medium placeholder:text-gray-400 transition-all duration-300 focus:border-[#FFD700] focus:shadow-[0_0_28px_rgba(255,215,0,0.3)] hover:border-[#FFD700]/60";

const Reservation = () => {
  const [tables, setTables] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, booked: 0 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [telegramLinked, setTelegramLinked] = useState(() => !!localStorage.getItem("telegramId"));
  const [telegramLinking, setTelegramLinking] = useState(false);
  const [telegramError, setTelegramError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    tableId: "",
    date: "",
    time: "",
    guestCount: 1,
    note: "",
    telegramId: localStorage.getItem("telegramId") || null,
  });

  const getTables = async () => {
    try {
      const res = await axiosInstance.get("/tables");
      setTables(res.data.tables || []);
      setStats(res.data.stats || { total: 0, available: 0, booked: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTables();
  }, []);

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
            setForm((prev) => ({ ...prev, telegramId: data.telegramId }));
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const submitData = {
        ...form,
        telegramId: localStorage.getItem("telegramId") || null,
      };

      await axiosInstance.post("/reservations", submitData);

      setSuccess(true);
      setForm({
        customerName: "",
        phone: "",
        tableId: "",
        date: "",
        time: "",
        guestCount: 1,
        note: "",
        telegramId: localStorage.getItem("telegramId") || null,
      });
      getTables();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("❌ Xatolik:", err);
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative min-h-screen overflow-hidden text-white px-3 sm:px-6 lg:px-10 py-24 sm:py-28 bg-black">
      {/* FON */}
      <div className="fixed inset-0 z-0">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80&fm=webp"
          alt="Restaurant background"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/75 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 via-transparent to-[#B8860B]/10"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FFD700]/15 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#B8860B]/20 blur-[200px] animate-pulse delay-700" />

        {[...Array(16)].map((_, i) => (
          <span
            key={`far-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 6.2 + 2) % 100}%`,
              '--size': `${2 + (i % 3)}px`,
              filter: 'blur(0.5px)',
              opacity: 0.45,
              animationDuration: `${9 + (i % 6) * 1.4}s`,
              animationDelay: `${i * 0.6}s`,
              '--drift': `${((i % 5) - 2) * 30}px`,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <span
            key={`near-${i}`}
            className="ember-particle"
            style={{
              left: `${(i * 8.1 + 6) % 100}%`,
              '--size': `${4 + (i % 4)}px`,
              animationDuration: `${6 + (i % 4) * 1.2}s`,
              animationDelay: `${i * 0.5}s`,
              '--drift': `${((i % 3) - 1) * 55}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* SARLAVHA */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#FFD700]/50 bg-[#FFD700]/10 backdrop-blur-xl mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700] animate-pulse"></div>
            <span className="text-[#FFE27A] uppercase tracking-[0.4em] text-[11px] font-black">
              ✨ Premium Service
            </span>
          </div>
          <h1 className={`text-5xl sm:text-7xl font-black uppercase tracking-tight ${goldText} drop-shadow-[0_0_40px_rgba(255,215,0,0.35)]`}>
            Stol Bron
          </h1>
          <p className="mt-4 text-white text-base sm:text-lg font-medium tracking-wider [text-shadow:0_2px_6px_rgba(0,0,0,0.9)]">
            Kerakli stol va vaqtni tanlang, biz sizni kutamiz
          </p>
          <div className="mt-5 flex justify-center gap-5">
            <div className="flex items-center gap-2 text-xs text-gray-100 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
              <span>Jonli mavjudlik</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-100 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"></span>
              <span>Band</span>
            </div>
          </div>
        </div>

        {/* STATISTIKA */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-12">
          {[
            { label: "Jami Stollar", value: stats.total, color: "text-white", icon: "🪑" },
            { label: "Bo'sh Stollar", value: stats.available, color: "text-green-400", icon: "✅" },
            { label: "Band Stollar", value: stats.booked, color: "text-red-400", icon: "🔴" },
          ].map((s, i) => (
            <div
              key={i}
              className="group bg-gradient-to-b from-[#1c1503] to-black border border-[#FFD700]/40 rounded-2xl p-4 sm:p-5 text-center shadow-[0_0_18px_rgba(255,215,0,0.12)] hover:border-[#FFD700] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="text-2xl sm:text-3xl mb-2">{s.icon}</div>
              <p className={`text-3xl sm:text-4xl font-black ${s.color} transition-all duration-300 group-hover:scale-110`}>{s.value}</p>
              <p className="text-[#F5E6B8] text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-2 font-extrabold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* STOL TANLASH */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 border-b border-[#FFD700]/40 pb-4">
            <span className="text-2xl">🪑</span>
            <h3 className={`font-black uppercase tracking-widest text-sm sm:text-base ${goldText}`}>Stol tanlang</h3>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#FFD700]/50 to-transparent"></div>
            <span className="text-xs text-[#FFE27A] font-bold">{tables.filter(t => t.isAvailable).length} ta bo'sh</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tables.map((table) => (
              <button
                key={table._id}
                type="button"
                onClick={() => setForm({ ...form, tableId: table._id })}
                className={`
                  group relative p-4 rounded-2xl border-2 transition-all duration-300 text-left
                  ${form.tableId === table._id
                    ? "border-[#FFD700] bg-gradient-to-br from-[#FFD700]/30 to-[#B8860B]/20 shadow-[0_0_40px_rgba(255,215,0,0.55)] scale-[1.05]"
                    : table.isAvailable
                    ? "border-[#FFD700]/40 bg-gradient-to-b from-[#1c1503] to-black hover:border-[#FFD700] hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(255,215,0,0.4)]"
                    : "border-red-500/40 bg-red-500/10 opacity-60 cursor-not-allowed"
                  }
                `}
                disabled={!table.isAvailable}
              >
                {form.tableId === table._id && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#FFD700] flex items-center justify-center text-black text-sm font-black shadow-[0_0_15px_rgba(255,215,0,0.9)] animate-pulse">
                    ✓
                  </div>
                )}

                <div className="relative z-10">
                  <p className={`text-2xl font-black transition-colors ${form.tableId === table._id ? 'text-white' : 'text-[#FFD700] group-hover:text-white'}`}>
                    #{table.number}
                  </p>
                  <p className="text-white/90 text-xs sm:text-sm font-semibold mt-1">{table.capacity} kishi</p>
                  {table.location && (
                    <p className="text-[#F5E6B8] text-[11px] mt-1 font-medium">{table.location}</p>
                  )}
                </div>

                <span
                  className={`absolute top-3 right-3 w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    table.isAvailable
                      ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-pulse"
                      : "bg-red-500 shadow-[0_0_15px_rgba(248,113,113,0.6)]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {success && (
          <div className="mb-6 p-5 rounded-2xl bg-green-500/20 border border-green-400/60 text-green-300 font-bold text-center text-lg backdrop-blur-xl animate-fadeInUp">
            ✅ Broningiz qabul qilindi! Tez orada siz bilan bog'lanamiz.
          </div>
        )}

        {error && (
          <div className="mb-6 p-5 rounded-2xl bg-red-500/20 border border-red-400/60 text-red-300 font-bold text-center backdrop-blur-xl animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* FORMA */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-b from-[#1c1503] to-black border border-[#FFD700]/40 rounded-[28px] sm:rounded-[32px] p-6 sm:p-12 hover:border-[#FFD700]/70 transition-all duration-500 shadow-[0_0_50px_rgba(255,215,0,0.15)]"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">📋</span>
            <h3 className={`font-black text-xl sm:text-2xl uppercase tracking-wide ${goldText}`}>Ma'lumotlaringiz</h3>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#FFD700]/50 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Ism Familiya</label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Sardor Alimov"
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Telefon Raqam</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Sana</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                min={today}
                required
                className={`${inputCls} [color-scheme:dark]`}
              />
            </div>

            <div>
              <label className={labelCls}>Vaqt</label>
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
                className={`${inputCls} [color-scheme:dark]`}
              />
            </div>

            <div>
              <label className={labelCls}>Mehmonlar Soni</label>
              <input
                name="guestCount"
                type="number"
                value={form.guestCount}
                onChange={handleChange}
                min={1}
                max={20}
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Izoh (ixtiyoriy)</label>
              <input
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Tug'ilgan kun, alergiya..."
                className={inputCls}
              />
            </div>
          </div>

          {/* TELEGRAM */}
          <div className="mt-6 p-4 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/5 hover:border-[#FFD700]/60 transition-all duration-300">
            {telegramLinked ? (
              <p className="text-green-300 text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2">
                <span className="text-lg">✅</span> Telegram ulangan — bron tasdiqlanganda xabar olasiz
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={connectTelegram}
                  disabled={telegramLinking}
                  className="w-full py-3 rounded-xl border border-[#FFD700]/50 text-[#FFD700] text-sm font-extrabold hover:bg-[#FFD700] hover:text-black transition-all disabled:opacity-50 hover:scale-[1.02] relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative z-10">
                    {telegramLinking ? "⏳ Kutilmoqda... (botda Start bosing)" : "📲 Telegram orqali ulanish"}
                  </span>
                </button>
                <p className="text-gray-200 text-xs mt-2 text-center">
                  Ulansangiz, bron tasdiqlanganda Telegram orqali xabar olasiz
                </p>
                {telegramError && (
                  <p className="text-red-300 text-xs mt-1 text-center font-semibold">{telegramError}</p>
                )}
              </>
            )}
          </div>

          {!form.tableId && (
            <div className="mt-6 p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/50 text-[#FFE27A] text-xs text-center font-extrabold uppercase tracking-widest animate-pulse">
              ⚠️ Yuqoridan stol tanlang
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !form.tableId}
            className={`mt-8 w-full py-5 rounded-2xl ${goldGrad} text-black font-black uppercase tracking-[0.3em] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative z-10">
              {loading ? "⏳ Yuborilmoqda..." : "🪑 Stol Bron Qilish"}
            </span>
          </button>
        </form>
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
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-glowPulse {
          animation: glowPulse 2s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }
      `}</style>
    </div>
  );
};

export default Reservation;
