import express from "express";
import {
  createPaymentIntentController,
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/orderController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Stripe payment intent
router.post(
  "/create-payment-intent",
  requireSignIn,
  createPaymentIntentController,
);

// Save order after payment confirmed
router.post("/create-order", requireSignIn, createOrderController);

// Get logged-in user's own orders
router.get("/my-orders", requireSignIn, getUserOrdersController);

// Admin — get all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// Admin — update order status
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  updateOrderStatusController,
);

export default router;
