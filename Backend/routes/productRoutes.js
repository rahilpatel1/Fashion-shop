import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";
import Product from "../models/Product.js";
import { protect, admin } from "../middlewares/auth.js";

const router = express.Router();

// Set up multer for local image storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

/**
 * 🔹 Add a New Product
 */
router.post("/add", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const existingProduct = await Product.findOne({ title: req.body.title });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with this title already exists." });
    }

    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      images: req.file ? `/uploads/${req.file.filename}` : "",
      sizes: req.body.sizes ? req.body.sizes.split(",") : [], //  Add Sizes
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 🔹 Get All Products (Supports limit, pagination, sorting)
 * e.g., /api/products?limit=8
 *       /api/products?page=2&limit=10
 */
router.get("/", async (req, res) => {
  try {
    const { category = "", sort = "createdAt", order = "desc", page = 1, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const perPage = parseInt(limit) || 0; // if 0, return all

    const query = {};
    if (category) query.category = category;

    const totalProducts = await Product.countDocuments(query);
    let productQuery = Product.find(query).sort({ [sort]: order === "asc" ? 1 : -1 });

    if (perPage > 0) {
      productQuery = productQuery.limit(perPage).skip((pageNumber - 1) * perPage);
    }

    const products = await productQuery;
    res.json({ products, totalProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 🔹 Get Single Product by ID
 */
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 🔹 Update Product
 */
router.put("/update/:id", protect, admin, upload.single("image"), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete old image if uploading new one
    if (req.file && product.images) {
      const oldImagePath = `.${product.images}`;
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      product.images = `/uploads/${req.file.filename}`;
    }

    // Update fields
    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.sizes = req.body.sizes ? req.body.sizes.split(",") : product.sizes;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 🔹 Delete Product + Image
 */
router.delete("/delete/:id", protect, admin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.images) {
      const imagePath = `.${product.images}`;
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
