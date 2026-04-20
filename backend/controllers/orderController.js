import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing from your .env file");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export const createPaymentIntentController = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).send({ success: false, message: "Cart is empty" });
    }

    const productIds = cartItems.map((item) => item._id);
    const products = await productModel.find({ _id: { $in: productIds } });

    const total = products.reduce((sum, product) => {
      const cartItem = cartItems.find((i) => i._id === product._id.toString());
      return sum + product.price * (cartItem?.quantity || 1);
    }, 0);

    const amountInCents = Math.round(total * 100);

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    res.status(200).send({
      success: true,
      clientSecret: paymentIntent.client_secret,
      totalAmount: total,
    });
  } catch (error) {
    console.error("Create PaymentIntent Error:", error);
    res.status(500).send({
      success: false,
      message: "Payment initiation failed",
      error: error.message,
    });
  }
};

// ─── Create Order After Payment ────────────────────────────────
export const createOrderController = async (req, res) => {
  try {
    const { cartItems, deliveryAddress, paymentIntentId } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).send({ success: false, message: "Cart is empty" });
    }
    if (!deliveryAddress) {
      return res
        .status(400)
        .send({ success: false, message: "Delivery address is required" });
    }
    if (!paymentIntentId) {
      return res
        .status(400)
        .send({ success: false, message: "Payment intent ID is required" });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).send({
        success: false,
        message: "Payment not confirmed. Please try again.",
      });
    }

    const productIds = cartItems.map((item) => item._id);
    const products = await productModel.find({ _id: { $in: productIds } });

    const orderProducts = products.map((product) => ({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity:
        cartItems.find((i) => i._id === product._id.toString())?.quantity || 1,
    }));

    const totalAmount = orderProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await new orderModel({
      products: orderProducts,
      buyer: req.user._id,
      deliveryAddress,
      totalAmount,
      paymentStatus: "paid",
      stripePaymentIntentId: paymentIntentId,
      orderStatus: "processing",
    }).save();

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// ─── Get Orders for Logged-in User ────────────────────────────
export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products.product", "name photo")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ─── Get All Orders (Admin) ────────────────────────────────────
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products.product", "name")
      .populate("buyer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid order status" });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true },
    );

    if (!order) {
      return res
        .status(404)
        .send({ success: false, message: "Order not found" });
    }

    res.status(200).send({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
