import { useEffect, useState } from "react";
import Reveal from "./Reveal";

const COLORS = ["#38bdf8", "#818cf8", "#34d399", "#f472b6"];

export default function CourseCard({ course, grade, attendance, index, delay = 0 }) {
  const [go, setGo] = useState(false);
  const color = COLORS[index % COLORS.length];

  useEffect(() => {
    const t = setTimeout(() => setGo(true), delay * 1000 + 700);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <Reveal delay={delay}>
      <div style={{
        background:     "rgba(15,23,42,0.6)",
        border:         "1px solid rgba(255,255,255,0.06)",
        borderRadius:   14,
        padding:        "20px 24px",
        backdropFilter: "blur(10px)",
      }}>
        {/* title row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15 }}>{course}</span>
          <span style={{ color, fontWeight: 700, fontFamily: "monospace" }}>{grade}%</span>
        </div>

        {/* grade bar */}
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 8, marginBottom: 8 }}>
          <div style={{
            height: "100%", borderRadius: 6,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            width:     go ? `${grade}%` : "0%",
            boxShadow: `0 0 12px ${color}60`,
            transition: "width 1.2s cubic-bezier(.22,.68,0,1.2)",
          }} />
        </div>

        {/* attendance label */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ color: "#475569", fontSize: 12 }}>Attendance</span>
          <span style={{ color: "#64748b", fontSize: 12 }}>{attendance}%</span>
        </div>

        {/* attendance bar */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 4, height: 4 }}>
          <div style={{
            height: "100%", borderRadius: 4,
            background: "rgba(100,116,139,0.55)",
            width:     go ? `${attendance}%` : "0%",
            transition: "width 1.4s 0.2s cubic-bezier(.22,.68,0,1.2)",
          }} />
        </div>
      </div>
    </Reveal>
  );
}
