import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import Category from "../models/categoryModel.js";

//Create product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const photo = req.files?.photo;

    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      quantity,
      shipping,
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log("Create Product Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

//Get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

//Get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message,
    });
  }
};

//Get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error: error.message,
    });
  }
};

//Delete 
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully',
        });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting photo",
      error: error.message,
    });
  }
};

//Update product
export const updateProductController = async(req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const photo = req.files?.photo;

    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = await productModel.findByIdAndUpdate(req.params.pid,
        {...req.fields, slug: slugify(name)}, {new: true}
    )

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("Update Product Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error: error.message,
    });
  }
};
// Get paginated product list
export const productListController = async (req, res) => {
  try {
    const perPage = 10;
    const page = req.params.page || 1;

    const products = await productModel
      .find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select("-photo") // exclude photo to reduce payload
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log("Product List Error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching product list",
      error: error.message,
    });
  }
};

// Get total product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.countDocuments();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log("Product Count Error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching product count",
      error: error.message,
    });
  }
};

// Get products by category
export const productCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }

    const products = await productModel
      .find({ category: category._id })
      .select("-photo");

    res.status(200).send({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log("Product Category Error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};
