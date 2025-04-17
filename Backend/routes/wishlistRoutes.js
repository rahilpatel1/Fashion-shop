import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isWishlisted,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.use(protect); // Require auth for all wishlist routes

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:id", removeFromWishlist);
router.get("/check/:productId", isWishlisted);

export default router;
