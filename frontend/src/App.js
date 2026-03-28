import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CoursesPage   from "./pages/CoursesSection";
import SettingsPage  from "./pages/SettingsSection";
import ProfilePage   from "./pages/ProfilePage";
import LoginPage     from "./pages/LoginPage";
import SignupPage    from "./pages/SignupPage";
import useDashboard  from "./hooks/useDashboard";

// ── Auth gate ─────────────────────────────────────────────────────────────────
// sessionStorage is set by LoginPage on successful login.
// It's cleared by SettingsSection on logout.
function isLoggedIn() {
  return Boolean(sessionStorage.getItem("edupulse_user"));
}

function RequireAuth({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"  element={<LoginPage  />} />
      <Route path="/signup" element={<SignupPage  />} />
      <Route path="/*" element={<RequireAuth><AppShell /></RequireAuth>} />
    </Routes>
  );
}

// ── Sidebar shell ─────────────────────────────────────────────────────────────
function AppShell() {
  const { data, loading, error } = useDashboard();

  return (
    <div style={{ display:"flex", background:"#0f172a", minHeight:"100vh", color:"white" }}>

      {/* SIDEBAR */}
      <div style={{
        width:"220px", background:"#020617", padding:"24px 16px",
        borderRight:"1px solid #1e293b", flexShrink:0,
        position:"sticky", top:0, height:"100vh", overflowY:"auto",
        display:"flex", flexDirection:"column",
      }}>
        <div style={{ marginBottom:36, paddingLeft:8 }}>
          <span style={{ fontSize:22 }}>🎓</span>
          <span style={{ display:"block", fontSize:11, color:"#334155", letterSpacing:1.5, textTransform:"uppercase", marginTop:4 }}>
            EduPulse
          </span>
        </div>

        <nav style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
          {[
            { to:"/",          label:"🏠 Dashboard" },
            { to:"/analytics", label:"📊 Analytics"  },
            { to:"/courses",   label:"📚 Courses"    },
            { to:"/profile",   label:"👤 Profile"    },
            { to:"/settings",  label:"⚙️ Settings"   },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"}
              style={({ isActive }) => ({
                textDecoration:"none", color:isActive?"white":"#64748b",
                background:isActive?"#1e293b":"transparent",
                padding:"10px 12px", borderRadius:"10px",
                fontSize:14, transition:"all .15s", display:"block",
              })}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* username chip */}
        {data?.username && (
          <div style={{ borderTop:"1px solid #1e293b", paddingTop:16, marginTop:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px" }}>
              <div style={{
                width:28, height:28, borderRadius:"50%",
                background:"linear-gradient(135deg, #38bdf8, #818cf8)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, color:"white", flexShrink:0,
              }}>
                {data.username.slice(0,2).toUpperCase()}
              </div>
              <span style={{ color:"#94a3b8", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {data.username}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex:1, overflow:"auto" }}>
        {loading && <LoadingScreen />}
        {error   && <ErrorScreen error={error} />}
        {!loading && !error && data && (
          <Routes>
            <Route path="/"          element={<DashboardPage data={data} />} />
            <Route path="/analytics" element={<AnalyticsPage data={data} />} />
            <Route path="/courses"   element={<CoursesPage   data={data} />} />
            <Route path="/profile"   element={<ProfilePage   data={data} />} />
            <Route path="/settings"  element={<SettingsPage  data={data} />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, background:"#050a18" }}>
      <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid rgba(56,189,248,0.15)", borderTopColor:"#38bdf8", animation:"spin 0.8s linear infinite" }} />
      <p style={{ color:"#475569", fontFamily:"monospace", margin:0 }}>Loading dashboard…</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorScreen({ error }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, background:"#050a18", color:"#f87171", fontFamily:"monospace" }}>
      <p style={{ fontSize:18, margin:0 }}>⚠ API unreachable</p>
      <p style={{ fontSize:13, color:"#475569", margin:0 }}>{error}</p>
    </div>
  );
}