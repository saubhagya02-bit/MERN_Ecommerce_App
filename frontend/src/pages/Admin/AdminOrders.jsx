import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import orderService from "../../api/orderService";
import { formatPrice } from "../../utils/formatters";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];

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

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderService.getAllOrders();
      if (data?.success) {
        setOrders(data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const { data } = await orderService.updateOrderStatus(orderId, newStatus);
      if (data?.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: newStatus } : o,
          ),
        );
        toast.success(`Order status updated to "${newStatus}"`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === filterStatus);

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.orderStatus === s).length;
    return acc;
  }, {});

  return (
    <Layout title="All Orders — Admin">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>

          <div className="md:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>
              <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                {orders.length} Total
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATUS_OPTIONS.map((s) => (
                <div
                  key={s}
                  className={`bg-white rounded-xl border p-4 text-center cursor-pointer transition-shadow hover:shadow-md ${
                    filterStatus === s
                      ? "border-primary shadow-md"
                      : "border-gray-100"
                  }`}
                  onClick={() =>
                    setFilterStatus((prev) => (prev === s ? "all" : s))
                  }
                >
                  <p className="text-2xl font-bold text-gray-800">
                    {counts[s]}
                  </p>
                  <p
                    className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full inline-block mt-1 ${STATUS_STYLES[s]}`}
                  >
                    {s}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Filter:</span>
              {["all", ...STATUS_OPTIONS].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize transition-colors ${
                    filterStatus === s
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === "all"
                    ? `All (${orders.length})`
                    : `${s} (${counts[s]})`}
                </button>
              ))}
            </div>

            {loading && (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && filteredOrders.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-gray-500">No orders found.</p>
              </div>
            )}

            {!loading &&
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div
                    className="p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(order._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {order.buyer?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {order.buyer?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 text-center">
                      <p>
                        {order.products?.length} item
                        {order.products?.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          PAYMENT_STYLES[order.paymentStatus] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>

                      <span className="text-sm font-bold text-primary">
                        {formatPrice(order.totalAmount)}
                      </span>

                      <select
                        value={order.orderStatus}
                        disabled={updating === order._id}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`text-xs font-semibold px-2 py-1.5 rounded-full border-0 cursor-pointer capitalize focus:outline-none focus:ring-2 focus:ring-primary ${
                          STATUS_STYLES[order.orderStatus] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-white text-gray-700"
                          >
                            {s}
                          </option>
                        ))}
                      </select>

                      {updating === order._id && (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      )}

                      <span className="text-gray-400 text-sm">
                        {expandedId === order._id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {expandedId === order._id && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50 flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                            Buyer
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {order.buyer?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.buyer?.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.buyer?.phone}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                            Delivery Address
                          </p>
                          <p className="text-sm text-gray-700">
                            {order.deliveryAddress}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                            Payment ID
                          </p>
                          <p className="text-xs font-mono text-gray-600 break-all">
                            {order.stripePaymentIntentId || "—"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                          Items Ordered
                        </p>
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">
                                  Product
                                </th>
                                <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500">
                                  Qty
                                </th>
                                <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">
                                  Price
                                </th>
                                <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">
                                  Subtotal
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map((item, i) => (
                                <tr
                                  key={i}
                                  className="border-b border-gray-50 last:border-0"
                                >
                                  <td className="px-4 py-3 text-gray-700 font-medium">
                                    {item.name}
                                  </td>
                                  <td className="px-4 py-3 text-center text-gray-500">
                                    {item.quantity || 1}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-500">
                                    {formatPrice(item.price)}
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                                    {formatPrice(
                                      item.price * (item.quantity || 1),
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-gray-50 border-t border-gray-100">
                                <td
                                  colSpan={3}
                                  className="px-4 py-3 text-right font-bold text-gray-700"
                                >
                                  Total
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-primary">
                                  {formatPrice(order.totalAmount)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
