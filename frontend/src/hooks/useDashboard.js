import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/$/, "")
  : "http://127.0.0.1:8000";

export default function useDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/api/dashboard/`, {
      method:      "GET",
      credentials: "include",   // ← CRITICAL: sends the session cookie cross-origin
      headers: {
        "Accept":       "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          // Not logged in → go to login (but don't loop if already there)
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          return null;
        }
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled && json) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}