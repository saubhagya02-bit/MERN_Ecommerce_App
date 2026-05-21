import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import authService from "../../api/authService";
import { setCredentials } from "../../store/slices/authSlice";
import { loadUserCart } from "../../store/slices/cartSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.login(form);
      if (data?.success) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        dispatch(loadUserCart({ userId: data.user._id, role: data.user.role }));
        toast.success("Welcome back!");
        navigate(location.state || "/");
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign In — EliteMart">
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Header */}
          <div className="text-center mb-8">
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
              Sign in to your EliteMart account
            </p>
          </div>

          <div className="panel">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs transition-colors hover:underline"
                    style={{ color: "var(--accent)" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-1"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p
              className="text-center text-sm mt-5"
              style={{ color: "var(--ink-soft)" }}
            >
               Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
