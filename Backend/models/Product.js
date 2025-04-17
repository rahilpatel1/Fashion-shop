import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{ user: String, comment: String, rating: Number }],
  image: { type: String }, 
  totalStock: { type: Number, required: true },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
    // ✅ NEW FIELD FOR SIZE SUPPORT
    sizes: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
