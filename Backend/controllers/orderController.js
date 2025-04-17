import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// 🔹 Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount, payment } = req.body;

    const order = new Order({
      user: req.user._id,
      cartItems,
      totalAmount,
      payment,
      status: "Pending",
    });

    const savedOrder = await order.save();

    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Get all orders for the logged-in user
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Get a specific order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
