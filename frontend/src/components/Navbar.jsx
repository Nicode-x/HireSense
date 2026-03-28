import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    const sections = ["hero", "analyze", "results", "history"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (!user && id === "history") {
      navigate("/login");
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "hero",    label: "Home"    },
    { id: "analyze", label: "Analyze" },
    { id: "results", label: "Results" },
    { id: "history", label: "History" },
  ];

  const navBg = scrolled
    ? "rgba(254,250,224,0.85)"
    : "rgba(254,250,224,0.55)";
  const navBorder = "rgba(212,163,115,0.2)";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "py-3 shadow-[0_4px_32px_rgba(61,53,34,0.1)]" : "py-5"
      }`}
      style={{
        background: navBg,
        backdropFilter: scrolled ? "blur(24px)" : "blur(8px)",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "blur(8px)",
        borderBottom: scrolled ? `1px solid ${navBorder}` : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-1 group">
          <span className="text-2xl font-black tracking-tight group-hover:opacity-80 transition" style={{ color: "#3d3522" }}>
            Hire<span style={{ color: "#d4a373" }}>Sense</span>
          </span>
          <span className="ml-1 text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
            style={{ color: "#a08c6a", border: "1px solid rgba(212,163,115,0.4)" }}>
            AI
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`nav-link ${activeSection === link.id ? "active" : ""}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition"
                style={{
                  background: "rgba(212,163,115,0.12)",
                  border: "1px solid rgba(212,163,115,0.3)"
                }}
              >
                {user.avatar_url ? (
                  <img
                    src={`http://localhost:5000${user.avatar_url}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "#d4a373", color: "#fff" }}>
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium" style={{ color: "#3d3522" }}>{user.name}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  style={{ color: "#a08c6a" }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 p-2 animate-fadeIn"
                  style={{
                    borderRadius: "1rem",
                    background: "rgba(254,250,224,0.96)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(212,163,115,0.25)",
                    boxShadow: "0 20px 60px rgba(61,53,34,0.15)",
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition"
                    style={{ color: "#3d3522" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(212,163,115,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition text-left mt-1"
                    style={{ color: "#c0392b" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(192,57,43,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-outline text-sm px-5 py-2">Sign In</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition"
          style={{ color: "#6b5f3e" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 pb-6 pt-2 space-y-1"
          style={{
            background: "rgba(254,250,224,0.96)",
            backdropFilter: "blur(24px)",
            borderTop: "1px solid rgba(212,163,115,0.2)"
          }}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left px-4 py-3 rounded-xl text-sm transition"
              style={{ color: "#3d3522" }}
            >
              {link.label}
            </button>
          ))}
          {user && (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm transition"
                style={{ color: "#3d3522" }}>
                Profile
              </Link>
              <button onClick={handleLogout}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm transition"
                style={{ color: "#c0392b" }}>
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;