import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; // Import Slick Carousel CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Carousel Theme CSS

export default function HeroBanner() {
  const navigate = useNavigate(); // Initialize Navigation

  const sliderSettings = {
    dots: true, // Enables dots for navigation
    infinite: true, // Infinite looping of slides
    speed: 50, // Speed of slide transition
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Time between auto transitions (3 seconds)
    fade: true, // Fade effect between slides
  };

  return (
    <section className="relative text-center py-0">
      {/* Slider for background images */}
      <Slider {...sliderSettings}>
        <div>
          <img
            src="images/hero1.png" // Add your image paths here
            alt="Fashion 1"
            className="w-full h-[60vh] object-cover object-top" // Focus on the top of the image
          />
        </div>

        <div>
          <img
            src="/images/hero2.png" // Add your image paths here
            alt="Fashion 2"
            className="w-full h-[60vh] object-cover object-top" // Focus on the top of the image
          />
        </div>
        <div>
          <img
            src="/images/hero3.png" // Add your image paths here
            alt="Fashion 3"
            className="w-full h-[60vh] object-cover object-top" // Focus on the top of the image
          />
        </div>
      </Slider>

      {/* Content that stays on top of the slider */}
      <div className="absolute inset-0 flex justify-center items-center z-10 bg-black bg-opacity-50">
        <div className="text-center px-4 py-6 sm:px-8 sm:py-10 mt-24"> {/* Increased mt-24 */}
          <button
            onClick={() => navigate("/shop")}
            className="shop-now-button"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
