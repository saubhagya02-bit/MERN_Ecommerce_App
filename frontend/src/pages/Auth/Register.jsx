import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import authService from "../../api/authService";

const fields = [
  { name: "name", label: "Full Name", type: "text", placeholder: "Jane Smith" },
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "jane@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Minimum 8 characters",
    minLength: 8,
  },
  {
    name: "phone",
    label: "Phone number",
    type: "text",
    placeholder: "+1 234 567 8900",
  },
  {
    name: "address",
    label: "Delivery address",
    type: "text",
    placeholder: "123 Main Street",
  },
  {
    name: "answer",
    label: "Security answer",
    type: "text",
    placeholder: "Your memorable answer",
  },
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.register(form);
      if (data?.success) {
        toast.success(data.message || "Account created!");
        navigate("/login");
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Account — EliteMart">
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div style={{ width: "100%", maxWidth: 440 }}>
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
              Create account
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
              Join EliteMart today
            </p>
          </div>

          <div className="panel">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {fields.map(({ name, label, type, placeholder, minLength }) => (
                <div key={name}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="input-field"
                    required
                    minLength={minLength}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-1"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p
              className="text-center text-sm mt-5"
              style={{ color: "var(--ink-soft)" }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
