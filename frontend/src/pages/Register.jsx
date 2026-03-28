import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#c0392b", "#b07d2c", "#2d7a5f", "#1a6648"];
  return { score, label: labels[score], color: colors[score] };
};

const Register = () => {
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = getStrength(form.password);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/register", form);
      alert("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fefae0 0%, #faedcd 50%, #e9edc9 100%)" }}
    >
      {/* Background gradient orbs — fixed positioning */}
      <div
        className="absolute rounded-full blur-[100px] pointer-events-none"
        style={{ top: "25%", left: "25%", width: "24rem", height: "24rem", background: "rgba(212,163,115,0.2)" }}
      />
      <div
        className="absolute rounded-full blur-[80px] pointer-events-none"
        style={{ bottom: "25%", right: "25%", width: "20rem", height: "20rem", background: "rgba(204,213,174,0.25)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-black" style={{ color: "#3d3522" }}>
                Hire<span style={{ color: "#d4a373" }}>Sense</span>
                <span className="ml-2 text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded align-middle"
                  style={{ color: "#a08c6a", border: "1px solid rgba(212,163,115,0.4)" }}>
                  AI
                </span>
              </h1>
            </Link>
            <h2 className="text-2xl font-bold mt-4" style={{ color: "#3d3522" }}>Create account</h2>
            <p className="text-sm mt-1" style={{ color: "#a08c6a" }}>Start your AI-powered hiring journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "#6b5f3e" }}>
                Full Name
              </label>
              <input type="text" name="name" placeholder="Your full name"
                value={form.name} onChange={handleChange} required
                className="input-premium" />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "#6b5f3e" }}>
                Email
              </label>
              <input type="email" name="email" placeholder="you@company.com"
                value={form.email} onChange={handleChange} required
                className="input-premium" />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "#6b5f3e" }}>
                Password
              </label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} name="password" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required
                  className="input-premium pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                  style={{ color: "#a08c6a" }}>
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="strength-bar flex-1" style={{
                        background: i <= strength.score ? strength.color : "rgba(212,163,115,0.15)"
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.7rem", color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-premium w-full py-4 mt-2 disabled:opacity-60" style={{ borderRadius: "0.875rem" }}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Creating account...</span>
                : "Create Account"
              }
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#a08c6a" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold transition" style={{ color: "#d4a373" }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;