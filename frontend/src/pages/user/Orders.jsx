import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";

const Orders = () => (
  <Layout title="My Orders">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <UserMenu />
        </div>
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Orders</h2>
            <p className="text-gray-500 text-sm">No orders yet. Start shopping!</p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default Orders;