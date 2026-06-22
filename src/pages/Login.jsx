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

    if (
      form.email === ADMIN_EMAIL &&
      form.password === ADMIN_PASSWORD
    ) {
      localStorage.setItem("auth", "true");
      setForm({ email: "", password: "" });
      navigate("/admin", { replace: true });
    } else {
      setError("Email yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] flex flex-col font-sans text-white p-10">

      {/* GOLD CYBER BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">

        {/* BASE */}
        <div className="absolute inset-0 bg-[#050505]"></div>

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,215,0,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,215,0,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
          }}
        ></div>

        {/* GOLD GLOW */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] md:w-[650px] h-[350px] md:h-[650px] bg-yellow-500/20 rounded-full blur-[160px] animate-pulse"></div>

        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] md:w-[650px] h-[350px] md:h-[650px] bg-amber-400/20 rounded-full blur-[160px] animate-pulse delay-700"></div>

        {/* SCANLINES */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, rgba(255,255,255,0.08) 1px, transparent 2px)",
            backgroundSize: "100% 6px",
          }}
        ></div>

      </div>

      {/* HEADER */}
      <div className="relative z-10 w-full py-5 border-b border-yellow-500/10 backdrop-blur-xl flex justify-center px-4">

        <div className="flex items-center gap-4">

          {/* ICON */}
          <div
            className="
              w-12 h-12
              rounded-2xl
              bg-gradient-to-br
              from-yellow-400
              via-amber-500
              to-orange-500
              flex items-center justify-center
              text-2xl
              shadow-[0_0_35px_rgba(255,215,0,0.4)]
            "
          >
            🐟
          </div>

          {/* TEXT */}
          <div className="flex flex-col">

            <span
              className="
                text-lg sm:text-xl
                font-black
                tracking-[0.25em]
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-yellow-300
                via-amber-400
                to-orange-500
              "
            >
              SAZANCHIK
            </span>

            <span className="text-[10px] tracking-[0.35em] text-gray-500 uppercase">
              MANAGEMENT SYSTEM
            </span>

          </div>

        </div>

      </div>

      {/* LOGIN */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-[420px]">

          <div className="relative group">

            {/* OUTER GLOW */}
            <div
              className="
                absolute -inset-[1px]
                rounded-[2rem]
                bg-gradient-to-r
                from-yellow-500
                via-amber-400
                to-orange-500
                opacity-20
                blur
                group-hover:opacity-50
                transition-all duration-700
              "
            ></div>

            {/* CARD */}
            <form
              onSubmit={handleSubmit}
              className="
                relative
                bg-black/50
                backdrop-blur-3xl
                border border-yellow-500/10
                rounded-[2rem]
                p-6 sm:p-10
                overflow-hidden
                shadow-[0_0_60px_rgba(255,215,0,0.08)]
              "
            >

              {/* CARD GLOW */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 pointer-events-none"></div>

              {/* ICON */}
              <div className="flex justify-center mb-7">

                <div
                  className="
                    relative
                    w-20 h-20
                    rounded-3xl
                    bg-gradient-to-br
                    from-yellow-400
                    via-amber-500
                    to-orange-500
                    flex items-center justify-center
                    text-4xl
                    shadow-[0_0_40px_rgba(255,215,0,0.45)]
                  "
                >
                  👑

                  <div className="absolute inset-0 rounded-3xl border border-white/20"></div>

                </div>

              </div>

              {/* TITLE */}
              <h2
                className="
                  text-center
                  text-3xl sm:text-4xl
                  font-black
                  tracking-wide
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-yellow-300
                  via-amber-400
                  to-orange-500
                "
              >
                STAFF LOGIN
              </h2>

              <p className="text-center text-sm text-gray-500 mt-3 mb-8 tracking-wide">
                Secure Golden Access Panel
              </p>

              {/* ERROR */}
              {error && (
                <div
                  className="
                    mb-6
                    p-4
                    rounded-2xl
                    bg-red-500/10
                    border border-red-500/20
                    text-red-400
                    text-sm
                    text-center
                    font-bold
                    backdrop-blur-xl
                  "
                >
                  ⚠️ {error}
                </div>
              )}

              {/* INPUTS */}
              <div className="space-y-5">

                {/* EMAIL */}
                <div>

                  <label className="text-[11px] uppercase tracking-[0.3em] text-yellow-500 font-black ml-1 mb-2 block">
                    Admin Email
                  </label>

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
                      border border-yellow-500/10
                      rounded-2xl
                      px-5 py-4
                      outline-none
                      text-white
                      placeholder:text-gray-700
                      transition-all duration-300
                      focus:border-yellow-400
                      focus:shadow-[0_0_30px_rgba(255,215,0,0.25)]
                      hover:border-yellow-500/30
                    "
                  />

                </div>

                {/* PASSWORD */}
                <div>

                  <label className="text-[11px] uppercase tracking-[0.3em] text-yellow-500 font-black ml-1 mb-2 block">
                    Password
                  </label>

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
                      border border-yellow-500/10
                      rounded-2xl
                      px-5 py-4
                      outline-none
                      text-white
                      placeholder:text-gray-700
                      transition-all duration-300
                      focus:border-yellow-400
                      focus:shadow-[0_0_30px_rgba(255,215,0,0.25)]
                      hover:border-yellow-500/30
                    "
                  />

                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="
                    relative overflow-hidden
                    w-full
                    mt-3
                    py-4
                    rounded-2xl
                    bg-gradient-to-r
                    from-yellow-400
                    via-amber-500
                    to-orange-500
                    text-black
                    font-black
                    uppercase
                    tracking-[0.25em]
                    transition-all duration-300
                    hover:scale-[1.03]
                    hover:shadow-[0_0_40px_rgba(255,215,0,0.55)]
                    active:scale-[0.98]
                  "
                >

                  <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition"></span>

                  Kirish

                </button>

              </div>

            </form>

          </div>

          {/* FOOTER */}
          <p className="text-center text-gray-700 text-[10px] mt-10 uppercase tracking-[0.45em]">
            © 2026 SAZANCHIK SECURE NODE
          </p>

        </div>

      </div>

    </div>
  );
}