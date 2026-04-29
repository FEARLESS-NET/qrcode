import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
      setForm({ email: "", password: "" });
      navigate("/admin", { replace: true });
    } else {
      setError("Email yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden font-sans">
      
      {/* BACKGROUND */}
      <div className="absolute top-[-10%] left-[-10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />

      {/* HEADER */}
      <div className="w-full py-4 sm:py-6 border-b border-white/5 flex justify-center backdrop-blur-md z-10 px-4">
        <div className="flex items-center gap-3 text-white font-black tracking-[0.2em] text-center sm:text-left">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-300 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-lg sm:text-xl">🍽️</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-lg leading-none">RESTAURANT</span>
            <span className="text-[8px] sm:text-[10px] text-gray-500 font-medium">
              MANAGEMENT SYSTEM
            </span>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="flex-1 flex items-center justify-center px-4 z-10">
        <div className="w-full max-w-sm sm:max-w-md">
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <form
              onSubmit={handleSubmit}
              className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-orange-500 text-2xl sm:text-3xl">
                  👤
                </div>
              </div>

              <h2 className="text-center text-2xl sm:text-3xl font-black text-white">
                Staff Login
              </h2>

              <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 mb-8">
                Xush kelibsiz, tizimga kiring
              </p>

              {error && (
                <div className="mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] sm:text-xs rounded-2xl text-center font-bold">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-5 sm:space-y-6">

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold ml-2">
                    Admin Email
                  </label>
                  <input
                    name="email"
                    required
                    onChange={handleChange}
                    value={form.email}
                    type="email"
                    placeholder="email@example.com"
                    className="w-full bg-black/40 border border-white/5 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-white transition-all placeholder:text-gray-700"
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold ml-2">
                    Password
                  </label>
                  <input
                    name="password"
                    required
                    onChange={handleChange}
                    value={form.password}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/5 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-white transition-all placeholder:text-gray-700"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full py-3 sm:py-4 rounded-2xl bg-orange-500 text-black font-black uppercase tracking-widest active:scale-95 transition"
                >
                  Kirish
                </button>

              </div>
            </form>
          </div>

          <p className="text-center text-gray-600 text-[8px] sm:text-[10px] mt-8 sm:mt-10 uppercase tracking-[0.3em]">
            © 2026 Secured Access Node
          </p>
        </div>
      </div>
    </div>
  );
}