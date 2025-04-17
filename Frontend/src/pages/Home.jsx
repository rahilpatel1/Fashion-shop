import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import HeroBanner from "../components/HeroBanner";
import ProductSection from "../components/ProductSection";
import PromoBanner from "../components/PromoBanner";
import FeaturedProducts from "../components/FeaturedProducts";

const Home = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");

  // Refs for scroll reveal
  const newArrivalsRef = useRef(null);
  const bestSellersRef = useRef(null);
  const promoRef = useRef(null);
  const newsletterRef = useRef(null);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const newArrivalRes = await axios.get("/api/products/new-arrivals");
        const bestSellerRes = await axios.get("/api/products/best-sellers");
        setNewArrivals(newArrivalRes.data);
        setBestSellers(bestSellerRes.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      const revealSection = (ref) => {
        if (!ref.current) return;
        const sectionTop = ref.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75) {
          ref.current.classList.add("active");
        }
      };

      revealSection(newArrivalsRef);
      revealSection(bestSellersRef);
      revealSection(promoRef);
      revealSection(newsletterRef);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}!`);
    setEmail("");
  };

  return (
    <div className="home-container">
      <h1 className="welcome-heading text-center text-4xl font-bold mt-6">
        Welcome to Our Fashion Store
      </h1>

      <HeroBanner />

      {/* <div className="section-divider"></div> */}

      {/* {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading amazing products...</div>
        </div>
      ) : 
      // error ? (
      //   <div className="error-container">{error}</div>
      // ) 
      // : 
      (
        <>
          <div ref={newArrivalsRef} className="reveal-section">
            <ProductSection title="New Arrivals" products={newArrivals} />
          </div>

          <div className="section-divider"></div>

          <div ref={bestSellersRef} className="reveal-section">
            <ProductSection title="Best Sellers" products={bestSellers} />
          </div>
        </>
      )
      }

      <div className="section-divider"></div> */}

      <div ref={promoRef} className="reveal-section">
        <FeaturedProducts />
        <PromoBanner />
      </div>

      <div ref={newsletterRef} className="reveal-section bg-gray-50 py-12 px-4">
  <div className="max-w-xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-purple-800 mb-2">Subscribe to Our Newsletter</h2>
    <p className="text-gray-600 mb-6">
      Stay updated with our latest collections, exclusive offers, and fashion tips.
    </p>
    <form
      onSubmit={handleNewsletterSubmit}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <input
        type="email"
        className="flex-grow px-4 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="px-5 py-2 w-auto bg-purple-700 text-white rounded hover:bg-purple-800 transition"
      >
        Subscribe
      </button>
    </form>
  </div>
</div>


      <div
        className={`scroll-top-button ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </div>
    </div>
  );
};

export default Home;
