import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ParticleCanvas from "../components/ParticleCanvas";
import AnimatedLogo   from "../components/AnimatedLogo";
import Reveal         from "../components/Reveal";

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ username: "", email: "", password1: "", password2: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password1 !== form.password2) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password1.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/signup/`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body: JSON.stringify({
          username:  form.username,
          email:     form.email,
          password1: form.password1,
          password2: form.password2,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        // auto-login after signup — store username just like LoginPage does
        sessionStorage.setItem("edupulse_user", json.username);
        navigate("/", { replace: true });
      } else {
        setError(json.error || "Signup failed. Try a different username.");
      }
    } catch {
      setError("Could not reach the server. Is Django running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050a18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <ParticleCanvas />

      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, padding: "0 20px" }}>

        {/* Logo */}
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
            <AnimatedLogo size={64} />
            <h1 style={{
              marginTop: 16, marginBottom: 4,
              fontFamily: "'Courier New', monospace",
              fontSize: 26, fontWeight: 800,
              background: "linear-gradient(135deg, #f8fafc, #38bdf8 60%, #818cf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              EduPulse
            </h1>
            <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
              Create your student account
            </p>
          </div>
        </Reveal>

        {/* Card */}
        <Reveal delay={0.12}>
          <div style={{
            background:     "rgba(15,23,42,0.8)",
            border:         "1px solid rgba(56,189,248,0.12)",
            borderRadius:   20, padding: "32px 28px",
            backdropFilter: "blur(20px)",
            boxShadow:      "0 0 60px rgba(56,189,248,0.07)",
          }}>
            <form onSubmit={handleSubmit}>

              <Field label="Username">
                <Input name="username" value={form.username}
                  autoComplete="username" onChange={handleChange} required />
              </Field>

              <Field label="Email">
                <Input name="email" type="email" value={form.email}
                  autoComplete="email" onChange={handleChange} required />
              </Field>

              <Field label="Password">
                <Input name="password1" type="password" value={form.password1}
                  autoComplete="new-password" onChange={handleChange} required />
              </Field>

              <Field label="Confirm Password" last>
                <Input name="password2" type="password" value={form.password2}
                  autoComplete="new-password" onChange={handleChange} required />
              </Field>

              {error && (
                <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 16px", textAlign: "center" }}>
                  ⚠ {error}
                </p>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "13px", borderRadius: 12, border: "none",
                  background: loading
                    ? "rgba(56,189,248,0.25)"
                    : "linear-gradient(135deg, #38bdf8, #818cf8)",
                  color: "white", fontSize: 15, fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: 0.5, fontFamily: "inherit",
                  boxShadow: "0 0 30px rgba(56,189,248,0.2)",
                  transition: "transform .15s, box-shadow .15s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 0 50px rgba(56,189,248,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(56,189,248,0.2)";
                }}
              >
                {loading ? "Creating account…" : "Create Account →"}
              </button>
            </form>

            <p style={{ textAlign: "center", color: "#334155", fontSize: 13, marginTop: 20, marginBottom: 0 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#38bdf8", textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>
        </Reveal>
      </div>

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}

function Field({ label, children, last }) {
  return (
    <div style={{ marginBottom: last ? 24 : 16 }}>
      <label style={{
        display: "block", color: "#64748b", fontSize: 12,
        textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ onChange, ...props }) {
  return (
    <input
      {...props}
      onChange={onChange}
      style={{
        width: "100%", padding: "11px 14px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10, color: "white", fontSize: 14,
        outline: "none", fontFamily: "inherit",
        transition: "border-color .2s, box-shadow .2s",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "rgba(56,189,248,0.5)";
        e.target.style.boxShadow   = "0 0 0 3px rgba(56,189,248,0.08)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "rgba(255,255,255,0.08)";
        e.target.style.boxShadow   = "none";
      }}
    />
  );
}