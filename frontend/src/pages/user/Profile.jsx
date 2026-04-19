import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import authService from "../../api/authService";
import { selectCurrentUser, updateUser } from "../../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.updateProfile(form);
      if (data?.error) {
        toast.error(data.error);
      } else {
        dispatch(updateUser(data.updatedUser));
        toast.success("Profile updated!");
        setForm((prev) => ({ ...prev, password: "" }));
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
      label: "New Password (optional)",
      type: "password",
      placeholder: "Leave blank to keep current",
      required: false,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "+1 234 567 890",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "123 Main St",
    },
  ];

  return (
    <Layout title="My Profile">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <UserMenu />
          </div>
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Edit Profile
              </h2>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 max-w-md"
              >
                {fields.map(
                  ({ name, label, type, placeholder, required = true }) => (
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
                        required={required}
                      />
                    </div>
                  ),
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 mt-2"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
