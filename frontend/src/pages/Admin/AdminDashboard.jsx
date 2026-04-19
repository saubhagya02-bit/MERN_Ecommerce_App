import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { selectCurrentUser } from "../../store/slices/authSlice";

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <Layout title="Admin Dashboard">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Admin Info
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Name", value: user?.name },
                  { label: "Email", value: user?.email },
                  { label: "Phone", value: user?.phone },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex gap-3 items-center border-b border-gray-50 pb-3"
                  >
                    <span className="w-20 text-sm font-medium text-gray-500">
                      {label}
                    </span>
                    <span className="text-sm text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
