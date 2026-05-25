import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import Category from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;

    const photo = req.file;

    // Validation
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
      case !photo:
        return res.status(400).send({ error: "Photo is required" });
    }

    // Upload image to Cloudinary
    let imageUrl = "";

    if (photo) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "mern-ecommerce-products",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(photo.buffer);
      });

      imageUrl = result.secure_url;
    }

    // Save product
    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      quantity,
      shipping,
      photo: imageUrl,
    });

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).send({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, total: products.length, products });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error getting products", error });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({ success: true, product });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error getting product",
      error: error.message,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
    res.status(404).send({ success: false, message: "No photo found" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error getting photo",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res
      .status(200)
      .send({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
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
        return res.status(400).send({ error: "Photo < 1MB" });
    }
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true },
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
    console.error("Update Product Error:", error);
    res.status(500).send({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = Number(req.query.limit) || 8;
    const page = Number(req.params.page) || 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, products });
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: "Error in product list", error });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.countDocuments();
    res.status(200).send({ success: true, total });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching count",
      error: error.message,
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category)
      return res
        .status(404)
        .send({ success: false, message: "Category not found" });
    const products = await productModel
      .find({ category: category._id })
      .select("-photo")
      .populate("category");
    res
      .status(200)
      .send({ success: true, category, count: products.length, products });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching by category",
      error: error.message,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const keyword = req.params.keyword?.trim();
    if (!keyword)
      return res
        .status(400)
        .send({ success: false, message: "Keyword required" });
    const category = await Category.findOne({
      name: { $regex: keyword, $options: "i" },
    });
    const query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        ...(category ? [{ category: category._id }] : []),
      ],
    };
    const products = await productModel.find(query).select("-photo");
    res.status(200).send({ success: true, count: products.length, products });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Search error", error: error.message });
  }
};

export const relatedProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({ category: req.params.cid, _id: { $ne: req.params.pid } })
      .select("-photo")
      .limit(4)
      .populate("category");
    res.status(200).send({ success: true, products });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching related",
      error: error.message,
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio, page = 1, perPage = 6 } = req.body;
    const args = {};
    if (checked?.length > 0) args.category = { $in: checked };
    if (radio?.length === 2) args.price = { $gte: radio[0], $lte: radio[1] };
    const total = await productModel.countDocuments(args);
    const products = await productModel
      .find(args)
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, total, products });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Filter error", error: error.message });
  }
};

export const adjustStockController = async (req, res) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;

    if (delta === undefined || typeof delta !== "number")
      return res
        .status(400)
        .json({ success: false, message: "delta must be a number" });

    const product = await productModel.findById(id).select("quantity name");
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (product.quantity + delta < 0)
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} unit(s) in stock`,
        available: product.quantity,
      });

    const updated = await productModel
      .findByIdAndUpdate(id, { $inc: { quantity: delta } }, { new: true })
      .select("quantity name");

    res.status(200).json({
      success: true,
      message: delta < 0 ? "Stock reduced" : "Stock restored",
      quantity: updated.quantity,
    });
  } catch (error) {
    console.error("Adjust stock error:", error);
    res.status(500).json({ success: false, message: "Error adjusting stock" });
  }
};
