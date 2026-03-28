import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Reveal   from "../components/Reveal";
import StatCard from "../components/StatCard";

/**
 * Props:
 *   data  { courses: { course, grade, attendance }[] }
 *
 * FIX: ResponsiveContainer MUST be inside a div with explicit pixel height.
 * Your old code put ResponsiveContainer in a 100vh div — it couldn't measure.
 */
export default function StatsSection({ data }) {
  const courses = data?.courses ?? [];

  const avg    = courses.length
    ? Math.round(courses.reduce((s, c) => s + c.grade,      0) / courses.length)
    : 0;
  const avgAtt = courses.length
    ? Math.round(courses.reduce((s, c) => s + c.attendance, 0) / courses.length)
    : 0;

  return (
    <section id="stats" style={{
      minHeight: "100vh",
      padding: "120px 5vw 80px",
      position: "relative", zIndex: 1,
    }}>

      <Reveal>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800,
            background: "linear-gradient(135deg, #e2e8f0 30%, #38bdf8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            margin: "0 0 10px", lineHeight: 1.1, fontFamily: "'Courier New', monospace",
          }}>
            Analytics Overview
          </h2>
          <p style={{ color: "#475569", fontSize: 16, margin: 0 }}>
            Your performance at a glance
          </p>
        </div>
      </Reveal>

      {/* stat cards — computed from real DB data */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 20, marginBottom: 48,
      }}>
        <StatCard label="Average Grade"    value={`${avg}%`}      color="#38bdf8" delay={0}   />
        <StatCard label="Avg Attendance"   value={`${avgAtt}%`}   color="#818cf8" delay={0.1} />
        <StatCard label="Total Courses"    value={courses.length} color="#34d399" delay={0.2} />
      </div>

      {/* recharts bar chart — FIXED: parent div has explicit pixel height */}
      <Reveal delay={0.2}>
        <div style={{
          background: "#1e293b", borderRadius: 16,
          padding: "24px 20px 16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}>
          <p style={{
            color: "#64748b", fontSize: 13,
            textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 20px",
          }}>
            Grade Distribution
          </p>

          {/* ← this div MUST have a fixed pixel height for ResponsiveContainer */}
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courses} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <XAxis
                  dataKey="course"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8, color: "white" }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="grade" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
