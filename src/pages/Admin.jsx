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

    if (editingId) {
      await axiosInstance.put(`/menus/${editingId}`, form);
      setEditingId(null);
    } else {
      await axiosInstance.post("/menus", form);
    }

    setForm({ name: "", price: "", retsept: "", image: "", category: "" });
    getMenus();
  };

  const handleDelete = async (id) => {
    if (window.confirm("O‘chirishni tasdiqlaysizmi?")) {
      await axiosInstance.delete(`/menus/${id}`);
      getMenus();
    }
  };

  const handleEdit = (menu) => {
    setForm(menu);
    setEditingId(menu.id);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 sm:px-6 lg:px-10 py-10 relative overflow-hidden">

      {/* 🔥 BACKGROUND ENERGY */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-cyan-500/20 blur-[160px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-purple-500/20 blur-[160px] animate-pulse" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-white/10 pb-6">

        <div>
          <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
            ⚡ Admin Dashboard
          </h2>
          <p className="text-gray-500 text-sm">
            Restoran menyusini boshqarish paneli
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-xl border border-red-500/40 text-red-400
          hover:bg-red-500 hover:text-white transition-all duration-300
          hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] hover:scale-105 active:scale-95"
        >
          🚪 Chiqish
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-5 sm:p-8 rounded-2xl mb-10
        transition-all duration-500 hover:shadow-[0_0_60px_rgba(6,182,212,0.25)] hover:scale-[1.01]"
      >
        <h3 className="text-cyan-400 font-bold mb-6 animate-pulse">
          {editingId ? "📝 Tahrirlash" : "➕ Yangi taom qo'shish"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {Object.keys(form).map((key) => (
            <div key={key}>
              <label className="text-xs text-gray-400 uppercase">{key}</label>

              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={key}
                className="w-full mt-1 bg-black/40 border border-white/10
                focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.5)]
                px-4 py-3 rounded-xl outline-none transition-all duration-300
                hover:scale-[1.01]"
                required
              />
            </div>
          ))}

        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">

          <button className="flex-1 sm:flex-none px-6 py-3 bg-cyan-500 text-black font-bold rounded-xl
          hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]
          transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden">

            <span className="absolute inset-0 bg-white/20 animate-pulse opacity-0 hover:opacity-100"></span>

            {editingId ? "Yangilash" : "Saqlash"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", price: "", retsept: "", image: "", category: "" });
              }}
              className="px-6 py-3 border border-white/20 rounded-xl
              hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Bekor qilish
            </button>
          )}

        </div>
      </form>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {menus.map((menu) => (
          <div
            key={menu.id}
            className="group relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden
            transition-all duration-500 hover:scale-[1.05] hover:-rotate-1
            hover:border-cyan-400/70 hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]"
          >

            {/* IMAGE */}
            <div className="relative h-48 overflow-hidden">

              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-full object-cover
                group-hover:scale-125 group-hover:rotate-2
                transition-all duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70
              group-hover:opacity-40 transition" />

              <div className="absolute top-2 right-2 bg-black/60 px-3 py-1 rounded-full text-cyan-400 text-xs
              border border-white/20 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition">
                {menu.category}
              </div>

            </div>

            {/* CONTENT */}
            <div className="p-4">

              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg truncate group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">
                  {menu.name}
                </h3>

                <span className="text-green-400 font-bold group-hover:scale-125 transition">
                  {menu.price}
                </span>
              </div>

              <p className="text-gray-400 text-sm mt-2 line-clamp-2 group-hover:text-gray-200 transition">
                {menu.retsept}
              </p>

              {/* animated line */}
              <div className="mt-4 h-1 w-12 bg-white/10 rounded-full overflow-hidden group-hover:w-full transition-all duration-500">
                <div className="h-full w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse"></div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => handleEdit(menu)}
                  className="flex-1 py-2 rounded-lg bg-yellow-500/20 text-yellow-400
                  hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_25px_rgba(234,179,8,0.6)]
                  transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Tahrirlash
                </button>

                <button
                  onClick={() => handleDelete(menu.id)}
                  className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400
                  hover:bg-red-500 hover:text-white hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]
                  transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  O'chirish
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default Admin;