import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ParticleCanvas from "../components/ParticleCanvas";
import AnimatedLogo   from "../components/AnimatedLogo";
import Reveal         from "../components/Reveal";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: fetch CSRF token from our dedicated JSON endpoint
      // This avoids the cross-origin cookie problem entirely —
      // the token comes back as JSON that JS can actually read.
      const tokenRes = await fetch("http://127.0.0.1:8000/api/csrf/", {
        credentials: "include",   // ensures the session cookie is also set
      });
      const { csrfToken } = await tokenRes.json();

      // Step 2: POST credentials with the token in the header
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method:      "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken":  csrfToken,
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        // Store username so useDashboard can fetch the right user's data
        // even when cross-origin session cookies are dropped by the browser
        sessionStorage.setItem("edupulse_user", json.username);
        navigate("/", { replace: true });
      } else {
        setError(json.error || "Invalid username or password.");
      }
    } catch (err) {
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

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: "0 20px" }}>

        {/* logo + title */}
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
            <AnimatedLogo size={72} />
            <h1 style={{
              marginTop: 20, marginBottom: 6,
              fontFamily: "'Courier New', monospace",
              fontSize: 28, fontWeight: 800,
              background: "linear-gradient(135deg, #f8fafc, #38bdf8 60%, #818cf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              EduPulse
            </h1>
            <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
              Sign in to your dashboard
            </p>
          </div>
        </Reveal>

        {/* form card */}
        <Reveal delay={0.15}>
          <div style={{
            background:     "rgba(15,23,42,0.8)",
            border:         "1px solid rgba(56,189,248,0.12)",
            borderRadius:   20, padding: "36px 32px",
            backdropFilter: "blur(20px)",
            boxShadow:      "0 0 60px rgba(56,189,248,0.07)",
          }}>
            <form onSubmit={handleSubmit}>

              <Field label="Username">
                <Input
                  name="username" value={form.username}
                  autoComplete="username"
                  onChange={handleChange} required
                />
              </Field>

              <Field label="Password" style={{ marginBottom: 28 }}>
                <Input
                  name="password" type="password" value={form.password}
                  autoComplete="current-password"
                  onChange={handleChange} required
                />
              </Field>

              {error && (
                <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 16px", textAlign: "center" }}>
                  ⚠ {error}
                </p>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "13px",
                  borderRadius: 12, border: "none",
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
                {loading ? "Signing in…" : "Sign In →"}
              </button>
            </form>

            <p style={{ textAlign: "center", color: "#334155", fontSize: 13, marginTop: 24, marginBottom: 0 }}>
              No account?{" "}
              <Link to="/signup" style={{ color: "#38bdf8", textDecoration: "none" }}>
                Create an account
              </Link>
            </p>
          </div>
        </Reveal>
      </div>

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}

// tiny helpers to keep the form clean
function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: 20, ...style }}>
      <label style={{
        display: "block", color: "#64748b", fontSize: 12,
        textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8,
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