import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (count === 0) {
      navigate(`/${path}`, { state: location.pathname });
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate, location.pathname, path]);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen gap-4"
      style={{ background: "var(--cream)" }}
    >
      <div className="spinner" />
      <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
        Redirecting in {count} second{count !== 1 ? "s" : ""}…
      </p>
    </div>
  );
};

export default Spinner;
