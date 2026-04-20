import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import orderService from "../../api/orderService";
import { formatPrice } from "../../utils/formatters";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100   text-blue-700",
  delivered: "bg-green-100  text-green-700",
  cancelled: "bg-red-100    text-red-700",
};

const PAYMENT_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100   text-red-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderService.getMyOrders();
      if (data?.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error("Failed to load orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Layout title="My Orders — EShop">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <UserMenu />
          </div>

          <div className="md:col-span-3 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
              <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                {orders.length} Orders
              </span>
            </div>

            {loading && (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && orders.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-gray-500">
                  You haven&apos;t placed any orders yet.
                </p>
              </div>
            )}

            {!loading &&
              orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Order ID
                      </p>
                      <p className="text-sm font-mono font-medium text-gray-700 mt-0.5">
                        #{order._id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          STATUS_STYLES[order.orderStatus] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          PAYMENT_STYLES[order.paymentStatus] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    {order.products.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>
                          {item.name} × {item.quantity || 1}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex flex-wrap justify-between items-center gap-2">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        Deliver to:{" "}
                      </span>
                      {order.deliveryAddress}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-base font-bold text-primary">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
