import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import authService from "../../api/authService";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  answer: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authService.register(form);

      if (data?.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Your Name",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "example@gmail.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Min 6 characters",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      placeholder: "+94 77 123 4567",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "No. 123, Colombo",
    },
    {
      name: "answer",
      label: "Security Answer",
      type: "text",
      placeholder: "Your nickname",
    },
  ];

  return (
    <Layout title="Register — EliteMart">
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-sm text-gray-500 mt-2">
              Join EliteMart and start shopping smarter
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             outline-none transition"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium
                         hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-center text-gray-500 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
