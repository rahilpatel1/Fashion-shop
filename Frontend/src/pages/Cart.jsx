import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThankYou from "./Thankyou";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(data);
    } catch (err) {
      console.error("Error loading cart", err.response?.data || err.message);
      setError(
        "Failed to load cart. " +
          (err.response?.data?.error ||
            err.response?.data?.details ||
            "Unknown error.")
      );
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity, size) => {
    try {
      const cartItem = cart.items.find(
        (item) => item.productId._id === productId && item.size === size
      );
      const itemId = cartItem?._id;

      await axios.put(
        `/api/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const removeItem = async (productId, size) => {
    const cartItem = cart.items.find(
      (item) => item.productId._id === productId && item.size === size
    );
    const itemId = cartItem?._id;

    try {
      await axios.delete(`/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      const confirmRemove = window.confirm(
        "Quantity is 1. Do you want to remove this product from the cart?"
      );
      if (confirmRemove) {
        removeItem(item.productId._id, item.size);
      }
    } else {
      updateQuantity(item.productId._id, item.quantity - 1, item.size);
    }
  };

  const handleIncrease = (item) => {
    if (item.quantity < item.productId.totalStock) {
      updateQuantity(item.productId._id, item.quantity + 1, item.size);
    }
  };

  const getTotal = () => {
    if (!cart?.items || cart.items.length === 0) return "0.00";
    return cart.items
      .reduce((total, item) => total + item.productId.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    const outOfStockItems = cart.items.filter(
      (item) => item.productId.totalStock <= 0
    );

    if (outOfStockItems.length > 0) {
      alert(
        "Some products are out of stock. Please remove them before proceeding."
      );
      return;
    }

    // alert("Proceeding to checkout...");
    navigate("/Checkout");
  };

  const moveToWishlist = async (item) => {
    try {
      await axios.post(
        "/api/wishlist",
        { productId: item.productId._id , size: item.size,},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
  
      // Remove from cart
      await axios.delete(`/api/cart/${item._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      fetchCart();
      alert("Moved to wishlist!");
    } catch (error) {
      console.error("Failed to move to wishlist", error.response?.data || error.message);
      alert("Failed to move to wishlist.");
    }
  };
  

  if (loading) return <div className="p-6">Loading cart...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>

      {cart?.items?.length > 0 ? (
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          {cart.items.map((item) => {
            console.log(item); // Add this line to check the structure of the item
            return(
            <div
              // key={item.productId._id}
              key={`${item.productId._id}_${item.size}`} // Concatenating productId and _id for uniqueness
              className="flex flex-col md:flex-row gap-6 mb-8 border-b pb-6"
            >
              <img
                src={item.productId.image}
                alt={item.productId.title}
                className="w-full md:w-64 h-64 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">
                  {item.productId.title}
                </h2>
                <p className="text-gray-600 mb-2">{item.productId.description}</p>
                <p className="font-semibold text-purple-600 text-lg mb-2">
                  ${item.productId.price}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Category:</strong> {item.productId.category} &nbsp;
                  <strong>Brand:</strong> {item.productId.brand} &nbsp;
                  <strong>Size:</strong> {item.size || "Not selected"} 
                  {/* {item.selectedSize} */}
                </p>

                {/* 🔹 Stock Status */}
                <p
                  className={`font-bold mt-2 ${
                    item.productId.totalStock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.productId.totalStock > 0 ? "In Stock" : "Out of Stock"}
                </p>

                {/* Quantity Controls (only show if in stock) */}
                {item.productId.totalStock > 0 && (
                  <div className="mt-4 flex items-center gap-4">
                    <strong>Quantity:</strong>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrease(item)}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700"
                      >
                        −
                      </button>
                      <span className="px-4 text-lg font-medium">
                        {item.quantity}
                      </span>
                      <button
                      onClick={() => handleIncrease(item)}
                      className={`px-3 py-1 rounded-full ${
                        item.quantity < item.productId.totalStock
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                      disabled={item.quantity >= item.productId.totalStock}
                    >
                        +
                      </button>
                    </div>
                  </div>
                )}

<button
  onClick={() => moveToWishlist(item)}
  className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
>
  Move to Wishlist
</button>

              </div>
            </div>
          )})}

          {/* ✅ Checkout Total + Button */}
          <div className="mt-6 text-right">
            <h3 className="text-xl font-semibold">Total: ${getTotal()}</h3>
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:opacity-90 transition"
            >
              Proceed to Checkout
            </button>
          </div>
 
        </div>
      ) : (
        <p className="text-2xl text-center mb-4">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
