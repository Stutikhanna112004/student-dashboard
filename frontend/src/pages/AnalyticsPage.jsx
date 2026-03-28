import { useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Reveal   from "../components/Reveal";
import StatCard from "../components/StatCard";

/**
 * AnalyticsPage
 * Props: data { courses: {course, grade, attendance}[] }
 *
 * Shows:
 *  - Avg grade + avg attendance StatCards
 *  - Grade distribution bar chart  (real API data)
 *  - Attendance trend line chart   (real API data)
 *  - Progress trend (grade vs attendance scatter-like line)
 */
export default function AnalyticsPage({ data }) {
  const courses = data?.courses ?? [];

  const { avgGrade, avgAttendance, best, worst } = useMemo(() => {
    if (!courses.length)
      return { avgGrade: 0, avgAttendance: 0, best: "—", worst: "—" };
    const sorted = [...courses].sort((a, b) => b.grade - a.grade);
    return {
      avgGrade:      Math.round(courses.reduce((s, c) => s + c.grade,      0) / courses.length),
      avgAttendance: Math.round(courses.reduce((s, c) => s + c.attendance, 0) / courses.length),
      best:  sorted[0]?.course ?? "—",
      worst: sorted[sorted.length - 1]?.course ?? "—",
    };
  }, [courses]);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#1e293b",
      border: "none",
      borderRadius: 8,
      color: "white",
      fontSize: 13,
    },
    cursor: { fill: "rgba(255,255,255,0.04)" },
  };

  return (
    <div style={{ background: "#050a18", minHeight: "100vh", padding: "60px 5vw 80px" }}>

      {/* ── HEADING */}
      <Reveal>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
          background: "linear-gradient(135deg, #e2e8f0 30%, #38bdf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          margin: "0 0 8px", fontFamily: "'Courier New', monospace",
        }}>
          📊 Analytics
        </h2>
        <p style={{ color: "#475569", fontSize: 15, margin: "0 0 40px" }}>
          Deep dive into your academic performance
        </p>
      </Reveal>

      {/* ── STAT CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 16, marginBottom: 40,
      }}>
        <StatCard label="Avg Grade"      value={`${avgGrade}%`}      color="#38bdf8" delay={0}   />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} color="#818cf8" delay={0.07} />
        <StatCard label="Top Course"     value={best}                color="#34d399" delay={0.14} />
        <StatCard label="Needs Work"     value={worst}               color="#f472b6" delay={0.21} />
      </div>

      {/* ── GRADE BAR CHART */}
      <Reveal delay={0.1}>
        <div style={{
          background: "rgba(15,23,42,0.7)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: "28px 24px 20px",
          marginBottom: 24,
        }}>
          <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 20px" }}>
            Grade distribution
          </p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courses} margin={{ top: 8, right: 16, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="course" stroke="#475569" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 11, fill: "#475569" }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="grade" fill="#38bdf8" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Reveal>

      {/* ── ATTENDANCE LINE CHART */}
      <Reveal delay={0.18}>
        <div style={{
          background: "rgba(15,23,42,0.7)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: "28px 24px 20px",
          marginBottom: 24,
        }}>
          <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 20px" }}>
            Attendance trend
          </p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={courses} margin={{ top: 8, right: 16, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="course" stroke="#475569" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 11, fill: "#475569" }} />
                <Tooltip {...tooltipStyle} />
                <Line
                  type="monotone" dataKey="attendance"
                  stroke="#818cf8" strokeWidth={2.5}
                  dot={{ fill: "#818cf8", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Reveal>

      {/* ── PROGRESS COMPARISON (grade vs attendance) */}
      <Reveal delay={0.26}>
        <div style={{
          background: "rgba(15,23,42,0.7)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: "28px 24px 20px",
        }}>
          <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 20px" }}>
            Grade vs attendance — progress trend
          </p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={courses} margin={{ top: 8, right: 16, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="course" stroke="#475569" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 11, fill: "#475569" }} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="grade"      stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: "#38bdf8", r: 4 }} name="Grade" />
                <Line type="monotone" dataKey="attendance" stroke="#f472b6" strokeWidth={2}   dot={{ fill: "#f472b6", r: 3 }} strokeDasharray="5 3" name="Attendance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            {[["Grade", "#38bdf8"], ["Attendance", "#f472b6"]].map(([label, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 20, height: 2, background: color, borderRadius: 2 }} />
                <span style={{ color: "#64748b", fontSize: 12 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}