import express from "express";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productListController,
  productCountController,
  productCategoryController,
  searchProductController,
  relatedProductController,
  productFiltersController,
  adjustStockController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  upload.single("photo"),
  createProductController,
);
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController,
);
router.delete("/product/:pid", requireSignIn, isAdmin, deleteProductController);

router.patch("/stock/:id", requireSignIn, adjustStockController);

router.get("/product-list/:page", productListController);
router.get("/product-count", productCountController);
router.get("/product-category/:slug", productCategoryController);
router.get("/related-product/:pid/:cid", relatedProductController);
router.post("/product-filters", productFiltersController);
router.get("/get-product", getProductController);
router.get("/get-product/:slug", getSingleProductController);
router.get("/product-photo/:pid", productPhotoController);
router.get("/search/:keyword", searchProductController);

export default router;
