import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal";

// ✅ FIX: use env var, not hardcoded localhost
const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/$/, "")
  : "http://127.0.0.1:8000";

export default function SettingsPage({ data }) {
  const navigate = useNavigate();
  const [theme,   setTheme]   = useState(() => localStorage.getItem("edupulse-theme") || "dark");
  const [logging, setLogging] = useState(false);
  const [saved,   setSaved]   = useState(false);

  const handleTheme = (val) => {
    setTheme(val);
    localStorage.setItem("edupulse-theme", val);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    setLogging(true);
    try {
      await fetch(`${API_BASE}/logout/`, {
        method:      "POST",
        credentials: "include",
      });
    } catch {
      // server unreachable — still clear local state and redirect
    } finally {
      setLogging(false);
      // ✅ FIX: clear sessionStorage so RequireAuth gates correctly after logout
      sessionStorage.removeItem("edupulse_user");
      navigate("/login", { replace: true });
    }
  };

  const card = {
    background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20, padding: 32, backdropFilter: "blur(12px)",
    maxWidth: 560, marginBottom: 20,
  };

  const row = (i, total, label, content) => (
    <div key={i} style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"16px 0",
      borderBottom: i < total - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
    }}>
      <span style={{ color:"#64748b", fontSize:14 }}>{label}</span>
      {content}
    </div>
  );

  return (
    <div style={{ background:"#050a18", minHeight:"100vh", padding:"60px 5vw 80px" }}>
      <Reveal>
        <h2 style={{
          fontSize:"clamp(28px, 4vw, 44px)", fontWeight:800,
          background:"linear-gradient(135deg, #e2e8f0 30%, #38bdf8)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          margin:"0 0 8px", fontFamily:"'Courier New', monospace",
        }}>⚙️ Settings</h2>
        <p style={{ color:"#475569", fontSize:15, margin:"0 0 32px" }}>
          Manage your profile and preferences
        </p>
      </Reveal>

      {/* Profile card */}
      <Reveal delay={0.08}>
        <div style={card}>
          <p style={{ color:"#64748b", fontSize:11, textTransform:"uppercase", letterSpacing:1.5, margin:"0 0 4px" }}>Profile</p>
          {row(0, 2, "Username",
            <span style={{ color:"#e2e8f0", fontSize:14, fontWeight:500 }}>{data?.username ?? "—"}</span>
          )}
          {row(1, 2, "Account type",
            <span style={{ padding:"4px 12px", borderRadius:99, background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)", color:"#7dd3fc", fontSize:12 }}>
              Student
            </span>
          )}
        </div>
      </Reveal>

      {/* Appearance card */}
      <Reveal delay={0.14}>
        <div style={card}>
          <p style={{ color:"#64748b", fontSize:11, textTransform:"uppercase", letterSpacing:1.5, margin:"0 0 4px" }}>Appearance</p>
          {row(0, 1, "Theme",
            <div style={{ display:"flex", gap:8 }}>
              {[{ val:"dark", label:"🌙 Dark Cosmic" }, { val:"light", label:"☀️ Light Mode" }].map(({ val, label }) => (
                <button key={val} onClick={() => handleTheme(val)} style={{
                  padding:"6px 14px", borderRadius:8, fontSize:12,
                  border:`1px solid ${theme===val?"rgba(56,189,248,0.5)":"rgba(255,255,255,0.08)"}`,
                  background:theme===val?"rgba(56,189,248,0.12)":"transparent",
                  color:theme===val?"#38bdf8":"#64748b",
                  cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
                }}>{label}</button>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {/* Action buttons */}
      <Reveal delay={0.2}>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <button onClick={handleSave} style={{
            padding:"12px 28px", borderRadius:10,
            background: saved ? "rgba(52,211,153,0.15)" : "linear-gradient(135deg, #38bdf8, #818cf8)",
            border: saved ? "1px solid rgba(52,211,153,0.4)" : "none",
            color: saved ? "#34d399" : "white",
            fontSize:14, fontWeight:600, cursor:"pointer",
            fontFamily:"inherit", transition:"all .2s",
            boxShadow: saved ? "none" : "0 0 24px rgba(56,189,248,0.25)",
          }}>
            {saved ? "✓ Saved" : "Save Changes"}
          </button>

          <button onClick={handleLogout} disabled={logging} style={{
            padding:"12px 28px", borderRadius:10, background:"transparent",
            border:"1px solid rgba(248,113,113,0.35)", color:"#f87171",
            fontSize:14, fontWeight:600, cursor:logging?"not-allowed":"pointer",
            fontFamily:"inherit", transition:"all .2s", opacity:logging?0.6:1,
          }}
            onMouseEnter={e => { if (!logging) e.currentTarget.style.background="rgba(248,113,113,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
            {logging ? "Logging out…" : "🚪 Logout"}
          </button>
        </div>
      </Reveal>
    </div>
  );
}