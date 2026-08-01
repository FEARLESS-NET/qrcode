/**
 * LOGIN PAGE – ADMIN KIRISH
 * Admin login sahifasi. Email va parol tekshiruvi.
 * Muvaffaqiyatli bo‘lsa, localStorage.setItem('auth','true') va /admin ga yo‘naltirish.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      navigate("/admin", { replace: true });
    }
    setForm({ email: "", password: "" });
    setError("");
    setSuccess(false);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "123456";

    if (!form.email.trim() || !form.password.trim()) {
      setError("⚠️ Iltimos, email va parolni kiriting!");
      setLoading(false);
      return;
    }

    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      localStorage.setItem("auth", "true");
      setSuccess(true);
      setForm({ email: "", password: "" });
      setLoading(false);
      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 500);
    } else {
      setError("❌ Email yoki parol noto'g'ri!");
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({ email: "", password: "" });
    setError("");
    setSuccess(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col text-white p-4 sm:p-10 font-display">

      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
          alt="Restaurant interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFC93C]/5 via-transparent to-[#E08A3C]/5"></div>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,180,40,0.03) 50px, rgba(255,180,40,0.03) 51px),
            repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(255,180,40,0.03) 50px, rgba(255,180,40,0.03) 51px)
          `
        }}></div>
      </div>

      <div className="relative z-10 w-full py-6 border-b border-[#FFC93C]/30 backdrop-blur-3xl flex justify-center px-4 bg-black/40 rounded-2xl">

        <div className="flex items-center gap-5">

          <div
            className="seal-frame w-16 h-16 text-4xl transform hover:scale-110 transition-all duration-500"
          >
            <img className="rounded-full w-full h-full object-cover" src="/QOZONDA.jpg"/>
          </div>

          <div className="flex flex-col">

            <span
              className="
                text-2xl sm:text-3xl
                font-display
                font-bold
                tracking-[0.35em]
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-[#FFEBB0]
                via-[#FFDD73]
                to-[#FF7A3D]
                drop-shadow-[0_0_40px_rgba(255,180,40,0.3)]
              "
            >
              QOZONDA
            </span>

            <span className="text-[10px] tracking-[0.5em] text-[#FFC93C]/60 uppercase font-light">
              PREMIUM RESTAURANT
            </span>

          </div>

        </div>

      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-[460px]">

          <div className="relative group">

            <div
              className="
                absolute -inset-[3px]
                rounded-[3rem]
                bg-gradient-to-r
                from-[#FFDD73]
                via-[#FFA23D]
                to-[#FF5A1F]
                opacity-30
                blur-2xl
                group-hover:opacity-60
                transition-all duration-1000
                animate-pulse
              "
            ></div>

            <form
              onSubmit={handleSubmit}
              className="
                relative
                bg-black/60
                backdrop-blur-4xl
                border border-[#FFC93C]/20
                rounded-[3rem]
                p-8 sm:p-14
                overflow-hidden
                shadow-[0_0_100px_rgba(255,180,40,0.05)]
                hover:shadow-[0_0_120px_rgba(255,180,40,0.1)]
                transition-all duration-700
              "
            >

              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC93C]/10 via-transparent to-[#FF5A1F]/10 pointer-events-none"></div>

              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#FFC93C]/20 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#FFC93C]/20 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#FFC93C]/20 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#FFC93C]/20 rounded-br-3xl"></div>

              <div className="flex justify-center mb-10">

                <div
                  className="
                    seal-frame
                    relative
                    w-28 h-28
                    text-6xl
                    transform hover:scale-110 hover:rotate-6 transition-all duration-500
                  "
                >
                   <img className="rounded-full w-full h-full object-cover" src="/QOZONDA.jpg"/>

                  <div className="absolute -inset-4 rounded-full border border-[#FFC93C]/20 animate-ping opacity-30"></div>

                </div>

              </div>

              <h2
                className="
                  text-center
                  text-5xl sm:text-6xl
                  font-display
                  font-bold
                  tracking-wide
                  text-gold-gradient
                "
              >
                QOZONDA LOGIN
              </h2>

              <p className="text-center text-sm text-[#FFC93C]/60 mt-4 mb-10 tracking-[0.3em] uppercase font-light">
                XIMOYA TIZIMI BOLIMII
              </p>

              {success && (
                <div
                  className="
                    mb-6
                    p-5
                    rounded-2xl
                    bg-green-500/15
                    border border-green-500/30
                    text-green-400
                    text-sm
                    text-center
                    font-bold
                    backdrop-blur-xl
                    animate-fadeInUp
                  "
                >
                  ✅ Login muvaffaqiyatli! Admin panelga o'tilmoqda...
                </div>
              )}

              {error && (
                <div
                  className="
                    mb-6
                    p-5
                    rounded-2xl
                    bg-red-500/15
                    border border-red-500/30
                    text-red-400
                    text-sm
                    text-center
                    font-bold
                    backdrop-blur-xl
                    animate-shake
                  "
                >
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-7">

                <div>
                  <label className="text-[10px] uppercase tracking-[0.4em] text-[#FFC93C]/80 font-bold ml-1 mb-2 block">
                    Admin Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFC93C]/40 text-lg">✉</span>
                    <input
                      name="email"
                      required
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@gmail.com"
                      className="
                        w-full
                        bg-black/60
                        border border-[#FFC93C]/15
                        rounded-2xl
                        pl-12 pr-5 py-4
                        outline-none
                        text-white text-sm
                        placeholder:text-gray-700
                        transition-all duration-300
                        focus:border-[#FFDD73]
                        focus:shadow-[0_0_40px_rgba(255,180,40,0.15)]
                        hover:border-[#FFC93C]/40
                        font-display
                      "
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.4em] text-[#FFC93C]/80 font-bold ml-1 mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFC93C]/40 text-lg">🔒</span>
                    <input
                      name="password"
                      required
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="
                        w-full
                        bg-black/60
                        border border-[#FFC93C]/15
                        rounded-2xl
                        pl-12 pr-5 py-4
                        outline-none
                        text-white text-sm
                        placeholder:text-gray-700
                        transition-all duration-300
                        focus:border-[#FFDD73]
                        focus:shadow-[0_0_40px_rgba(255,180,40,0.15)]
                        hover:border-[#FFC93C]/40
                        font-display
                      "
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full mt-2 !text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "⏳ Kutilmoqda..." : "Kirish"}
                </button>

              </div>

            </form>

          </div>

          <p className="text-center text-gray-700/60 text-[10px] mt-12 uppercase tracking-[0.5em] font-light">
            © 2026 QOZONDA | MILLIY TAOMLAR
          </p>

        </div>

      </div>

    </div>
  );
}