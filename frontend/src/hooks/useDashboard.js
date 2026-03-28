import { useEffect, useState } from "react";

/**
 * Fetches /api/dashboard/ with the logged-in user's username as a query param.
 * This is needed because cross-origin session cookies are unreliable in
 * local dev (Chrome drops SameSite=None cookies without HTTPS).
 *
 * The username is stored in sessionStorage after login (set by LoginPage).
 */
export default function useDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    // Get the username that LoginPage stored after successful login
    const username = sessionStorage.getItem("edupulse_user");
    const url = username
      ? `http://127.0.0.1:8000/api/dashboard/?user=${encodeURIComponent(username)}`
      : `http://127.0.0.1:8000/api/dashboard/`;

    fetch(url, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) { setData(json); setLoading(false); }
      })
      .catch((err) => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}