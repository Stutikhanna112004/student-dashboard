import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, delay = 0 }) {
  const ref        = useRef(null);
  const [vis, set] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { set(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity:    vis ? 1 : 0,
      transform:  vis ? "translateY(0)" : "translateY(40px)",
      transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s cubic-bezier(.22,.68,0,1.2)`,
    }}>
      {children}
    </div>
  );
}
