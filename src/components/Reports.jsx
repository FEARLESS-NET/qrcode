import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const getReports = async () => {
    setLoading(true);
    try {
      const url = filterType === "all" ? "/reports" : `/reports?type=${filterType}`;
      const res = await axiosInstance.get(url);
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, [filterType]);

  const generateReport = async (type) => {
    setGenerating(true);
    try {
      await axiosInstance.post(`/reports/${type}`);
      getReports();
    } catch (err) {
      alert("Hisobot yaratishda xatolik");
    } finally {
      setGenerating(false);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Bu hisobotni o'chirmoqchimisiz?")) return;
    try {
      await axiosInstance.delete(`/reports/${id}`);
      getReports();
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  const deleteAllReports = async () => {
    if (!window.confirm("Barcha hisobotlarni o'chirmoqchimisiz?")) return;
    try {
      await axiosInstance.delete("/reports");
      getReports();
    } catch (err) {
      alert("O'chirishda xatolik");
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

  const typeLabels = {
    daily: "📅 Kunlik",
    weekly: "📆 Haftalik",
    monthly: "📊 Oylik",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-cyan-400 font-black text-xl">📊 Hisobotlar</h3>
          <p className="text-gray-500 text-sm mt-1">Kunlik, haftalik va oylik statistikalar</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => generateReport("daily")}
            disabled={generating}
            className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500 hover:text-black transition-all"
          >
            📅 Kunlik
          </button>
          <button
            onClick={() => generateReport("weekly")}
            disabled={generating}
            className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all"
          >
            📆 Haftalik
          </button>
          <button
            onClick={() => generateReport("monthly")}
            disabled={generating}
            className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-bold hover:bg-purple-500 hover:text-white transition-all"
          >
            📊 Oylik
          </button>
          <button
            onClick={deleteAllReports}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
          >
            🗑 Barchasini o'chirish
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "daily", "weekly", "monthly"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterType === type
                ? "bg-cyan-400 text-black"
                : "bg-white/5 border border-white/10 text-gray-400 hover:border-cyan-500/30"
            }`}
          >
            {type === "all" ? "Hammasi" : typeLabels[type]}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 py-10">⏳ Yuklanmoqda...</div>
      )}

      {/* Reports List */}
      {!loading && reports.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          <p className="text-xl">📭 Hali hisobotlar mavjud emas</p>
          <p className="text-sm mt-2">Yuqoridagi tugmalardan hisobot yarating</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report._id}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {report.type === "daily" ? "📅" : report.type === "weekly" ? "📆" : "📊"}
                  </span>
                  <h4 className="font-black text-white">
                    {typeLabels[report.type] || report.type}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {report.period}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  {formatDate(report.createdAt)}
                </p>
              </div>
              <button
                onClick={() => deleteReport(report._id)}
                className="text-red-400 hover:text-red-300 transition-all text-sm"
              >
                🗑
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-cyan-400">
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
                <p className="text-2xl font-black text-purple-400">
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
                             key === "ready" ? "#22d3ee" : "#f87171",
                      borderColor: key === "pending" ? "#fbbf2440" : 
                                   key === "confirmed" ? "#34d39940" :
                                   key === "preparing" ? "#60a5fa40" :
                                   key === "ready" ? "#22d3ee40" : "#f8717140",
                    }}
                  >
                    {key}: {value}
                  </span>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;