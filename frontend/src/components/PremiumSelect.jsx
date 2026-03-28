import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PremiumSelect = ({ value, options, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className="filter-premium w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate pr-4 block w-full text-left" style={{ color: "#3d3522" }}>
          {selectedOption?.label || "Select..."}
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "#a08c6a" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2"
            style={{
              borderRadius: "1.25rem",
              background: "rgba(254,250,224,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(212,163,115,0.3)",
              boxShadow: "0 20px 60px rgba(61,53,34,0.18), 0 0 30px rgba(212,163,115,0.08)",
            }}
          >
            <div className="max-h-64 overflow-y-auto" style={{ scrollbarWidth: "none", padding: "0.5rem" }}>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="w-full text-left px-4 py-3 rounded-[0.85rem] text-sm transition-all mb-1 last:mb-0"
                  style={{
                    background: value === opt.value ? "rgba(212,163,115,0.2)" : "transparent",
                    color: value === opt.value ? "#3d3522" : "#6b5f3e",
                    fontWeight: value === opt.value ? 700 : 400,
                  }}
                  onMouseEnter={e => {
                    if (value !== opt.value) e.currentTarget.style.background = "rgba(212,163,115,0.1)";
                  }}
                  onMouseLeave={e => {
                    if (value !== opt.value) e.currentTarget.style.background = "transparent";
                  }}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={value === opt.value}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{opt.label}</span>
                    {value === opt.value && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4"
                        style={{ color: "#d4a373" }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumSelect;
