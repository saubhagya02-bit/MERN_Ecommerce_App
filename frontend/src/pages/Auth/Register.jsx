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
        toast.success("Registered successfully!");
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

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "john@example.com",
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
      placeholder: "+1 234 567 890",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "123 Main St",
    },
    {
      name: "answer",
      label: "Security Answer",
      type: "text",
      placeholder: "Your nickname",
    },
  ];

  return (
    <Layout title="Register">
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Security answer is your nickname — used to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  className="input-field"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 mt-2"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
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
