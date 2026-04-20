import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../components/Layout/Layout";
import {
  selectCurrentOrder,
  clearCurrentOrder,
} from "../../store/slices/orderSlice";
import { formatPrice } from "../../utils/formatters";
import { HiCheckCircle } from "react-icons/hi";

const STATUS_STYLES = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100   text-blue-700",
  delivered: "bg-green-100  text-green-700",
  cancelled: "bg-red-100    text-red-700",
};

const OrderSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrder);

  useEffect(() => {
    if (!order) navigate("/");
  }, [order, navigate]);

  if (!order) return null;

  const handleContinue = () => {
    dispatch(clearCurrentOrder());
    navigate("/");
  };

  const handleViewOrders = () => {
    dispatch(clearCurrentOrder());
    navigate("/dashboard/user/orders");
  };

  return (
    <Layout title="Order Confirmed — EShop">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <HiCheckCircle className="text-7xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-500">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Order ID
              </p>
              <p className="text-sm font-mono font-medium text-gray-700">
                #{order._id}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-600"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>

          <hr className="border-gray-100" />

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Items Ordered
            </p>
            <div className="flex flex-col gap-3">
              {order.products.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                      {item.quantity || 1}
                    </span>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {formatPrice(item.price * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Delivery Address
              </p>
              <p className="text-gray-700">{order.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Payment Status
              </p>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full capitalize">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total Paid</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleViewOrders}
            className="btn-outline flex-1 py-3 text-base"
          >
            View My Orders
          </button>
          <button
            onClick={handleContinue}
            className="btn-primary flex-1 py-3 text-base"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
