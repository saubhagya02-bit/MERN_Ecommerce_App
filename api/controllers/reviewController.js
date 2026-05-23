import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";

const syncProductRating = async (productId) => {
  const stats = await reviewModel.aggregate([
    { $match: { product: productId } },
    {
      $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } },
    },
  ]);
  await productModel.findByIdAndUpdate(productId, {
    averageRating: stats[0] ? Math.round(stats[0].avg * 10) / 10 : 0,
    reviewCount: stats[0]?.count ?? 0,
  });
};

export const createReviewController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res
        .status(400)
        .json({ success: false, message: "Rating must be 1–5" });

    const review = await reviewModel
      .findOneAndUpdate(
        { product: productId, user: req.user._id },
        { rating, comment },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .populate("user", "name");

    await syncProductRating(review.product);
    res.status(200).json({ success: true, message: "Review saved", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving review" });
  }
};

export const getReviewsController = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};

export const deleteReviewController = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    if (review.user.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ success: false, message: "Not authorised" });
    const productId = review.product;
    await review.deleteOne();
    await syncProductRating(productId);
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Error deleting review" });
  }
};
