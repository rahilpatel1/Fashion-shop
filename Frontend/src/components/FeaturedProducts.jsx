import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get("/api/products?limit=8");
        setFeaturedProducts(data.products || data);
      } catch (err) {
        console.error("Error loading featured products:", err);
        setError("Failed to load featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // 🔁 Auto scroll effect
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 250, behavior: "smooth" });
      }
    }, 3000); // scroll every 3 seconds

    return () => clearInterval(interval);
  }, [featuredProducts]);

  if (loading) return <div className="text-center p-4">Loading featured products...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <section className="px-6 py-12">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">Featured Products</h2>
      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 scroll-smooth"
      >
        {featuredProducts.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="min-w-[240px] bg-white border border-purple-200 rounded-lg shadow-md p-4 flex-shrink-0 hover:shadow-lg transition"
          >
            <img
              src={product.image || "/placeholder.jpg"}
              alt={product.title}
              className="h-40 w-full object-cover rounded-md mb-2"
            />
            <h3 className="font-semibold text-md">{product.title}</h3>
            <p className="text-purple-700 font-semibold">${product.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
