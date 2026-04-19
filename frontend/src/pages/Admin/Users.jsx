import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import authService from "../../api/authService";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await authService.getAllUsers();
      if (data?.success) {
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout title="All Users — Admin">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
                <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                  {users.length} Total
                </span>
              </div>

              {loading && (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!loading && users.length === 0 && (
                <p className="text-center text-gray-400 py-16">
                  No users found.
                </p>
              )}

              {!loading && users.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-3 font-semibold text-gray-500 pr-4">
                          #
                        </th>
                        <th className="pb-3 font-semibold text-gray-500 pr-4">
                          Name
                        </th>
                        <th className="pb-3 font-semibold text-gray-500 pr-4">
                          Email
                        </th>
                        <th className="pb-3 font-semibold text-gray-500 pr-4">
                          Phone
                        </th>
                        <th className="pb-3 font-semibold text-gray-500 pr-4">
                          Address
                        </th>
                        <th className="pb-3 font-semibold text-gray-500 pr-4">
                          Role
                        </th>
                        <th className="pb-3 font-semibold text-gray-500">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          key={user._id}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 pr-4 text-gray-400 font-medium">
                            {index + 1}
                          </td>

                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-800">
                                {user.name}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 pr-4 text-gray-600">
                            {user.email}
                          </td>

                          <td className="py-4 pr-4 text-gray-600">
                            {user.phone || "—"}
                          </td>

                          <td className="py-4 pr-4 text-gray-600 max-w-[160px] truncate">
                            {user.address || "—"}
                          </td>

                          <td className="py-4 pr-4">
                            {user.role === 1 ? (
                              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                                Admin
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                                User
                              </span>
                            )}
                          </td>

                          <td className="py-4 text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
