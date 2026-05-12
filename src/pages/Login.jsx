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

      {/* BACKGROUND - Glow effektlari */}
      <div className="absolute top-[-10%] left-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER */}
      <div className="w-full py-5 border-b border-white/5 flex justify-center backdrop-blur-md z-10 px-4">
        <div className="flex items-center gap-3 text-white font-black tracking-[0.2em]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-300 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-xl">🍽️</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg leading-none">RESTAURANT</span>
            <span className="text-[9px] text-gray-500 font-medium">MANAGEMENT SYSTEM</span>
          </div>
        </div>
      </div>

      {/* FORM WRAPPER */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        
        {/* Karta kengligi: Telefonda deyarli to'liq (w-full), Kompyuterda max 400px */}
        <div className="w-full max-w-[400px]">

          <div className="relative group">
            {/* Glow animatsiyasi */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-[2rem] blur opacity-10 group-hover:opacity-30 transition duration-700"></div>

            <form
              onSubmit={handleSubmit}
              className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl"
            >

              {/* ICON */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-orange-500 text-3xl">
                  👤
                </div>
              </div>

              <h2 className="text-center text-2xl sm:text-3xl font-black text-white">
                Staff Login
              </h2>

              <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 mb-8">
                Xush kelibsiz, tizimga kiring
              </p>

              {/* ERROR */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-bold">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1 mb-2 block">
                    Admin Email
                  </label>
                  <input
                    name="email"
                    required
                    onChange={handleChange}
                    value={form.email}
                    type="email"
                    placeholder="admin@gmail.com"
                    className="w-full bg-black/60 border border-white/10 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 outline-none px-4 py-3.5 rounded-xl text-white transition-all placeholder:text-gray-700 text-sm"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1 mb-2 block">
                    Password
                  </label>
                  <input
                    name="password"
                    required
                    onChange={handleChange}
                    value={form.password}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/60 border border-white/10 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 outline-none px-4 py-3.5 rounded-xl text-white transition-all placeholder:text-gray-700 text-sm"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full mt-4 py-4 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-[0.98] transition-all font-black uppercase tracking-widest text-black shadow-lg shadow-orange-500/20"
                >
                  Kirish
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-gray-700 text-[10px] mt-10 uppercase tracking-[0.3em]">
            © 2026 Secured Access Node
          </p>

        </div>
      </div>
    </div>
  );
}