import express from "express";
import {
  createReviewController,
  getReviewsController,
  deleteReviewController,
} from "../controllers/reviewController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:productId", requireSignIn, createReviewController);
router.get("/:productId", getReviewsController);
router.delete("/:reviewId", requireSignIn, deleteReviewController);

export default router;
