import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreChart from "./ScoreChart";
import SkillsAnalytics from "./SkillsAnalytics";
import { generatePDF } from "../utils/generatePDF";
import PremiumSelect from "./PremiumSelect";

const getScoreColor = (score) => {
  if (score >= 80) return "#2d7a5f"; // green
  if (score >= 50) return "#b07d2c"; // amber
  return "#c0392b"; // red
};

const getScoreBg = (score) => {
  if (score >= 80) return "rgba(45,122,95,0.1)";
  if (score >= 50) return "rgba(176,125,44,0.1)";
  return "rgba(192,57,43,0.08)";
};

const getRankBadge = (index) => {
  if (index === 0) return { label: "#1", cls: "rank-gold" };
  if (index === 1) return { label: "#2", cls: "rank-silver" };
  if (index === 2) return { label: "#3", cls: "rank-bronze" };
  return { label: `#${index + 1}`, cls: "" };
};

const Results = ({ data }) => {
  const [minScore, setMinScore] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const rankedCandidates = data?.ranked_candidates || [];

  const filteredCandidates = useMemo(() => {
    return [...rankedCandidates]
      .filter((c) => (c.final_score || 0) >= Number(minScore))
      .sort((a, b) =>
        sortOrder === "desc"
          ? (b.final_score || 0) - (a.final_score || 0)
          : (a.final_score || 0) - (b.final_score || 0)
      );
  }, [rankedCandidates, minScore, sortOrder]);

  const topCandidate = filteredCandidates[0];

  return (
    <section
      id="results"
      className="px-6 py-28 min-h-screen relative z-10"
      style={{ background: "linear-gradient(160deg, #faedcd 0%, #e9edc9 50%, #fefae0 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="section-eyebrow">AI Candidate Insights</span>
          <h2 className="section-title mt-2">Ranked Candidate Dashboard</h2>
          <p className="section-sub mx-auto mt-4">
            View recruiter-friendly rankings, skill gaps, explanations,
            and candidate score analytics.
          </p>
        </div>

        {/* PDF + Filters Row */}
        <div
          className="flex flex-wrap md:flex-nowrap justify-between gap-4 mb-10 items-center p-4 rounded-3xl relative z-50"
          style={{
            background: "rgba(254,250,224,0.7)",
            border: "1px solid rgba(212,163,115,0.2)",
          }}
        >
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <input
              type="number"
              placeholder="Min score (%)"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="filter-premium w-40"
            />

            <PremiumSelect
              value={sortOrder}
              options={[
                { value: "desc", label: "Highest Score First" },
                { value: "asc",  label: "Lowest Score First"  },
              ]}
              onChange={(val) => setSortOrder(val)}
              className="w-56"
            />
          </div>

          <button
            onClick={() =>
              generatePDF(filteredCandidates, {
                recruiterName: JSON.parse(localStorage.getItem("user"))?.name || "Recruiter",
                companyName: "HireSense",
                logoUrl: "/logo.png",
                jobDescription: filteredCandidates[0]?.job_description || "",
              })
            }
            className="btn-premium px-6 whitespace-nowrap flex items-center gap-2"
            style={{ borderRadius: "1rem" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        </div>

        {/* Top Candidate Banner */}
        {topCandidate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 rounded-[2rem] relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #d4a373, #c4834a)" }}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_60%)]" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl rank-gold flex items-center justify-center text-2xl font-black shadow-lg">
                🏆
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.15em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Top Candidate
                </p>
                <h3 className="text-2xl font-bold text-white">
                  {topCandidate.filename || "Unknown"}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-lg font-semibold text-white">
                    {topCandidate.final_score || 0}% Match
                  </span>
                  <div className="flex-1 max-w-xs" style={{ height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${topCandidate.final_score || 0}%`, height: "100%", background: "#fff", borderRadius: 999 }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics */}
        <div className="mb-12 reveal">
          <SkillsAnalytics candidates={filteredCandidates} />
        </div>

        <div className="mb-12 reveal">
          <ScoreChart candidates={filteredCandidates} />
        </div>

        {/* Candidate Cards */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredCandidates.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-5xl mb-4">😕</p>
                <p className="text-xl" style={{ color: "#a08c6a" }}>No candidates match your filters</p>
                <p className="text-sm mt-2" style={{ color: "#c4b49a" }}>Try adjusting the minimum score or sorting</p>
              </motion.div>
            ) : (
              filteredCandidates.map((candidate, index) => {
                const rank = getRankBadge(index);
                const isExpanded = expandedIndex === index;

                return (
                  <motion.div
                    key={`${candidate.filename}-${index}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="glass-card overflow-hidden"
                  >
                    {/* Card Header */}
                    <button
                      className="w-full text-left p-7 flex items-start md:items-center gap-5 md:flex-row flex-col"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    >
                      {/* Rank badge */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl text-sm font-black flex items-center justify-center shadow-md ${
                          rank.cls || ""
                        }`}
                        style={!rank.cls ? { background: "rgba(212,163,115,0.15)", color: "#6b5f3e" } : {}}
                      >
                        {rank.label}
                      </div>

                      {/* Name + score */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold truncate" style={{ color: "#3d3522" }}>
                          {candidate.filename || "Unknown"}
                        </h3>

                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: getScoreColor(candidate.final_score || 0) }}
                          >
                            {candidate.final_score || 0}% Final Score
                          </span>

                          <div className="flex-1 score-bar-track max-w-xs hidden md:block">
                            <div
                              className="score-bar-fill"
                              style={{ width: `${candidate.final_score || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Sub scores */}
                        <div className="flex gap-4 mt-2 text-xs" style={{ color: "#a08c6a" }}>
                          <span>
                            Skill:{" "}
                            <span style={{ color: "#6b5f3e" }}>{candidate.skill_match_score || 0}%</span>
                          </span>
                          <span>
                            Semantic:{" "}
                            <span style={{ color: "#6b5f3e" }}>{candidate.semantic_score || 0}%</span>
                          </span>
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <svg
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        style={{ color: "#a08c6a" }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expandable details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <div className="px-7 pb-7 pt-0 grid md:grid-cols-2 gap-5">
                            {/* Matched Skills */}
                            <div className="rounded-2xl p-5" style={{ background: "rgba(204,213,174,0.25)" }}>
                              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a08c6a" }}>
                                Matched Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {candidate.matched_skills?.length ? (
                                  candidate.matched_skills.map((s) => (
                                    <span key={s} className="badge-skill matched">{s}</span>
                                  ))
                                ) : (
                                  <span className="text-sm" style={{ color: "#a08c6a" }}>No matched skills found</span>
                                )}
                              </div>
                            </div>

                            {/* Missing Skills */}
                            <div className="rounded-2xl p-5" style={{ background: "rgba(212,163,115,0.1)" }}>
                              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a08c6a" }}>
                                Missing Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {candidate.missing_skills?.length ? (
                                  candidate.missing_skills.map((s) => (
                                    <span key={s} className="badge-skill missing">{s}</span>
                                  ))
                                ) : (
                                  <span className="text-sm" style={{ color: "#a08c6a" }}>No major gaps detected</span>
                                )}
                              </div>
                            </div>

                            {/* AI Explanation */}
                            <div className="md:col-span-2 rounded-2xl p-5" style={{ background: "rgba(250,237,205,0.5)" }}>
                              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#a08c6a" }}>
                                AI Explanation
                              </h4>
                              <p className="text-sm leading-relaxed" style={{ color: "#3d3522" }}>
                                {candidate.explanation || "No explanation available."}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Results;