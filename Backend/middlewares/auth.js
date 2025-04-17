import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/env.js";

// Middleware to protect user routes
export const protect = async (req, res, next) => {
  let token;

  // ✅ Support both Authorization header AND cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Not authorized, token failed",
    });
  }
};

// Middleware to protect admin-only routes
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: "Not authorized as admin",
    });
  }
};
