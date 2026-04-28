import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  // 🔐 PROTECTION
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/login"); 
    }
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
      setMenus(res.data.menus);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
    }
  };

  useEffect(() => {
    getMenus();
  }, []);

  // 🔓 LOGOUT
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
    if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
      await axiosInstance.delete(`/menus/${id}`);
      getMenus();
    }
  };

  const handleEdit = (menu) => {
    setForm(menu);
    setEditingId(menu.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 md:p-10">
      
      {/* HEADER SECTION - Logout dashboard ichiga joylandi */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            ⚡ Admin Dashboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">Restoran menyusini boshqarish paneli</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 text-red-500 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20"
        >
          <span>🚪</span>
          <span className="hidden md:inline font-medium">Chiqish</span>
        </button>
      </div>

      {/* FORM SECTION */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 mb-10 shadow-[0_0_40px_rgba(0,255,255,0.1)] hover:shadow-cyan-500/30 transition duration-500"
      >
        <h3 className="text-lg font-semibold mb-6 text-cyan-400">
          {editingId ? "📝 Taomni tahrirlash" : "➕ Yangi taom qo'shish"}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {Object.keys(form).map((key, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase ml-1">{key}</label>
              <input
                placeholder={`${key} ni kiriting...`}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="inputAdmin w-full"
                required
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <button className="btnPrimary flex-1 md:flex-none">
            {editingId ? "Yangilash" : "Saqlash"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", price: "", retsept: "", image: "", category: "" });
              }}
              className="btnCancel"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      {/* CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="card group bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300"
          >
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={menu.image || "https://via.placeholder.com/150"}
                alt={menu.name}
                className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <span className="text-cyan-400 text-xs font-bold uppercase">{menu.category}</span>
              </div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold truncate">{menu.name}</h3>
              <span className="text-green-400 font-mono font-bold">{menu.price}</span>
            </div>
            
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">🍴 {menu.retsept}</p>

            <div className="flex gap-2 pt-4 border-t border-white/5">
              <button
                onClick={() => handleEdit(menu)}
                className="btnEdit flex-1"
              >
                Tahrirlash
              </button>

              <button
                onClick={() => handleDelete(menu.id)}
                className="btnDelete flex-1"
              >
                O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Admin;