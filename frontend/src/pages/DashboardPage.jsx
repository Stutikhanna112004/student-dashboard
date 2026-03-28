import ParticleCanvas  from "../components/ParticleCanvas";
import HeroSection     from "./HeroSection";
import StatsSection    from "./StatsSection";
import CoursesSection  from "./CoursesSection";

/**
 * DashboardPage
 *
 * FIXED: Previously called useDashboard() itself which caused:
 *   1. A second redundant API fetch
 *   2. A race condition — data arrived AFTER render, causing blank screen
 *
 * Now receives `data` as a prop from AppShell (single source of truth).
 *
 * Props:
 *   data  { username, badges, courses }  — from useDashboard() in AppShell
 */
export default function DashboardPage({ data }) {
  return (
    <div style={{
      background: "#050a18", minHeight: "100vh",
      color: "white", fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflowX: "hidden", position: "relative",
    }}>
      {/* particle BG — fixed, sits behind all content */}
      <ParticleCanvas />

     
      {/* scroll sections — each gets the same data */}
      <HeroSection     data={data} />
      <StatsSection    data={data} />
      <CoursesSection  data={data} />

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: .3; } 50% { opacity: 1; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: #050a18; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
      `}</style>
    </div>
  );
}