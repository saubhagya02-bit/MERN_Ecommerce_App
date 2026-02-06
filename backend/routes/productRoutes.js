import express from "express";
import {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
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
router.delete('/product/:pid', deleteProductController);

export default router;
