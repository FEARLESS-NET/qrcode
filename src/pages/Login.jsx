import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Sahifa yuklanganda inputlarni tozalash
  useEffect(() => {
    setForm({ email: "", password: "" });
  }, []); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "123456";

    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      localStorage.setItem("auth", "true");
      
      // Kirishdan oldin stateni tozalash (xavfsizlik va tozalik uchun)
      setForm({ email: "", password: "" });
      
      navigate("/admin", { replace: true });
    } else {
      setError("Email yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1220] flex flex-col p-10">
      <div className="w-full py-4 border-b border-white/10 flex justify-center">
        <div className="flex items-center gap-2 text-white font-bold tracking-wider">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">🍽️</div>
          <span>RESTAURANT</span>
          <span className="text-white/60 text-sm font-normal ml-2">FOOD MANAGEMENT SYSTEM</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Brauzer eslab qolmasligi uchun autoComplete="off" qo'shildi */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-2xl">👤</div>
            </div>

            <h2 className="text-center text-2xl font-bold text-gray-800">Staff Login</h2>
            <p className="text-center text-sm text-gray-500 mt-1 mb-6">Tizimga kirish uchun ma'lumotlaringizni kiriting</p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm text-gray-600">Email</label>
              <input
                name="email"
                required
                onChange={handleChange}
                value={form.email}
                type="email"
                autoComplete="new-password" 
                placeholder="admin emailngizni kriting"
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Parol</label>
              <input
                name="password"
                required
                onChange={handleChange}
                value={form.password}
                type="password"
                autoComplete="new-password"
                placeholder="••••••"
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-transform active:scale-95"
            >
              Kirish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}