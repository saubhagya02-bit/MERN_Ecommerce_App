import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { updateUser } from "../../store/slices/authSlice";
import authService from "../../api/authService";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

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
        toast.success("Profile updated successfully!");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Your name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Your email",
      readOnly: true,
    },
    {
      name: "password",
      label: "New Password (leave blank to keep current)",
      type: "password",
      placeholder: "New password",
    },
    { name: "phone", label: "Phone", type: "text", placeholder: "Your phone" },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Your address",
    },
  ];

  return (
    <Layout title="My Profile — EliteMart">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <UserMenu />
          </div>
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Edit Profile
              </h1>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 max-w-lg"
              >
                {fields.map(({ name, label, type, placeholder, readOnly }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      readOnly={readOnly}
                      className={`input-field ${readOnly ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed" : ""}`}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 mt-2"
                >
                  {loading ? "Updating..." : "Update Profile"}
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
