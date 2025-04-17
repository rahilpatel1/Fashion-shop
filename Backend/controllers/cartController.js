import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ✅ GET USER CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ userId: req.user._id, items: [] });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

// ✅ ADD TO CART
export const addToCart = async (req, res) => {
  const { productId, quantity, size } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.totalStock < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size
    );

    if (itemIndex > -1) {
      const existingQty = cart.items[itemIndex].quantity;
      if (existingQty + quantity > product.totalStock) {
        return res.status(400).json({ error: "Quantity exceeds available stock" });
      }

      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, size });
    }

    await cart.save();
    const updatedCart = await cart.populate("items.productId");
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error("❌ Add to Cart Error:", err);
    res.status(500).json({ error: "Unable to add item to cart", details: err.message });
  }
};

// ✅ UPDATE CART ITEM
export const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Cart item not found" });

    const product = await Product.findById(item.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (quantity > product.totalStock) {
      return res.status(400).json({ error: "Requested quantity exceeds stock" });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await cart.populate("items.productId");
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error("❌ Update Cart Error:", err);
    res.status(500).json({ error: "Unable to update cart item", details: err.message });
  }
};

// ✅ REMOVE CART ITEM
export const removeCartItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    const updatedCart = await cart.populate("items.productId");
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error("❌ Remove Cart Item Error:", err);
    res.status(500).json({ error: "Unable to remove cart item", details: err.message });
  }
};
