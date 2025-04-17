import React, { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWishlist = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get("/api/wishlist", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                withCredentials: true,
            });
            setWishlist(data); // each item: { _id, productId }
        } catch (err) {
            setError("Failed to load wishlist.");
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (wishlistId) => {
        try {
          await axios.delete(`/api/wishlist/${wishlistId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          });
      
          setWishlist((prev) => prev.filter((item) => item._id !== wishlistId));
        } catch (err) {
          console.error("Failed to remove wishlist item:", err);
        }
      };
      

      const handleAddToCart = async (wishlistItemId, product, size) => {
        try {
          const payload = {
            productId: product._id,
            quantity: 1,
            size,
          };
      
          await axios.post("/api/cart", payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          });
      
          // ✅ Remove only the selected wishlist item
          await axios.delete(`/api/wishlist/${wishlistItemId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      
          setWishlist((prev) => prev.filter((item) => item._id !== wishlistItemId));
          alert("Moved to cart successfully!");
        } catch (error) {
          console.error("Failed to add to cart", error.response?.data || error.message);
        }
      };
      


    useEffect(() => {
        fetchWishlist();
    }, []);

    if (loading) return <div className="p-6">Loading wishlist...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="py-12 px-6">
            <h1 className="text-3xl font-bold text-center mb-8">My Wishlist</h1>

            {wishlist.length > 0 ? (
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                    {wishlist.map(({_id, productId, size }) => {
                      if (!productId) return null;
                      return(
                        <div
                            key={productId._id}
                            className="flex flex-col md:flex-row gap-6 mb-8 border-b pb-6"
                        >
                            <img
                                src={productId.image}
                                alt={productId.title}
                                className="w-full md:w-64 h-64 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold mb-2">{productId.title}</h2>
                                <p className="text-gray-600 mb-2">{productId.description}</p>
                                <p className="font-semibold text-purple-600 text-lg mb-2">
                                    ${productId.price.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Category:</strong> {productId.category} &nbsp;
                                    <strong>Brand:</strong> {productId.brand} &nbsp;
                                    <strong>Size:</strong> {size || "Not selected"}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => handleRemove(_id)}
                                        className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        Remove from Wishlist
                                    </button>

                                    <button
                                        onClick={() => handleAddToCart(_id, productId, size)}
                                        className="mt-4 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                  
                    })
                }

                </div>
            ) : (
                <p className="text-2xl text-center mb-4">Your wishlist is empty.</p>
            )}
        </div>
    );
};

export default Wishlist;
