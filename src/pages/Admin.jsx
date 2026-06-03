import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) navigate("/login");
  }, [navigate]);

  const [menus, setMenus] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    retsept: "",
    image: "",
    category: "",
  });

  const getMenus = async () => {
    try {
      const res = await axiosInstance.get("/menus");
      setMenus(res.data.menus || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMenus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ TUZATILDI: price String emas, Number bo'lishi kerak
      const formData = {
        ...form,
        price: Number(form.price),
      };

      if (editingId) {
        const { _id, __v, createdAt, updatedAt, ...updateData } = formData;
        await axiosInstance.put(`/menus/${editingId}`, updateData);
        setEditingId(null);
      } else {
        await axiosInstance.post("/menus", formData);
      }

      setForm({ name: "", price: "", retsept: "", image: "", category: "" });
      getMenus();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return alert("ID topilmadi!");
    if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
      try {
        await axiosInstance.delete(`/menus/${id}`);
        getMenus();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (menu) => {
    setForm(menu);
    setEditingId(menu._id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white px-4 sm:px-6 lg:px-10 py-10 ">

      {/* MATRIX BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020617]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
          }}
        />
        <div className="absolute top-[-15%] left-[-10%] w-[650px] h-[650px] bg-cyan-500/20 blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[650px] h-[650px] bg-purple-600/20 blur-[180px] animate-pulse delay-700"></div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, rgba(255,255,255,0.12) 1px, transparent 2px)",
            backgroundSize: "100% 6px",
          }}
        ></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-12 border-b border-cyan-500/20 pb-7">
          <div>
            <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              ADMIN PANEL
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Restoran menyusini boshqarish tizimi
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="relative overflow-hidden px-6 py-3 rounded-2xl border border-red-500/40 text-red-400 backdrop-blur-xl transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-[0_0_35px_rgba(239,68,68,0.7)] active:scale-95"
          >
            🚪 Chiqish
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden bg-white/[0.03] border border-cyan-500/20 backdrop-blur-3xl rounded-[30px] p-5 sm:p-8 mb-12 transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_0_80px_rgba(0,255,255,0.18)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-cyan-400 font-black text-lg sm:text-2xl mb-8 tracking-wide animate-pulse">
              {editingId ? "📝 MENU TAHRIRLASH" : "➕ YANGI MENU QO'SHISH"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Object.keys(form)
                .filter((key) => key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt")
                .map((key) => (
                  <div key={key} className="group">
                    <label className="text-xs uppercase tracking-[0.25em] text-gray-500">
                      {key === "name" ? "Nomi" :
                       key === "price" ? "Narxi (so'm)" :
                       key === "retsept" ? "Retsept" :
                       key === "image" ? "Rasm URL" :
                       key === "category" ? "Kategoriya" : key}
                    </label>
                    <input
                      value={form[key] || ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={key}
                      type={key === "price" ? "number" : "text"} // ✅ price uchun number input
                      min={key === "price" ? "0" : undefined}
                      className="w-full mt-2 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(0,255,255,0.35)] hover:border-cyan-500/30 hover:bg-black/50"
                      required
                    />
                  </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="submit"
                className="relative overflow-hidden px-8 py-4 rounded-2xl font-black tracking-wide text-black bg-cyan-400 transition-all duration-300 hover:scale-105 hover:bg-cyan-300 hover:shadow-[0_0_40px_rgba(0,255,255,0.7)] active:scale-95"
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition"></span>
                {editingId ? "Yangilash" : "Saqlash"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", price: "", retsept: "", image: "", category: "" });
                  }}
                  className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-cyan-400/40 hover:scale-105 transition-all duration-300"
                >
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
        </form>

        {/* MENU CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {menus.map((menu) => (
            <div
              key={menu._id}
              className="group relative overflow-hidden rounded-[30px] border border-cyan-500/20 bg-white/[0.03] backdrop-blur-3xl transition-all duration-500 hover:scale-[1.04] hover:border-cyan-400/50 hover:shadow-[0_0_70px_rgba(0,255,255,0.22)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>

              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={menu.image || "https://via.placeholder.com/400x300?text=No+Image"}
                  alt={menu.name}
                  className="w-full h-full object-cover brightness-75 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-black/70 border border-cyan-400/30 px-4 py-2 rounded-xl text-cyan-400 text-xs uppercase tracking-widest backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                  {menu.category}
                </div>
              </div>

              {/* CONTENT */}
              <div className="relative z-10 p-6">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-all duration-300">
                    {menu.name}
                  </h3>
                  <span className="text-green-400 font-black text-lg group-hover:scale-125 transition-all duration-300">
                    {Number(menu.price).toLocaleString()} so'm
                  </span>
                </div>

                <p className="text-gray-400 text-sm mt-4 leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-all duration-300">
                  {menu.retsept}
                </p>

                <div className="mt-6 h-[3px] w-14 rounded-full overflow-hidden bg-white/10 group-hover:w-full transition-all duration-500">
                  <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-pulse"></div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleEdit(menu)}
                    className="flex-1 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-semibold transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(250,204,21,0.6)]"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(menu._id)}
                    className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Admin;
