import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

//Create product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const photo = req.files?.photo;

    switch (true) {
      case !name:
        return res.status(400).send({ message: "Name is required" });
      case !description:
        return res.status(400).send({ message: "Description is required" });
      case !price:
        return res.status(400).send({ message: "Price is required" });
      case !category:
        return res.status(400).send({ message: "Category is required" });
      case !quantity:
        return res.status(400).send({ message: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ message: "Photo should be less than 1MB" });
    }
    const shippingValue = shipping === "1";

    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      quantity,
      shipping: shippingValue,
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
    const product = await productModel.findById(req.params.pid).select("photo");
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
    const product = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
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
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const photo = req.files?.photo;

    switch (true) {
      case !name:
        return res.status(400).send({ message: "Name is required" });
      case !description:
        return res.status(400).send({ message: "Description is required" });
      case !price:
        return res.status(400).send({ message: "Price is required" });
      case !category:
        return res.status(400).send({ message: "Category is required" });
      case !quantity:
        return res.status(400).send({ message: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ message: "Photo should be less than 1MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

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

//Filter product
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};

    if (checked?.length > 0) args.category = checked;
    if (radio && radio.length === 2)
      args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args).select("-photo");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

//Product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};

//Product page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = parseInt(req.params.page) || 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in per page control",
      error,
    });
  }
};

//Search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.status(400).send({
        success: false,
        message: "Keyword is required",
      });
    }

    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).send(results);
  } catch (error) {
    console.log("SEARCH ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error in search API",
      error,
    });
  }
};



//Similar product
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related product",
      error,
    });
  }
};
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });

    const products = await productModel
      .find({ category: category._id })
      .populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting products",
    });
  }
};

