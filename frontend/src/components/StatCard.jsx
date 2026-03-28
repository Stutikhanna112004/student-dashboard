import Reveal from "./Reveal";

export default function StatCard({ label, value, color, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div style={{
        background:     "rgba(15,23,42,0.7)",
        border:         `1px solid ${color}30`,
        borderRadius:   16,
        padding:        "28px 24px",
        position:       "relative",
        overflow:       "hidden",
        boxShadow:      `0 0 40px ${color}18`,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          position: "absolute", top: -20, right: -20,
          width: 100, height: 100, borderRadius: "50%",
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>
          {label}
        </p>
        <p style={{ color, fontSize: 32, fontWeight: 700, margin: 0, fontFamily: "'Courier New', monospace" }}>
          {value}
        </p>
      </div>
    </Reveal>
  );
}
