import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";


const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { wishlist, fetchWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(
          "Error fetching product:",
          error.response?.data || error.message
        );
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchWishlist();
  }, [id]);

  useEffect(() => {
    if (product && selectedSize) {
      const match = wishlist.find(
        (item) =>
          item.productId &&
          item.productId._id === product._id &&
          item.size === selectedSize
      );
      setIsWishlisted(!!match);
    }
  }, [wishlist, product, selectedSize]);
  
  
  

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const handleAddToCart = async () => {
    try {
      const payload = {
        productId: product._id,
        quantity,
      };

      if (selectedSize) payload.size = selectedSize;
      if (selectedColor) payload.color = selectedColor;

      await axios.post("/api/cart", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      console.log(payload);

      alert("Added to cart");
    } catch (error) {
      alert("Failed to add to cart");
      console.error(error.response?.data || error.message);
    }

  };


  const handleAddToWishlist = async () => {
    if (!selectedSize) {
      alert("Please select a size before adding to wishlist.");
      return;
    }
  
    try {
      const payload = {
        productId: product._id,
        size: selectedSize,
      };
  
      console.log("➡️ Wishlist Payload:", {
        productId: product._id,
        size: selectedSize,
      });

      console.log("Payload",{payload})
      await axios.post("/api/wishlist", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
  
      alert("Added to wishlist");
      fetchWishlist(); // ✅ refresh global context
    } catch (error) {
      if (error.response?.status === 409) {
        alert("This product with selected size is already in your wishlist.");
      } else {
        console.error("Wishlist error:", error);
        alert("Something went wrong while adding to wishlist.");
      }
    }
  };
  



  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading product details...</span>
      </div>
    );

  if (error) return <div className="error-container">{error}</div>;
  if (!product)
    return <div className="error-container">Product not found.</div>;

  return (
    <div className="product-container">
      <div className="product-card">
        <div className="grid grid-cols-1 md:grid-cols-2 product-grid">
          <div className="product-image-container">
            {product.isNew && <span className="badge">New Arrival</span>}
            <img
              src={product.image || "/placeholder.jpg"}
              alt={product.title}
              className="product-image"
            />
          </div>

          <div className="product-details">
            <h2 className="product-title">{product.title}</h2>
            <p className="product-description">{product.description}</p>

            <div className="product-price">${product.price.toFixed(2)}</div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Category:</span> {product.category}
              </div>
              <div className="meta-item">
                <span className="meta-label">Brand:</span> {product.brand}
              </div>
            </div>

            {product.totalStock > 0 ? (
              <div className="text-green-600 font-medium mb-4">
                In Stock ({product.totalStock} available)
              </div>
            ) : (
              <div className="text-red-600 font-medium mb-4">Out of Stock</div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="border border-gray-300 rounded px-3 py-2 w-20 text-center"
              />
            </div>

            {product.sizes && (
              <div className="mb-4">
                <label className="block font-medium mb-1">Size:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="">Select Size</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {product.colors && (
              <div className="mb-4">
                <label className="block font-medium mb-1">Color:</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="">Select Color</option>
                  {product.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>



              <button
                className="wishlist-btn"
                onClick={handleAddToWishlist}
                disabled={isWishlisted}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill={isWishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.8 4.6c-1.4-1.4-3.6-1.4-5 0L12 8.4 8.2 4.6c-1.4-1.4-3.6-1.4-5 0s-1.4 3.6 0 5l8.8 8.8 8.8-8.8c1.4-1.4 1.4-3.6 0-5z" />
                </svg>
                {isWishlisted ? "Already in Wishlist" : "Add to Wishlist"}
              </button>



            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
