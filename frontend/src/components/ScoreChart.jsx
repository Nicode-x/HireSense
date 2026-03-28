import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const SCORE_COLOR = (score) => {
  if (score >= 80) return "#2d7a5f";
  if (score >= 50) return "#b07d2c";
  return "#c0392b";
};

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
      <p style={{ color: SCORE_COLOR(payload[0].value), fontWeight: 700, fontSize: 16 }}>
        {payload[0].value}%
      </p>
    </div>
  );
};

const ScoreChart = ({ candidates }) => {
  const chartData = candidates.map((c) => {
    const fname = c.filename || "Unknown";
    return {
      name: fname.length > 14 ? fname.slice(0, 14) + "…" : fname,
      score: c.final_score || 0,
    };
  });

  return (
    <section id="score-chart-section" className="mb-16">
      <div className="mb-8 text-center">
        <p className="section-eyebrow">Candidate Performance</p>
        <h2 className="section-title">Score Comparison Overview</h2>
        <p className="section-sub mx-auto mt-3">
          Compare candidate evaluation scores to quickly identify the strongest
          profiles and hiring priorities.
        </p>
      </div>

      <div
        className="p-6 rounded-[2rem]"
        style={{
          background: "rgba(254,250,224,0.75)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(212,163,115,0.2)",
          boxShadow: "0 20px 60px rgba(61,53,34,0.1)",
        }}
      >
        <h3 className="text-lg font-semibold mb-6" style={{ color: "#3d3522" }}>
          Candidate Score Comparison
        </h3>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#c4b49a" tick={{ fontSize: 11, fill: "#6b5f3e" }} />
            <YAxis domain={[0, 100]} stroke="#c4b49a" tick={{ fontSize: 11, fill: "#6b5f3e" }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,163,115,0.08)" }} />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={52}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SCORE_COLOR(entry.score)} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ScoreChart;