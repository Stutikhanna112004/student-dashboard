import Reveal from "./Reveal";

const COLORS = ["#38bdf8", "#818cf8", "#34d399", "#f472b6"];

/**
 * GradeChart
 * A simple bar chart rendered with divs — no charting library needed.
 * Each bar grows from 0 to its real height via CSS transition.
 *
 * Props:
 *   courses  { course: string, grade: number }[]
 */
export default function GradeChart({ courses = [] }) {
  return (
    <Reveal delay={0.2}>
      <div
        style={{
          background:     "rgba(15,23,42,0.6)",
          border:         "1px solid rgba(255,255,255,0.06)",
          borderRadius:   20,
          padding:        "32px 28px",
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          style={{
            color:         "#64748b",
            fontSize:      13,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            margin:        "0 0 24px",
          }}
        >
          Grade Distribution
        </p>

        <div
          style={{
            display:     "flex",
            alignItems:  "flex-end",
            gap:         16,
            height:      120,
          }}
        >
          {courses.map((c, i) => (
            <div
              key={i}
              style={{
                flex:           1,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                gap:            8,
                height:         "100%",
                justifyContent: "flex-end",
              }}
            >
              <span
                style={{
                  color:      COLORS[i % COLORS.length],
                  fontSize:   13,
                  fontWeight: 700,
                }}
              >
                {c.grade}
              </span>

              <div
                style={{
                  width:        "100%",
                  borderRadius: "6px 6px 0 0",
                  background:   `linear-gradient(180deg, ${COLORS[i % COLORS.length]}, ${COLORS[i % COLORS.length]}44)`,
                  height:       `${(c.grade / 100) * 90}px`,
                  boxShadow:    `0 0 20px ${COLORS[i % COLORS.length]}40`,
                  transition:   "height 1s ease",
                }}
              />

              <span
                style={{
                  color:     "#475569",
                  fontSize:  11,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow:  "hidden",
                  textOverflow: "ellipsis",
                  maxWidth:  "100%",
                }}
              >
                {c.course.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
