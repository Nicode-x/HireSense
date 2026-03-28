import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

const formatJobRole = (desc) => {
  if (!desc) return "Unknown Role";
  let cleaned = desc.replace(/^(Job Title|Role|Position|Looking for|We are hiring a|We are looking for a|Title)[\s:-]*/i, '');
  let title = cleaned.split(/[\n|.,]/)[0].trim();
  if (title.length > 40) title = title.substring(0, 37) + "...";
  return title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const getScoreColor = (score) => {
  if (score >= 80) return "#2d7a5f";
  if (score >= 50) return "#b07d2c";
  return "#c0392b";
};

const History = ({ setHistoryData }) => {
  const [history, setHistory]  = useState([]);
  const [search, setSearch]    = useState("");
  const [loading, setLoading]  = useState(true);
  // Use ref to avoid stale closure / re-render loop
  const setHistoryDataRef = useRef(setHistoryData);
  setHistoryDataRef.current = setHistoryData;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get("/history");
        setHistory(res.data);
        if (setHistoryDataRef.current) setHistoryDataRef.current(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []); // Empty deps — only fetch on mount

  const filtered = history.filter((h) =>
    h.filename?.toLowerCase().includes(search.toLowerCase()) ||
    h.job_description?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedHistory = filtered.reduce((acc, item) => {
    const jd = item.job_description
      ? (item.job_description.length > 50
          ? item.job_description.substring(0, 50) + "..."
          : item.job_description)
      : "Other";
    if (!acc[jd]) acc[jd] = [];
    acc[jd].push(item);
    return acc;
  }, {});

  return (
    <section
      id="history"
      className="px-6 py-28 relative z-10"
      style={{ background: "linear-gradient(180deg, #e9edc9 0%, #fefae0 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="section-eyebrow">Recruiter Activity</span>
          <h2 className="section-title mt-2">Analysis History</h2>
          <p className="section-sub mx-auto mt-4">
            Browse all previously analyzed resumes, scores, and AI-generated insights.
          </p>
        </div>

        {/* Search bar */}
        {history.length > 0 && (
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by filename or job..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-premium pl-11"
                style={{ paddingLeft: "3rem" }}
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#a08c6a" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-xl" style={{ color: "#a08c6a" }}>
              {history.length === 0 ? "No history yet." : "No results found."}
            </p>
            <p className="text-sm mt-2" style={{ color: "#c4b49a" }}>
              {history.length === 0 ? "Analyze your first resume to get started." : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedHistory).map(([jd, items], idx) => (
                <motion.div
                  key={jd}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04, duration: 0.4 }}
                >
                  <h3
                    className="text-lg font-bold mb-4 pb-2 uppercase tracking-wide truncate"
                    style={{
                      color: "#6b5f3e",
                      borderBottom: "1px solid rgba(212,163,115,0.25)"
                    }}
                  >
                    {formatJobRole(jd)}
                  </h3>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div key={item.id} className="glass-card p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3
                            className="text-base font-bold truncate pr-2 flex-1"
                            style={{ color: "#3d3522" }}
                          >
                            {item.filename}
                          </h3>
                          <span
                            className="flex-shrink-0 text-sm font-bold px-2.5 py-0.5 rounded-full"
                            style={{
                              color: getScoreColor(item.final_score),
                              background: `${getScoreColor(item.final_score)}15`,
                              border: `1px solid ${getScoreColor(item.final_score)}40`,
                            }}
                          >
                            {item.final_score}%
                          </span>
                        </div>

                        <div className="score-bar-track mb-4">
                          <div className="score-bar-fill" style={{ width: `${item.final_score}%` }} />
                        </div>

                        {item.matched_skills && (
                          <p className="text-xs mb-1" style={{ color: "#a08c6a" }}>
                            <span className="font-medium" style={{ color: "#6b5f3e" }}>Matched:</span>{" "}
                            {item.matched_skills}
                          </p>
                        )}
                        {item.missing_skills && (
                          <p className="text-xs mb-3" style={{ color: "#a08c6a" }}>
                            <span className="font-medium" style={{ color: "#6b5f3e" }}>Missing:</span>{" "}
                            {item.missing_skills}
                          </p>
                        )}

                        {item.explanation && (
                          <p
                            className="text-xs leading-relaxed line-clamp-3 mb-3"
                            style={{ color: "#6b5f3e" }}
                          >
                            {item.explanation}
                          </p>
                        )}

                        <p className="text-xs" style={{ color: "#c4b49a" }}>
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default History;