import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";

const Reservation = () => {
  const [tables, setTables] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, booked: 0 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    tableId: "",
    date: "",
    time: "",
    guestCount: 1,
    note: "",
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/reservations", form);
      setSuccess(true);
      setForm({
        customerName: "",
        phone: "",
        tableId: "",
        date: "",
        time: "",
        guestCount: 1,
        note: "",
      });
      getTables();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative min-h-screen overflow-hidden text-white px-4 sm:px-6 lg:px-10 py-28">

      {/* ===== BACKGROUND IMAGE ===== */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
          alt="Restaurant background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 via-transparent to-amber-500/5"></div>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,215,0,0.03) 50px, rgba(255,215,0,0.03) 51px),
            repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(255,215,0,0.03) 50px, rgba(255,215,0,0.03) 51px)
          `
        }}></div>
        {/* Gold Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-yellow-500/15 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-400/15 blur-[200px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-yellow-500/20 bg-yellow-500/10 backdrop-blur-xl mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-yellow-400 uppercase tracking-[0.4em] text-[11px] font-black">
              🐟 Premium Service
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 drop-shadow-[0_0_50px_rgba(255,215,0,0.15)]">
            Stol Bron
          </h1>
          <p className="mt-4 text-gray-400 text-lg font-light tracking-wider">
            Kerakli stol va vaqtni tanlang, biz sizni kutamiz
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Jami Stollar", value: stats.total, color: "text-white", icon: "🪑" },
            { label: "Bo'sh Stollar", value: stats.available, color: "text-green-400", icon: "✅" },
            { label: "Band Stollar", value: stats.booked, color: "text-red-400", icon: "🔴" },
          ].map((s, i) => (
            <div
              key={i}
              className="group bg-white/[0.03] border border-yellow-500/10 backdrop-blur-xl rounded-2xl p-5 text-center hover:border-yellow-500/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.05)] transition-all duration-500"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className={`text-4xl font-black ${s.color} transition-all duration-300 group-hover:scale-110`}>{s.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-2 font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* TABLES */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-5 border-b border-yellow-500/15 pb-4">
            <span className="text-2xl">🪑</span>
            <h3 className="text-yellow-400 font-black uppercase tracking-widest text-sm">Stol tanlang</h3>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-yellow-500/30 to-transparent"></div>
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
                    ? "border-yellow-400 bg-yellow-500/15 shadow-[0_0_35px_rgba(255,215,0,0.2)] scale-[1.05]"
                    : table.isAvailable
                    ? "border-white/10 bg-white/[0.03] hover:border-yellow-500/40 hover:bg-yellow-500/10 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,215,0,0.05)]"
                    : "border-red-500/20 bg-red-500/5 opacity-60 cursor-not-allowed"
                  }
                `}
              >
                {/* Hover Glow */}
                {table.isAvailable && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                )}
                
                <div className="relative z-10">
                  <p className="text-2xl font-black text-white group-hover:text-yellow-400 transition-colors">#{table.number}</p>
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

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 p-5 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-center text-lg backdrop-blur-xl animate-fadeInUp">
            ✅ Broningiz qabul qilindi! Tez orada siz bilan bog'lanamiz.
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-center backdrop-blur-xl animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-yellow-500/15 backdrop-blur-3xl rounded-[32px] p-8 sm:p-12 hover:border-yellow-500/30 transition-all duration-500"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">📋</span>
            <h3 className="text-yellow-400 font-black text-2xl uppercase tracking-wide">Ma'lumotlaringiz</h3>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-yellow-500/30 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-yellow-500 font-black mb-2 block">
                Ism Familiya
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Sardor Alimov"
                required
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:border-yellow-500/40"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-yellow-500 font-black mb-2 block">
                Telefon Raqam
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                required
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:border-yellow-500/40"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-yellow-500 font-black mb-2 block">
                Sana
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                min={today}
                required
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:border-yellow-500/40 [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-yellow-500 font-black mb-2 block">
                Vaqt
              </label>
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:border-yellow-500/40 [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-yellow-500 font-black mb-2 block">
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
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:border-yellow-500/40"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.35em] text-yellow-500 font-black mb-2 block">
                Izoh (ixtiyoriy)
              </label>
              <input
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Tug'ilgan kun, alergiya..."
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:border-yellow-500/40"
              />
            </div>

          </div>

          {!form.tableId && (
            <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs text-center font-bold uppercase tracking-widest">
              ⚠️ Yuqoridan stol tanlang
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !form.tableId}
            className="mt-8 w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black font-black uppercase tracking-[0.3em] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(255,215,0,0.4)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition duration-500"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative z-10">
              {loading ? "⏳ Yuborilmoqda..." : "🪑 Stol Bron Qilish"}
            </span>
          </button>

        </form>

      </div>
    </div>
  );
};

export default Reservation;