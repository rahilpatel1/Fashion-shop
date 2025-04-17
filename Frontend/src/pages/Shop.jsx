import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import Navigation Hook
import axios from "axios";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize Navigation

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products?category=${category}&page=${page}`);

        // Check if data.products is an array before accessing its length
      // if (Array.isArray(data)) {
      //   setProducts((prevProducts) => (page === 1 ? data : [...prevProducts, ...data]));
        
      //   // Set hasMore to true if the number of products returned is equal to the limit (possible more products)
      //   setHasMore(data.length === 8); // If 8 products were returned, more products might exist
      // } else {
      //   setError("No products found.");
      //   console.error("Expected an array of products, but got:", data.products);
      // }
      if (Array.isArray(data.products)) {
        setProducts((prevProducts) => (page === 1 ? data.products : [...prevProducts, ...data.products]));
        setHasMore(data.products.length === 8);
      } else {
        setError("No products found.");
        console.error("Expected an array of products, but got:", data);
      }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset page to 1 when the category changes
    setProducts([]); // Clear the current product list when category changes
  };
  


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Shop Products</h1>

      <select onChange={handleCategoryChange} className="p-2 border rounded">
        <option value="">All Categories</option>
        <option value="Men's Clothing">Men</option>
        <option value="Women's Clothing">Women</option>
        <option value="Footwear">Footwear</option>
        <option value="Accessories">Accessories</option>
      </select>

      {/* Loading & Error Handling */}
      {loading ? (
        <div className="text-center p-6">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/product/${product._id}`)} // ✅ Navigate on Click
              >
                <img
                  src={product.image || "/placeholder.jpg"} // ✅ Use `images` as a single string field
                  alt={product.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-lg font-semibold">{product.title}</p>
                <p className="text-gray-600">${product.price}</p>
              </div>
            ))
          ) : (
            <p className="text-center col-span-4">No products found.</p>
          )}
        </div>
      )}

      {/* ✅ Show Load More button only if more pages exist */}
      {hasMore && (
        <button onClick={() => setPage(page + 1)} className="mt-6 w-full bg-black text-white px-6 py-3 rounded">
          Load More
        </button>
      )}
    </div>
  );
};

export default Shop;
