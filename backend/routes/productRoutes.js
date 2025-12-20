import express from "express";
import {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//Get product
router.get("/get-product", getProductController);

//Single product
router.get("/get-product/:slug", getSingleProductController);

//Get photo
router.get('/product-photo/:pid', productPhotoController);

//Delete product
router.delete('/delete-product/:pid', deleteProductController);

//Filter product
router.post("/product-filters", productFilterController);

//Product count
router.get('/product-count', productCountController);

//Product per page
router.get('/product-list/:page', productListController);

//Search product
router.get('/search/:keyword', searchProductController);

//Similar product
router.get('/related-product/:pid/:cid', relatedProductController);

router.get('/product-category/:slug', productCategoryController);

export default router;
