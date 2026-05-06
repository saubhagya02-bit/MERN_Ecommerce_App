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
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController,
);
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController,
);

// Paginated product list
router.get("/product-list/:page", productListController);

// Total product count
router.get("/product-count", productCountController);

// Products by category
router.get("/product-category/:slug", productCategoryController);

// Related products
router.get("/related-product/:pid/:cid", relatedProductController);
 
// Filter products by category and price
router.post("/product-filters", productFiltersController);

//Get product
router.get("/get-product", getProductController);

//Single product
router.get("/get-product/:slug", getSingleProductController);

//Get photo
router.get("/product-photo/:pid", productPhotoController);

// Search products by keyword
router.get("/search/:keyword", searchProductController);

//Delete product
router.delete("/product/:pid", deleteProductController);

export default router;
