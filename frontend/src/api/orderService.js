import axiosInstance from "./axiosInstance";

const orderService = {
  // Create Stripe payment intent
  createPaymentIntent: (cartItems) =>
    axiosInstance.post("/order/create-payment-intent", { cartItems }),

  // Save order to DB after payment confirmed
  createOrder: (cartItems, deliveryAddress, paymentIntentId) =>
    axiosInstance.post("/order/create-order", {
      cartItems,
      deliveryAddress,
      paymentIntentId,
    }),

  // Get current user's orders
  getMyOrders: () => axiosInstance.get("/order/my-orders"),

  // Admin — get all orders
  getAllOrders: () => axiosInstance.get("/order/all-orders"),

  // Admin — update order status
  updateOrderStatus: (orderId, orderStatus) =>
    axiosInstance.put(`/order/order-status/${orderId}`, { orderStatus }),
};

export default orderService;
