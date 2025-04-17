import Wishlist from "../models/wishlistModel.js";

// GET all wishlist items for a user
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id })
      .populate("productId")
      .select("productId size");
    const filteredWishlist = wishlist.filter(item => item.productId); // Use new variable
    res.status(200).json(filteredWishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
};


// POST add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.user._id;

    const existing = await Wishlist.findOne({ userId, productId, size});
    if (existing) return res.status(409).json({ message: "Already in wishlist" });

    const wishlistItem = new Wishlist({ userId, productId, size });
    await wishlistItem.save();
    res.status(201).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to wishlist", error: error.message });
  }
};

// DELETE remove by wishlist item ID
export const removeFromWishlist = async (req, res) => {
    try {
      const { id } = req.params;
      await Wishlist.findOneAndDelete({ _id: id, userId: req.user._id });
      res.status(200).json({ message: "Removed from wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from wishlist", error: error.message });
    }
  };
  

// Check for Already in wishlist
export const isWishlisted = async (req, res) => {
    try {
      const exists = await Wishlist.findOne({
        userId: req.user._id,
        productId: req.params.productId,
      });
      res.json({ isWishlisted: !!exists });
    } catch (error) {
      res.status(500).json({ message: "Error checking wishlist", error: error.message });
    }
  };
  
