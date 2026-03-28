import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "rgba(254,250,224,0.97)",
        border: "1px solid rgba(212,163,115,0.3)",
        borderRadius: 12,
        padding: "8px 16px",
        boxShadow: "0 10px 30px rgba(61,53,34,0.15)",
      }}
    >
      <p style={{ color: "#a08c6a", fontSize: 12, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#3d3522", fontWeight: 700 }}>{payload[0].value} candidates</p>
    </div>
  );
};

const SkillsAnalytics = ({ candidates }) => {
  const { topSkills, missingSkills } = useMemo(() => {
    const skillCount = {};
    const missingCount = {};

    candidates.forEach((c) => {
      (c.matched_skills || []).forEach((s) => {
        skillCount[s] = (skillCount[s] || 0) + 1;
      });
      (c.missing_skills || []).forEach((s) => {
        missingCount[s] = (missingCount[s] || 0) + 1;
      });
    });

    const fmt = (obj) =>
      Object.entries(obj)
        .map(([name, value]) => ({
          name: name.length > 16 ? name.slice(0, 16) + "…" : name,
          value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

    return { topSkills: fmt(skillCount), missingSkills: fmt(missingCount) };
  }, [candidates]);

  const cardStyle = {
    background: "rgba(254,250,224,0.75)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(212,163,115,0.2)",
    borderRadius: "1.5rem",
    padding: "1.5rem",
    boxShadow: "0 20px 60px rgba(61,53,34,0.1)",
  };

  return (
    <section id="skills-analytics-section" className="mb-16">
      <div className="mb-8 text-center">
        <p className="section-eyebrow">Hiring Intelligence</p>
        <h2 className="section-title">Skills Analytics Overview</h2>
        <p className="section-sub mx-auto mt-3">
          Analyze the strongest technical overlaps and the most common skill gaps
          across all screened candidates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Matched Skills */}
        <div style={cardStyle}>
          <h3 className="text-base font-semibold mb-5" style={{ color: "#3d3522" }}>
            Top Matched Skills
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topSkills} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#c4b49a" tick={{ fontSize: 10, fill: "#6b5f3e" }} />
              <YAxis stroke="#c4b49a" tick={{ fontSize: 10, fill: "#6b5f3e" }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,163,115,0.08)" }} />
              <Bar dataKey="value" fill="#ccd5ae" radius={[6, 6, 0, 0]} maxBarSize={44} fillOpacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Missing Skills */}
        <div style={cardStyle}>
          <h3 className="text-base font-semibold mb-5" style={{ color: "#3d3522" }}>
            Most Missing Skills
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={missingSkills} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#c4b49a" tick={{ fontSize: 10, fill: "#6b5f3e" }} />
              <YAxis stroke="#c4b49a" tick={{ fontSize: 10, fill: "#6b5f3e" }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,163,115,0.08)" }} />
              <Bar dataKey="value" fill="#d4a373" radius={[6, 6, 0, 0]} maxBarSize={44} fillOpacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default SkillsAnalytics;