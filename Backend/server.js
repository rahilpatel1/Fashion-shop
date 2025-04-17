import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import config from "./config/env.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/ordersRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";  

const app = express();

// ✅ Middleware for CORS and JSON parsing
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Allow frontend requests
    credentials: true, // ✅ Allow cookies & auth tokens
  })
);
app.use(express.json()); // ✅ Parse JSON requests
app.use(cookieParser()); // ✅ Parse cookies

// ✅ Connect Database
connectDB();

// ✅ Register Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes); // ✅ Orders route included
app.use("/api/wishlist", wishlistRoutes);

app.use("/api/admin", adminRoutes);

// ✅ Example Protected Route
app.use("/api/protected-route", (req, res) => {
  res.json({ success: true, message: "Access granted", user: req.user });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});






// ✅ Start Server
const PORT = config.port || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`)
);
