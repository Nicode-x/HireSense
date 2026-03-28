import React, { useMemo, useEffect, useState } from "react";
import PremiumSelect from "./PremiumSelect";

const ICONS = {
  total: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  avg: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  top: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  highest: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
};

const formatJobRole = (desc) => {
  if (!desc) return "Unknown Role";
  let cleaned = desc.replace(/^(Job Title|Role|Position|Looking for|We are hiring a|We are looking for a|Title)[\s:-]*/i, '');
  let title = cleaned.split(/[\n|.,]/)[0].trim();
  if (title.length > 40) title = title.substring(0, 37) + "...";
  return title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const useCountUp = (target, duration = 1500) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (target === 0) { setCurrent(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCurrent(target); clearInterval(timer); }
      else setCurrent(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return current;
};

const DashboardStats = ({ history = [] }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [selectedJob, setSelectedJob] = useState("");

  const uniqueJobs = useMemo(() => {
    return [...new Set(history.map(h => h.job_description))].filter(Boolean);
  }, [history]);

  useEffect(() => {
    if (uniqueJobs.length > 0 && !uniqueJobs.includes(selectedJob)) {
      setSelectedJob(uniqueJobs[0]);
    }
  }, [uniqueJobs, selectedJob]);

  const activeHistory = useMemo(() => {
    if (!selectedJob) return [];
    return history.filter(h => h.job_description === selectedJob);
  }, [history, selectedJob]);

  const stats = useMemo(() => {
    const totalAnalyses = activeHistory.length;
    const avgScore = totalAnalyses > 0
      ? (activeHistory.reduce((s, i) => s + Number(i.final_score || 0), 0) / totalAnalyses).toFixed(1)
      : 0;
    const topCandidate = activeHistory.length > 0
      ? [...activeHistory].sort((a, b) => b.final_score - a.final_score)[0]
      : null;
    const highestScore = activeHistory.length > 0
      ? Math.max(...activeHistory.map((i) => Number(i.final_score || 0)))
      : 0;
    return { totalAnalyses, avgScore, topCandidate, highestScore };
  }, [activeHistory]);

  const animTotal   = useCountUp(stats.totalAnalyses);
  const animAvg     = useCountUp(parseFloat(stats.avgScore));
  const animHighest = useCountUp(stats.highestScore);

  const cards = [
    { icon: ICONS.total,   label: "Total Analyses", value: animTotal,   suffix: "",  sub: "All-time screenings" },
    { icon: ICONS.avg,     label: "Average Score",  value: animAvg,     suffix: "%", sub: "Across all candidates" },
    { icon: ICONS.highest, label: "Highest Score",  value: animHighest, suffix: "%", sub: "Best ever candidate" },
    {
      icon: ICONS.top,
      label: "Top Candidate",
      value: null,
      textValue: stats.topCandidate?.filename || "—",
      sub: stats.topCandidate ? `${stats.topCandidate.final_score}% match` : "No data yet",
    },
  ];

  return (
    <section className="px-6 pt-36 pb-16 relative z-10" style={{ background: "#fefae0" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 reveal flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-50">
          <div>
            <span className="section-eyebrow">Recruiter Dashboard</span>
            <h2 className="section-title mt-2">
              Welcome back, {user?.name || "Recruiter"} 
            </h2>
            <p className="section-sub mt-3">
              Review specific candidate screening analytics and hiring activity per job role.
            </p>
          </div>

          {uniqueJobs.length > 0 && (
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <label className="text-xs font-bold uppercase tracking-widest ml-1" style={{ color: "#a08c6a" }}>
                Select Job Role
              </label>
              <PremiumSelect
                value={selectedJob}
                options={uniqueJobs.map((job) => ({ value: job, label: formatJobRole(job) }))}
                onChange={(val) => setSelectedJob(val)}
                className="w-full md:w-72"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <div
              key={card.label}
              className="glass-card p-6 reveal"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a08c6a" }}>
                  {card.label}
                </span>
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(212,163,115,0.15)", color: "#d4a373" }}
                >
                  {card.icon}
                </span>
              </div>
              {card.value !== null ? (
                <p className="text-4xl font-black tabular-nums" style={{ color: "#3d3522" }}>
                  {card.value}{card.suffix}
                </p>
              ) : (
                <p className="text-xl font-bold truncate" style={{ color: "#3d3522" }}>{card.textValue}</p>
              )}
              <p className="text-xs mt-2" style={{ color: "#c4b49a" }}>{card.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardStats;