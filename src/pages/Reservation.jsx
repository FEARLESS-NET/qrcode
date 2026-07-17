import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";

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
    <div className="relative min-h-screen overflow-hidden text-white px-4 sm:px-6 lg:px-10 py-28 bg-[#130e0a]">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80&fm=webp"
          alt="Restaurant background"
          className="w-full h-full object-cover opacity-20"
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
        
        {/* Ember particles */}
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
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#FFC93C]/20 bg-[#FFC93C]/10 backdrop-blur-xl mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFDD73] animate-pulse"></div>
            <span className="text-[#FFDD73] uppercase tracking-[0.4em] text-[11px] font-black">
              ✨ Premium Service
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFEBB0] via-[#FFA23D] to-[#FF5A1F] drop-shadow-[0_0_50px_rgba(255,180,40,0.15)]">
            Stol Bron
          </h1>
          <p className="mt-4 text-gray-400 text-lg font-light tracking-wider">
            Kerakli stol va vaqtni tanlang, biz sizni kutamiz
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span>Jonli mavjudlik</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span>Band</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Jami Stollar", value: stats.total, color: "text-white", icon: "🪑" },
            { label: "Bo'sh Stollar", value: stats.available, color: "text-green-400", icon: "✅" },
            { label: "Band Stollar", value: stats.booked, color: "text-red-400", icon: "🔴" },
          ].map((s, i) => (
            <div
              key={i}
              className="group bg-white/[0.03] border border-[#FFC93C]/10 backdrop-blur-xl rounded-2xl p-5 text-center hover:border-[#FFC93C]/30 hover:shadow-[0_0_30px_rgba(255,180,40,0.05)] transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className={`text-4xl font-black ${s.color} transition-all duration-300 group-hover:scale-110`}>{s.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-2 font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table Selection */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-5 border-b border-[#FFC93C]/15 pb-4">
            <span className="text-2xl">🪑</span>
            <h3 className="text-[#FFDD73] font-black uppercase tracking-widest text-sm">Stol tanlang</h3>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#FFC93C]/30 to-transparent"></div>
            <span className="text-xs text-gray-500">{tables.filter(t => t.isAvailable).length} ta bo'sh</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tables.map((table) => (
              <button
                key={table._id}
                type="button"
                onClick={() => setForm({ ...form, tableId: table._id })}
                className={`
                  group relative p-4 rounded-2xl border transition-all duration-500 text-left backdrop-blur-sm
                  ${form.tableId === table._id
                    ? "border-[#FFDD73] bg-[#FFC93C]/20 shadow-[0_0_40px_rgba(255,180,40,0.3)] scale-[1.05]"
                    : table.isAvailable
                    ? "border-white/10 bg-white/[0.03] hover:border-[#FFC93C]/40 hover:bg-[#FFC93C]/10 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(255,180,40,0.08)]"
                    : "border-red-500/20 bg-red-500/5 opacity-60 cursor-not-allowed"
                  }
                `}
                disabled={!table.isAvailable}
              >
                {table.isAvailable && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFC93C]/5 via-transparent to-[#FF5A1F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                )}
                
                {form.tableId === table._id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FFDD73] flex items-center justify-center text-black text-xs font-black animate-pulse">
                    ✓
                  </div>
                )}

                <div className="relative z-10">
                  <p className={`text-2xl font-black transition-colors ${form.tableId === table._id ? 'text-[#FFDD73]' : 'text-white group-hover:text-[#FFDD73]'}`}>
                    #{table.number}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{table.capacity} kishi</p>
                  {table.location && (
                    <p className="text-gray-500 text-[10px] mt-1">{table.location}</p>
                  )}
                </div>

                <span
                  className={`absolute top-3 right-3 w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    table.isAvailable 
                      ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)] animate-pulse" 
                      : "bg-red-500 shadow-[0_0_15px_rgba(248,113,113,0.3)]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-5 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-center text-lg backdrop-blur-xl animate-fadeInUp">
            ✅ Broningiz qabul qilindi! Tez orada siz bilan bog'lanamiz.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-center backdrop-blur-xl animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-[#FFC93C]/15 backdrop-blur-3xl rounded-[32px] p-8 sm:p-12 hover:border-[#FFC93C]/30 transition-all duration-500 shadow-[0_0_60px_rgba(255,180,40,0.05)]"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">📋</span>
            <h3 className="text-[#FFDD73] font-black text-2xl uppercase tracking-wide">Ma'lumotlaringiz</h3>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#FFC93C]/30 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[#FFC93C] font-black mb-2 block">
                Ism Familiya
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Sardor Alimov"
                required
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 transition-all duration-300 focus:border-[#FFDD73] focus:shadow-[0_0_30px_rgba(255,180,40,0.1)] hover:border-[#FFC93C]/40"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[#FFC93C] font-black mb-2 block">
                Telefon Raqam
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                required
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 transition-all duration-300 focus:border-[#FFDD73] focus:shadow-[0_0_30px_rgba(255,180,40,0.1)] hover:border-[#FFC93C]/40"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[#FFC93C] font-black mb-2 block">
                Sana
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                min={today}
                required
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-[#FFDD73] focus:shadow-[0_0_30px_rgba(255,180,40,0.1)] hover:border-[#FFC93C]/40 [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[#FFC93C] font-black mb-2 block">
                Vaqt
              </label>
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-[#FFDD73] focus:shadow-[0_0_30px_rgba(255,180,40,0.1)] hover:border-[#FFC93C]/40 [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[#FFC93C] font-black mb-2 block">
                Mehmonlar Soni
              </label>
              <input
                name="guestCount"
                type="number"
                value={form.guestCount}
                onChange={handleChange}
                min={1}
                max={20}
                required
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-[#FFDD73] focus:shadow-[0_0_30px_rgba(255,180,40,0.1)] hover:border-[#FFC93C]/40"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-[#FFC93C] font-black mb-2 block">
                Izoh (ixtiyoriy)
              </label>
              <input
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Tug'ilgan kun, alergiya..."
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 transition-all duration-300 focus:border-[#FFDD73] focus:shadow-[0_0_30px_rgba(255,180,40,0.1)] hover:border-[#FFC93C]/40"
              />
            </div>
          </div>

          {/* Telegram */}
          <div className="mt-6 p-4 rounded-xl border border-[#FFC93C]/15 bg-[#FFC93C]/5 hover:border-[#FFC93C]/30 transition-all duration-300">
            {telegramLinked ? (
              <p className="text-green-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                <span className="text-lg">✅</span> Telegram ulangan — bron tasdiqlanganda xabar olasiz
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={connectTelegram}
                  disabled={telegramLinking}
                  className="w-full py-3 rounded-xl border border-[#FFC93C]/30 text-[#FFDD73] text-sm font-bold hover:bg-[#FFC93C]/10 transition-all disabled:opacity-50 hover:scale-[1.02] relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <span className="relative z-10">
                    {telegramLinking ? "⏳ Kutilmoqda... (botda Start bosing)" : "📲 Telegram orqali ulanish"}
                  </span>
                </button>
                <p className="text-gray-500 text-[10px] mt-2 text-center">
                  Ulansangiz, bron tasdiqlanganda Telegram orqali xabar olasiz
                </p>
                {telegramError && (
                  <p className="text-red-400 text-[10px] mt-1 text-center">{telegramError}</p>
                )}
              </>
            )}
          </div>

          {!form.tableId && (
            <div className="mt-6 p-4 rounded-xl bg-[#FFC93C]/10 border border-[#FFC93C]/20 text-[#FFDD73] text-xs text-center font-bold uppercase tracking-widest animate-pulse">
              ⚠️ Yuqoridan stol tanlang
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !form.tableId}
            className="mt-8 w-full py-5 rounded-2xl bg-gradient-to-r from-[#FFDD73] via-[#E08A3C] to-[#FF5A1F] text-black font-black uppercase tracking-[0.3em] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(255,180,40,0.4)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition duration-500"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
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
          background: radial-gradient(circle, #FFDD73, #E08A3C);
          border-radius: 50%;
          pointer-events: none;
          animation: floatUp linear infinite;
          box-shadow: 0 0 10px rgba(255, 180, 40, 0.3);
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
          0%, 100% { box-shadow: 0 0 20px rgba(255, 180, 40, 0.2); }
          50% { box-shadow: 0 0 40px rgba(255, 180, 40, 0.4); }
        }
      `}</style>
    </div>
  );
};

export default Reservation;