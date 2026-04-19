import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import authService from "../../api/authService";
import { setCredentials } from "../../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.login(form);
      if (data?.success) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        toast.success("Login successful!");
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
    <Layout title="Login">
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back 👋
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-field"
                required
              />
            </div>

            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline self-end"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
