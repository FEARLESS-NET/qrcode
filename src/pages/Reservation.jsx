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
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white px-4 sm:px-6 lg:px-10 py-28">

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-yellow-500/15 blur-[200px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-400/15 blur-[200px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="text-yellow-500 uppercase tracking-[0.5em] text-xs font-black">
            Premium Service
          </span>
          <h1 className="mt-4 text-5xl sm:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500">
            Stol Bron
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Kerakli stol va vaqtni tanlang, biz sizni kutamiz
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Jami Stollar", value: stats.total, color: "text-white" },
            { label: "Bo'sh Stollar", value: stats.available, color: "text-green-400" },
            { label: "Band Stollar", value: stats.booked, color: "text-red-400" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-yellow-500/10 backdrop-blur-xl rounded-2xl p-5 text-center"
            >
              <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-2 font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* STOLLAR */}
        <div className="mb-12">
          <h3 className="text-yellow-400 font-black uppercase tracking-widest text-sm mb-5">
            Stol tanlang
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tables.map((table) => (
              <button
                key={table._id}
                type="button"
                onClick={() => setForm({ ...form, tableId: table._id })}
                className={`
                  relative p-4 rounded-2xl border transition-all duration-300 text-left
                  ${form.tableId === table._id
                    ? "border-yellow-400 bg-yellow-500/15 shadow-[0_0_35px_rgba(255,215,0,0.2)]"
                    : table.isAvailable
                    ? "border-white/10 bg-white/[0.03] hover:border-yellow-500/40 hover:bg-yellow-500/10"
                    : "border-red-500/20 bg-red-500/5 opacity-60 cursor-not-allowed"
                  }
                `}
              >
                <p className="text-2xl font-black text-white">#{table.number}</p>
                <p className="text-gray-400 text-xs mt-1">{table.capacity} kishi</p>
                {table.location && (
                  <p className="text-gray-500 text-[10px] mt-1">{table.location}</p>
                )}
                <span
                  className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
                    table.isAvailable ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]" : "bg-red-500 shadow-[0_0_10px_rgba(248,113,113,0.3)]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 p-5 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-center text-lg">
            ✅ Broningiz qabul qilindi! Tez orada siz bilan bog'lanamiz.
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-yellow-500/15 backdrop-blur-3xl rounded-[32px] p-8 sm:p-12"
        >
          <h3 className="text-yellow-400 font-black text-2xl mb-8 uppercase tracking-wide">
            📋 Ma'lumotlaringiz
          </h3>

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
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)]"
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
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)]"
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
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)] [color-scheme:dark]"
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
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)] [color-scheme:dark]"
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
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)]"
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
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-gray-700 transition-all duration-300 focus:border-yellow-400 focus:shadow-[0_0_30px_rgba(255,215,0,0.1)]"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading || !form.tableId}
            className="mt-8 w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black font-black uppercase tracking-[0.3em] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(255,215,0,0.4)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Yuborilmoqda..." : "🪑 Stol Bron Qilish"}
          </button>

          {!form.tableId && (
            <p className="text-center text-yellow-600 text-xs mt-3 uppercase tracking-widest font-bold">
              Yuqoridan stol tanlang
            </p>
          )}
        </form>

      </div>
    </div>
  );
};

export default Reservation;