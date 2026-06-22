import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [totalReports, setTotalReports] = useState(0);

  const getReports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/reports?limit=100");
      setReports(res.data.reports || []);
      setTotalReports(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  // ─── ✅ KUNLIK HISOBOTNI RESET QILISH ──────────────────────────────────
  const handleReset = async () => {
    if (!window.confirm(
      `⚠️ KUNLIK HISOBOTNI 0 GA TIKLASH!\n\n` +
      `📌 Barcha kunlik hisobot ko'rsatkichlari 0 ga tushadi\n` +
      `📌 Order va Reservation ma'lumotlari O'ZGARMAYDI\n` +
      `📌 Bu amalni qaytarib bo'lmaydi!\n\n` +
      `Davom etasizmi?`
    )) return;

    setResetting(true);
    try {
      const res = await axiosInstance.post("/reports/reset");
      alert(`✅ ${res.data.message}`);
      getReports();
    } catch (err) {
      alert("❌ Xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteReport = async (id, reportNumber) => {
    if (!window.confirm(
      `⚠️ HISOBOTNI O'CHIRISH!\n\n` +
      `📌 Hisobot №${reportNumber}\n` +
      `📌 Bu amalni qaytarib bo'lmaydi!\n\n` +
      `Davom etasizmi?`
    )) return;

    setDeleting(true);
    try {
      const res = await axiosInstance.delete(`/reports/${id}`);
      alert(res.data.message);
      getReports();
    } catch (err) {
      alert("❌ Xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAllReports = async () => {
    if (reports.length === 0) {
      alert("O'chirish uchun hisobotlar mavjud emas!");
      return;
    }

    if (!window.confirm(
      `⚠️ BARCHA HISOBOTLARNI O'CHIRISH!\n\n` +
      `📌 ${reports.length} ta hisobot o'chiriladi\n` +
      `📌 Bu amalni qaytarib bo'lmaydi!\n\n` +
      `Davom etasizmi?`
    )) return;

    setDeleting(true);
    try {
      const res = await axiosInstance.delete("/reports");
      alert(res.data.message);
      getReports();
    } catch (err) {
      alert("❌ Xatolik: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPeriod = (report) => {
    return new Date(report.startDate).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-teal-400 font-black text-xl">📊 Kunlik Hisobot</h3>
          <p className="text-gray-500 text-sm mt-1">
            Jami: {totalReports} ta hisobot
          </p>
          <p className="text-gray-600 text-xs mt-1">
            💡 Hisobotlar zakaz yaratilganda avtomatik yangilanadi
          </p>
          <p className="text-green-400 text-xs mt-1">
            ✅ Reset faqat hisobotni 0 ga tushiradi (Order/Reservation o'zgarmaydi)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* ✅ KUNLIK RESET TUGMASI */}
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 text-sm font-bold hover:bg-orange-500 hover:text-black transition-all disabled:opacity-50"
          >
            {resetting ? "⏳..." : "🔄 Kunlik 0"}
          </button>

          <button
            onClick={handleDeleteAllReports}
            disabled={deleting || reports.length === 0}
            className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
          >
            {deleting ? "⏳..." : "🗑 Barchasini o'chirish"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 text-xs text-green-400">
        💡 <strong>Kunlik 0</strong> — faqat kunlik hisobot 0 ga tushadi.
        <br />
        📌 Order va Reservation ma'lumotlari <strong>O'ZGARMAYDI</strong> — faqat hisobot
        ko'rsatkichlari 0 bo'ladi. Yangi zakaz tushganda hisobot qayta hisoblanadi.
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 py-10">⏳ Yuklanmoqda...</div>
      )}

      {/* Reports List */}
      {!loading && reports.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          <p className="text-xl">📭 Hali hisobotlar mavjud emas</p>
          <p className="text-sm mt-2">Zakaz yaratilganda hisobotlar avtomatik yaratiladi</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report._id}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-teal-500/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">📅</span>
                  <h4 className="font-black text-white">Kunlik</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-bold">
                    №{report.reportNumber}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  📅 {formatPeriod(report)}
                </p>
                <p className="text-gray-500 text-xs">
                  🕐 {formatDate(report.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleDeleteReport(report._id, report.reportNumber)}
                disabled={deleting}
                className="text-red-400 hover:text-red-300 transition-all text-sm font-bold disabled:opacity-50"
              >
                🗑 O'chirish
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-teal-400">
                  {report.data.totalOrders}
                </p>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Zakazlar</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-yellow-400">
                  {report.data.totalRevenue?.toLocaleString()}
                </p>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Daromad</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-orange-400">
                  {report.data.totalReservations}
                </p>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Bronlar</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-green-400">
                  {report.data.averageOrderValue?.toLocaleString()}
                </p>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">O'rtacha</p>
              </div>
            </div>

            {/* Top Items */}
            {report.data.topItems?.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                  🔥 Eng ko'p sotilganlar
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.data.topItems.slice(0, 5).map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                      {item.name} ({item.quantity} dona)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {Object.entries(report.data.ordersByStatus || {}).map(([key, value]) => (
                value > 0 && (
                  <span
                    key={key}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                    style={{
                      color: key === "pending" ? "#fbbf24" :
                        key === "confirmed" ? "#34d399" :
                        key === "preparing" ? "#60a5fa" :
                        key === "ready" ? "#2dd4bf" : "#f87171",
                      borderColor: key === "pending" ? "#fbbf2440" :
                        key === "confirmed" ? "#34d39940" :
                        key === "preparing" ? "#60a5fa40" :
                        key === "ready" ? "#2dd4bf40" : "#f8717140",
                    }}
                  >
                    {key}: {value}
                  </span>
                )
              ))}
            </div>

            {/* DELETE tugmasi */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={() => handleDeleteReport(report._id, report.reportNumber)}
                disabled={deleting}
                className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
              >
                🗑 Hisobotni o'chirish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;