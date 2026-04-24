import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axios";

const Admin = () => {
  const [menus, setMenus] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    descr: "",
    retsept: "",
    image: "",
    category: "",
  });

  const getMenus = async () => {
    const res = await axiosInstance.get("/menus");
    setMenus(res.data.menus);
  };

  useEffect(() => {
    getMenus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // UPDATE
      await axiosInstance.put(`/menus/${editingId}`, form);
      setEditingId(null);
    } else {
      // CREATE
      await axiosInstance.post("/menus", form);
    }

    setForm({
      name: "",
      descr: "",
      retsept: "",
      image: "",
      category: "",
    });

    getMenus();
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/menus/${id}`);
    getMenus();
  };

  const handleEdit = (menu) => {
    setForm({
      name: menu.name,
      descr: menu.descr,
      retsept: menu.retsept,
      image: menu.image,
      category: menu.category,
    });
    setEditingId(menu.id);
  };

  return (
    <div className="min-h-screen bg-black text-white px-10 py-10">

      <h2 className="text-3xl font-bold mb-6">
        {editingId ? "Edit Menu" : "Admin Panel"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-10 space-y-4 border border-white/20"
      >
        <input
          placeholder="Name"
          className="w-full p-2 rounded bg-black/40"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
        />

        <input
          placeholder="Descr"
          className="w-full p-2 rounded bg-black/40"
          value={form.descr}
          onChange={(e) => setForm({...form, descr: e.target.value})}
        />

        <input
          placeholder="Retsept"
          className="w-full p-2 rounded bg-black/40"
          value={form.retsept}
          onChange={(e) => setForm({...form, retsept: e.target.value})}
        />

        <input
          placeholder="Image URL"
          className="w-full p-2 rounded bg-black/40"
          value={form.image}
          onChange={(e) => setForm({...form, image: e.target.value})}
        />

        <input
          placeholder="Category"
          className="w-full p-2 rounded bg-black/40"
          value={form.category}
          onChange={(e) => setForm({...form, category: e.target.value})}
        />

        <div className="flex gap-3">
          <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:scale-105 transition">
            {editingId ? "Update" : "Add Menu"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  descr: "",
                  retsept: "",
                  image: "",
                  category: "",
                });
              }}
              className="bg-gray-500 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20"
          >
            <img
              src={menu.image}
              className="h-40 w-full object-cover rounded mb-3"
            />

            <h3 className="font-bold">{menu.name}</h3>
            <p>{menu.descr}</p>
            <p>🍴 {menu.retsept}</p>

            <span className="text-yellow-400">{menu.category}</span>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(menu)}
                className="bg-blue-500 px-3 py-1 rounded hover:scale-105 transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(menu.id)}
                className="bg-red-500 px-3 py-1 rounded hover:scale-105 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Admin;