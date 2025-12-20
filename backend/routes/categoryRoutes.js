import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  createCategoryController,
  updateCategoryController,
  getcategoryController,
  singleCategoryController,
  deletecategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//Create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//Update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//Get all category
router.get("/get-category", getcategoryController);

//Get single category
router.get("/single-category/:slug", singleCategoryController);

//Delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deletecategoryController
);

export default router;
