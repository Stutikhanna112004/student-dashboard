import { useMemo } from "react";
import Reveal   from "../components/Reveal";
import StatCard from "../components/StatCard";

/**
 * ProfilePage
 * Props: data { username, badges, courses: {course, grade, attendance}[] }
 *
 * Shows:
 *  - Avatar (initials-based, no external deps)
 *  - Username, skill level
 *  - Stat row: total courses, avg grade, avg attendance
 *  - Badge wall
 *  - Per-course mini progress rows
 */
export default function ProfilePage({ data }) {
  const courses   = data?.courses  ?? [];
  const badges    = data?.badges   ?? [];
  const username  = data?.username ?? "Student";

  const initials  = username.slice(0, 2).toUpperCase();

  const { avgGrade, avgAttendance, skillLevel } = useMemo(() => {
    if (!courses.length)
      return { avgGrade: 0, avgAttendance: 0, skillLevel: "Beginner" };
    const g = Math.round(courses.reduce((s, c) => s + c.grade,      0) / courses.length);
    const a = Math.round(courses.reduce((s, c) => s + c.attendance, 0) / courses.length);
    return {
      avgGrade:      g,
      avgAttendance: a,
      skillLevel:    g >= 85 ? "Advanced" : g >= 60 ? "Intermediate" : "Beginner",
    };
  }, [courses]);

  const SKILL_COLOR = { Advanced: "#34d399", Intermediate: "#818cf8", Beginner: "#f472b6" };
  const COURSE_COLORS = ["#38bdf8", "#818cf8", "#34d399", "#f472b6"];

  return (
    <div style={{ background: "#050a18", minHeight: "100vh", padding: "60px 5vw 80px" }}>

      {/* ── AVATAR + NAME */}
      <Reveal>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>

          {/* Avatar circle */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #38bdf8, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800, color: "white",
            fontFamily: "'Courier New', monospace",
            boxShadow: "0 0 40px rgba(56,189,248,0.3)",
            flexShrink: 0,
          }}>
            {initials}
          </div>

          <div>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, margin: "0 0 6px",
              background: "linear-gradient(135deg, #f8fafc, #38bdf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontFamily: "'Courier New', monospace",
            }}>
              {username}
            </h2>
            <span style={{
              padding: "4px 14px", borderRadius: 99,
              background: `${SKILL_COLOR[skillLevel]}18`,
              border: `1px solid ${SKILL_COLOR[skillLevel]}40`,
              color: SKILL_COLOR[skillLevel], fontSize: 13, fontWeight: 600,
            }}>
              {skillLevel}
            </span>
          </div>
        </div>
      </Reveal>

      {/* ── STAT CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 16, marginBottom: 36,
      }}>
        <StatCard label="Courses"      value={courses.length}    color="#38bdf8" delay={0}   />
        <StatCard label="Avg Grade"    value={`${avgGrade}%`}    color="#818cf8" delay={0.07} />
        <StatCard label="Avg Attend."  value={`${avgAttendance}%`} color="#34d399" delay={0.14} />
        <StatCard label="Badges"       value={badges.length}     color="#f472b6" delay={0.21} />
      </div>

      {/* ── BADGES */}
      <Reveal delay={0.15}>
        <div style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 28,
          marginBottom: 24,
        }}>
          <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 16px" }}>
            Achievements
          </p>
          {badges.length === 0 ? (
            <p style={{ color: "#334155", fontSize: 14, margin: 0 }}>
              No badges yet — keep pushing 🚀
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {badges.map((badge, i) => (
                <span key={i} style={{
                  padding: "8px 18px", borderRadius: 99,
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.2)",
                  color: "#7dd3fc", fontSize: 14,
                }}>
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {/* ── PER-COURSE MINI BARS */}
      <Reveal delay={0.22}>
        <div style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 28,
        }}>
          <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 20px" }}>
            Course snapshot
          </p>
          {courses.map((c, i) => {
            const color = COURSE_COLORS[i % COURSE_COLORS.length];
            return (
              <div key={i} style={{ marginBottom: i < courses.length - 1 ? 20 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#e2e8f0", fontSize: 14 }}>{c.course}</span>
                  <span style={{ color, fontSize: 13, fontFamily: "monospace" }}>{c.grade}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 4 }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${c.grade}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                    boxShadow: `0 0 10px ${color}50`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}