import { useState, useMemo } from "react";
import Reveal     from "../components/Reveal";
import CourseCard from "../components/CourseCard";

/**
 * CoursesPage
 * Props: data { courses: {course, grade, attendance}[] }
 *
 * Features:
 *  - Live search by course name
 *  - Sort by grade (high/low) or attendance
 *  - Filter: only show courses where grade < 60 (needs attention)
 */
export default function CoursesPage({ data }) {
  const courses = data?.courses ?? [];

  const [query,      setQuery]      = useState("");
  const [sortBy,     setSortBy]     = useState("grade-desc");
  const [onlyWeak,   setOnlyWeak]   = useState(false);

  const filtered = useMemo(() => {
    let list = [...courses];

    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c => c.course.toLowerCase().includes(q));
    }

    // weak filter
    if (onlyWeak) list = list.filter(c => c.grade < 60);

    // sort
    if      (sortBy === "grade-desc")  list.sort((a, b) => b.grade      - a.grade);
    else if (sortBy === "grade-asc")   list.sort((a, b) => a.grade      - b.grade);
    else if (sortBy === "attend-desc") list.sort((a, b) => b.attendance - a.attendance);
    else if (sortBy === "attend-asc")  list.sort((a, b) => a.attendance - b.attendance);

    return list;
  }, [courses, query, sortBy, onlyWeak]);

  const inputBase = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "white",
    fontSize: 14, padding: "10px 14px",
    outline: "none", fontFamily: "inherit",
    transition: "border-color .2s",
  };

  const t = {
   selectBg: "#0f172a",
   selectText: "#e2e8f0",
  };

  const selectStyle = {
   ...inputBase,
   background: t.selectBg,
   color: t.selectText,
   cursor: "pointer",
};

  return (
    <div  style={{ background: "#050a18", minHeight: "100vh", padding: "60px 5vw 80px" }}>
      <style>{`
        .edupulse-select option {
        background: #0f172a;
       color: #e2e8f0;
    }
    `}</style>
      {/* ── HEADING */}
      <Reveal>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
          background: "linear-gradient(135deg, #e2e8f0 30%, #38bdf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          margin: "0 0 8px", fontFamily: "'Courier New', monospace",
        }}>
           Courses
        </h2>
        <p style={{ color: "#475569", fontSize: 15, margin: "0 0 32px" }}>
          {courses.length} enrolled course{courses.length !== 1 ? "s" : ""}
        </p>
      </Reveal>

      {/* ── CONTROLS */}
      <Reveal delay={0.05}>
        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap",
          alignItems: "center", marginBottom: 32,
        }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search courses…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ ...inputBase, flex: "1 1 200px", minWidth: 180 }}
            onFocus={e  => { e.target.style.borderColor = "rgba(56,189,248,0.5)"; }}
            onBlur={e   => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
          />

          {/* Sort */}
          <select
            className="edupulse-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="grade-desc">Grade: High → Low</option>
            <option value="grade-asc">Grade: Low → High</option>
            <option value="attend-desc">Attendance: High → Low</option>
            <option value="attend-asc">Attendance: Low → High</option>
          </select>

          {/* Weak filter toggle */}
          <button
            onClick={() => setOnlyWeak(v => !v)}
            style={{
              padding: "10px 18px", borderRadius: 10, fontSize: 13,
              border: `1px solid ${onlyWeak ? "#f472b6" : "rgba(255,255,255,0.1)"}`,
              background: onlyWeak ? "rgba(244,114,182,0.12)" : "transparent",
              color: onlyWeak ? "#f472b6" : "#64748b",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all .2s",
            }}
          >
            ⚠️ Needs Attention
          </button>
        </div>
      </Reveal>

      {/* ── RESULT COUNT */}
      {filtered.length !== courses.length && (
        <Reveal>
          <p style={{ color: "#475569", fontSize: 13, marginBottom: 20 }}>
            Showing {filtered.length} of {courses.length} courses
          </p>
        </Reveal>
      )}

      {/* ── COURSE GRID */}
      {filtered.length === 0 ? (
        <Reveal>
          <div style={{
            textAlign: "center", padding: "80px 20px",
            color: "#334155", fontSize: 16,
          }}>
            No courses match your filter 🔍
          </div>
        </Reveal>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {filtered.map((c, i) => (
            <CourseCard
              key={c.course}
              course={c.course}
              grade={c.grade}
              attendance={c.attendance}
              index={i}
              delay={i * 0.07}
            />
          ))}
        </div>
      )}
    </div>
  );
}