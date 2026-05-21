import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);

  const stats = [
    { label: "Name", value: user?.name, icon: "👤" },
    { label: "Email", value: user?.email, icon: "📧" },
    { label: "Phone", value: user?.phone, icon: "📞" },
  ];

  return (
    <Layout title="Admin Dashboard — EliteMart">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          <div className="md:col-span-3 flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm"
                >
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-0.5">
                      {value || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Welcome back, {user?.name} 👋
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Manage your store from the admin panel on the left.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
