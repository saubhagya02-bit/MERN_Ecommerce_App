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

export const createOrderController = async (req, res) => {
  try {
    const { cartItems, deliveryAddress, paymentIntentId } = req.body;

    const products = cartItems.map((item) => ({
      product: item._id || item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const totalAmount = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0,
    );

    const order = await new orderModel({
      products,
      buyer: req.user._id,
      deliveryAddress,
      stripePaymentIntentId: paymentIntentId,
      totalAmount,
      paymentStatus: "paid",
      orderStatus: "processing",
    }).save();

    //Decrement stock for each purchased product
    await Promise.all(
      products.map(({ product: pid, quantity }) =>
        productModel.findByIdAndUpdate(
          pid,
          { $inc: { quantity: -quantity } },
          { new: true },
        ),
      ),
    );

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// Get Orders for Logged-in User
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

// Get All Orders (Admin)
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
