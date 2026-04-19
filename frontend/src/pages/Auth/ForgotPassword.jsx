import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import authService from "../../api/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", answer: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.forgotPassword(form);
      if (data?.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data?.message || "Reset failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Reset Password">
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Reset Password 🔐
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email, security answer and a new password.
          </p>

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
                placeholder="your@email.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Answer (Your Nickname)
              </label>
              <input
                type="text"
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Your nickname"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 mt-2"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
