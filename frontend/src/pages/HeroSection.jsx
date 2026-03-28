import AnimatedLogo from "../components/AnimatedLogo";
import Reveal       from "../components/Reveal";

/**
 * Props:
 *   data  { username: string, badges: string[] }
 *   ← receives the full API response object
 */
export default function HeroSection({ data }) {
  const firstName = data?.username?.split(" ")[0] ?? "Student";

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center",
      padding: "120px 5vw 80px",
      position: "relative", zIndex: 1,
    }}>

      <Reveal>
        <div style={{ marginBottom: 28 }}>
          <AnimatedLogo size={88} />
        </div>
      </Reveal>

      {/* real badges from DB */}
      <Reveal delay={0.1}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {data?.badges?.map((badge, i) => (
            <span key={i} style={{
              padding: "6px 16px", borderRadius: 99,
              background: "rgba(56,189,248,0.1)",
              border: "1px solid rgba(56,189,248,0.25)",
              color: "#7dd3fc", fontSize: 13,
            }}>
              {badge}
            </span>
          ))}
        </div>
      </Reveal>

      {/* real username from DB */}
      <Reveal delay={0.2}>
        <h1 style={{
          fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 900, margin: "0 0 16px",
          background: "linear-gradient(135deg, #f8fafc 0%, #38bdf8 50%, #818cf8 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1.05, fontFamily: "'Courier New', monospace", letterSpacing: -1,
        }}>
          Welcome back,<br />{firstName}
        </h1>
      </Reveal>

      <Reveal delay={0.3}>
        <p style={{ color: "#64748b", fontSize: 18, maxWidth: 500, lineHeight: 1.7, margin: "0 0 40px" }}>
          Your academic journey, visualised in real-time. Track grades,
          attendance, and performance — all in one place.
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <button
          onClick={() => scrollTo("stats")}
          style={{
            padding: "14px 36px", borderRadius: 12,
            background: "linear-gradient(135deg, #38bdf8, #818cf8)",
            border: "none", color: "white", fontSize: 15, fontWeight: 600,
            cursor: "pointer", letterSpacing: 0.5, fontFamily: "inherit",
            boxShadow: "0 0 40px rgba(56,189,248,0.3)",
            transition: "transform .2s, box-shadow .2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(56,189,248,0.45)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 0 40px rgba(56,189,248,0.3)";  }}
        >
          View Dashboard ↓
        </button>
      </Reveal>

      {/* scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <span style={{ color: "#334155", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>scroll</span>
        <div style={{
          width: 1, height: 40,
          background: "linear-gradient(#38bdf8, transparent)",
          animation: "scrollPulse 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}
