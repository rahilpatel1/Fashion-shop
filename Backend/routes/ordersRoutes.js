import express from "express";
const router = express.Router();

// POST request to create an order
router.post("/", (req, res) => {
  const orderData = req.body;  // The order data is coming from the frontend's request body

  // Log the received order data (for now, simulate saving to DB)
  console.log("Order received:", orderData);

  // You can simulate saving this to a database here (MongoDB, SQL, etc.)

  // Send a response back if the order is successfully created
  res.status(201).json({ message: "Order placed successfully", order: orderData });
});

// Default export to be used in the server
export default router;
