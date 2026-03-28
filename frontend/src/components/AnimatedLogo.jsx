export default function AnimatedLogo({ size = 52 }) {
  return (
    <>
      <style>{`@keyframes logo-spin { to { transform: rotate(360deg); } }`}</style>
      <svg
        viewBox="0 0 52 52"
        width={size}
        height={size}
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {/* spinning dashed ring */}
        <circle
          cx="26" cy="26" r="23"
          fill="none" stroke="url(#logo-grad)"
          strokeWidth="1.5" strokeDasharray="8 4"
          style={{ transformOrigin: "26px 26px", animation: "logo-spin 8s linear infinite" }}
        />

        {/* pulsing glow */}
        <circle cx="26" cy="26" fill="rgba(56,189,248,0.07)">
          <animate attributeName="r"       values="14;18;14"     dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* graduation cap */}
        <path d="M26 8 L38 15 L38 20 L26 13 L14 20 L14 15 Z" fill="url(#logo-grad)" />

        {/* book lines */}
        <rect x="18" y="22" width="16" height="2" rx="1" fill="#38bdf8" opacity="0.9" />
        <rect x="18" y="27" width="16" height="2" rx="1" fill="#818cf8" opacity="0.7" />
        <rect x="18" y="32" width="10" height="2" rx="1" fill="#38bdf8" opacity="0.5" />

        {/* orbiting dot */}
        <circle r="3" fill="#f0abfc">
          <animateMotion dur="3s" repeatCount="indefinite" path="M26,3 A23,23 0 1,1 25.99,3Z" />
        </circle>
      </svg>
    </>
  );
}
