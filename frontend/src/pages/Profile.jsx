import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile]           = useState(null);
  const [stats, setStats]               = useState(null);
  const [nameEdit, setNameEdit]         = useState("");
  const [editingName, setEditingName]   = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [msg, setMsg]                   = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get("/auth/profile"),
          api.get("/auth/stats"),
        ]);
        setProfile(profileRes.data);
        setNameEdit(profileRes.data.name);
        setStats(statsRes.data);
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, ...profileRes.data }));
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleNameSave = async () => {
    if (!nameEdit.trim() || nameEdit.trim() === profile.name) { setEditingName(false); return; }
    try {
      setSaving(true);
      await api.put("/auth/profile", { name: nameEdit.trim() });
      setProfile((p) => ({ ...p, name: nameEdit.trim() }));
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name: nameEdit.trim() }));
      showMsg("Name updated successfully!");
      setEditingName(false);
    } catch (err) {
      showMsg(err.response?.data?.message || "Failed to update name.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      setAvatarUploading(true);
      const res = await api.post("/auth/avatar", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setProfile((p) => ({ ...p, avatar_url: res.data.avatar_url }));
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, avatar_url: res.data.avatar_url }));
      showMsg("Profile photo updated!");
    } catch (err) {
      showMsg(err.response?.data?.message || "Failed to upload photo.");
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
    }
  };

  const avatarSrc = avatarPreview || profile?.avatar_url;

  if (loading) {
    return (
      <div
        style={{ background: "#fefae0", minHeight: "100vh" }}
        className="flex items-center justify-center"
      >
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(160deg, #fefae0 0%, #faedcd 100%)", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-28">
        {/* Toast notification */}
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-6 z-50 glass-card px-5 py-3 text-sm font-medium"
            style={{ borderRadius: "0.75rem", color: "#3d3522" }}
          >
            ✓ {msg}
          </motion.div>
        )}

        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm transition"
            style={{ color: "#a08c6a" }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4a373"}
            onMouseLeave={e => e.currentTarget.style.color = "#a08c6a"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 md:p-10 mb-6">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar */}
            <div className="flex-shrink-0 relative group">
              <div
                className="w-28 h-28 rounded-3xl overflow-hidden flex items-center justify-center"
                style={{ background: "rgba(212,163,115,0.15)", border: "2px solid rgba(212,163,115,0.3)" }}
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black" style={{ color: "#d4a373" }}>
                    {profile?.name?.[0]?.toUpperCase()}
                  </span>
                )}
                {avatarUploading && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-3xl">
                    <div className="spinner" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition hover:scale-110"
                style={{ background: "#d4a373", color: "#fff" }}
                title="Change photo"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>

            {/* Info */}
            <div className="flex-1">
              {editingName ? (
                <div className="flex gap-3 items-center mb-2">
                  <input
                    value={nameEdit}
                    onChange={(e) => setNameEdit(e.target.value)}
                    className="input-premium text-xl font-bold py-2"
                    onKeyDown={(e) => { if (e.key === "Enter") handleNameSave(); if (e.key === "Escape") setEditingName(false); }}
                    autoFocus
                  />
                  <button onClick={handleNameSave} disabled={saving} className="btn-premium px-4 py-2 text-sm">
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button onClick={() => setEditingName(false)} className="btn-outline px-4 py-2 text-sm">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold" style={{ color: "#3d3522" }}>{profile?.name}</h2>
                  <button
                    onClick={() => setEditingName(true)}
                    className="transition"
                    style={{ color: "#a08c6a" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#d4a373"}
                    onMouseLeave={e => e.currentTarget.style.color = "#a08c6a"}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-sm" style={{ color: "#a08c6a" }}>{profile?.email}</p>
              {profile?.created_at && (
                <p className="text-xs mt-2" style={{ color: "#c4b49a" }}>
                  Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-5"
          >
            {[
              { label: "Total Analyses", value: stats.total_analyses || 0, suffix: "" },
              { label: "Average Score",  value: stats.avg_score     || 0, suffix: "%" },
              { label: "Highest Score",  value: stats.highest_score || 0, suffix: "%" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-6 text-center">
                <p className="text-3xl font-black" style={{ color: "#d4a373" }}>{s.value}{s.suffix}</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "#a08c6a" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
