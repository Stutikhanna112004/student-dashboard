import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticleCanvas from "../components/ParticleCanvas";
import AnimatedLogo   from "../components/AnimatedLogo";
import Reveal         from "../components/Reveal";

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/$/, "")
  : "http://127.0.0.1:8000";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [shake,   setShake]   = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError("Please fill in both fields."); triggerShake(); return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/login/`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ username: form.username.trim(), password: form.password }),
      });

      let json;
      try { json = await res.json(); } catch { json = {}; }

      if (res.ok && json.success) {
        // ✅ FIX: write to sessionStorage so RequireAuth in App.js lets us through
        sessionStorage.setItem("edupulse_user", json.username);
        // Small delay so browser commits the Set-Cookie before next fetch fires
        await new Promise(r => setTimeout(r, 150));
        navigate("/", { replace: true });
      } else {
        setError(json.error || `Login failed (${res.status})`);
        triggerShake();
      }
    } catch {
      setError(`Cannot reach server (${API_BASE})`);
      triggerShake();
    } finally {
      setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050a18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden",
    }}>
      <ParticleCanvas />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: "0 24px" }}>
        <Reveal>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom: 36 }}>
            <AnimatedLogo size={76} />
            <h1 style={{
              marginTop: 20, marginBottom: 6, fontSize: 30, fontWeight: 900,
              background: "linear-gradient(135deg, #f8fafc 0%, #38bdf8 55%, #818cf8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>EduPulse</h1>
            <p style={{ color: "#334155", fontSize: 13, margin: 0, letterSpacing: 1 }}>
              SIGN IN TO YOUR DASHBOARD
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div style={{
            background: "rgba(15,23,42,0.82)", border: "1px solid rgba(56,189,248,0.14)",
            borderRadius: 22, padding: "36px 32px", backdropFilter: "blur(24px)",
            boxShadow: "0 0 80px rgba(56,189,248,0.07), 0 24px 48px rgba(0,0,0,0.4)",
            animation: shake ? "shake 0.5s ease" : "none",
          }}>
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Username</label>
                <input name="username" value={form.username} onChange={handleChange}
                  autoComplete="username" autoFocus placeholder="your_username" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor="rgba(56,189,248,0.55)"; e.target.style.boxShadow="0 0 0 3px rgba(56,189,248,0.08)"; }}
                  onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; }} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange}
                  autoComplete="current-password" placeholder="••••••••" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor="rgba(56,189,248,0.55)"; e.target.style.boxShadow="0 0 0 3px rgba(56,189,248,0.08)"; }}
                  onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; }} />
              </div>
              {error && (
                <div style={{
                  marginBottom: 18, padding: "10px 14px", borderRadius: 8,
                  background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
                  color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                }}>⚠ {error}</div>
              )}
              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: loading ? "rgba(56,189,248,0.25)" : "linear-gradient(135deg, #38bdf8, #818cf8)",
                color: "white", fontSize: 15, fontWeight: 700, fontFamily: "'Courier New', monospace",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 36px rgba(56,189,248,0.28)",
                transition: "transform .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                {loading ? <><Spinner /> Authenticating…</> : "Sign In →"}
              </button>
            </form>
            <p style={{ textAlign: "center", color: "#1e3a52", fontSize: 13, marginTop: 24, marginBottom: 0 }}>
              No account?{" "}
              <a href="/signup" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 700 }}>
                Create one
              </a>
            </p>
          </div>
        </Reveal>
      </div>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        * { box-sizing:border-box; }
      `}</style>
    </div>
  );
}

const labelStyle = { display:"block", color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:1.4, marginBottom:8, fontFamily:"'Courier New', monospace" };
const inputStyle = { width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"white", fontSize:14, outline:"none", transition:"border-color .2s, box-shadow .2s", fontFamily:"'Courier New', monospace" };
function Spinner() {
  return <span style={{ display:"inline-block", width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />;
}