import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        background: "#e9edc9",
        borderTop: "1px solid rgba(212,163,115,0.2)",
        padding: "3rem 1.5rem 2rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-black mb-2" style={{ color: "#3d3522" }}>
              Hire<span style={{ color: "#d4a373" }}>Sense</span>
              <span
                className="ml-2 text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded align-middle"
                style={{ color: "#a08c6a", border: "1px solid rgba(212,163,115,0.4)" }}
              >
                AI
              </span>
            </h3>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: "#6b5f3e" }}>
              AI-powered resume analysis and candidate ranking for modern recruitment teams.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a08c6a" }}>
                Navigate
              </p>
              <div className="space-y-2">
                {["/#hero", "/#analyze", "/#results", "/#history"].map((href, i) => (
                  <a
                    key={href}
                    href={href}
                    className="block text-sm transition"
                    style={{ color: "#6b5f3e" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#d4a373"}
                    onMouseLeave={e => e.currentTarget.style.color = "#6b5f3e"}
                  >
                    {["Home", "Analyze", "Results", "History"][i]}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a08c6a" }}>
                Account
              </p>
              <div className="space-y-2">
                {[
                  { to: "/profile",  label: "Profile"  },
                  { to: "/login",    label: "Login"    },
                  { to: "/register", label: "Register" },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="block text-sm transition"
                    style={{ color: "#6b5f3e" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#d4a373"}
                    onMouseLeave={e => e.currentTarget.style.color = "#6b5f3e"}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3"
          style={{ borderTop: "1px solid rgba(212,163,115,0.2)" }}
        >
          <p className="text-xs" style={{ color: "#c4b49a" }}>
            © {year} HireSense AI. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#c4b49a" }}>
            Built with ❤️ for modern recruiters
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
