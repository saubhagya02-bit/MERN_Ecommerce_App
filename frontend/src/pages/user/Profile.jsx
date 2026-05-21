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
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

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
        setForm((p) => ({ ...p, password: "" }));
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
      placeholder: "Jane Smith",
    },
    {
      name: "email",
      label: "Email address",
      type: "email",
      placeholder: "",
      readOnly: true,
    },
    {
      name: "password",
      label: "New password (leave blank)",
      type: "password",
      placeholder: "••••••••",
      required: false,
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
  ];

  return (
    <Layout title="My Profile — EliteMart">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <UserMenu />
          </div>
          <div className="md:col-span-3">
            <div className="panel">
              <p className="page-title" style={{ fontSize: "1.35rem" }}>
                Edit Profile
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                style={{ maxWidth: 440 }}
              >
                {fields.map(
                  ({
                    name,
                    label,
                    type,
                    placeholder,
                    readOnly,
                    required = true,
                  }) => (
                    <div key={name}>
                      <label className="form-label">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        required={required}
                        className="input-field"
                        style={
                          readOnly
                            ? {
                                background: "var(--cream)",
                                cursor: "not-allowed",
                                color: "var(--ink-soft)",
                              }
                            : {}
                        }
                      />
                    </div>
                  ),
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 mt-1"
                >
                  {loading ? "Saving…" : "Save Changes"}
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
