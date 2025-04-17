import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-3">Fashion Store</h2>
          <p className="text-sm text-gray-400">
            Discover the latest styles and trends. Fashion for everyone, every season.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/home" className="hover:text-white">Home</a></li>
            <li><a href="/shop" className="hover:text-white">Shop</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Social & Legal */}
        <div>
          <h3 className="text-white font-semibold mb-2">Connect With Us</h3>
          <div className="flex space-x-4 mb-4 text-xl">
            <a
              href="https://www.instagram.com/zara"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              title="Instagram"
            >
              📷
            </a>
            <a
              href="https://twitter.com/hm"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              title="Twitter"
            >
              🐦
            </a>
            <a
              href="https://www.facebook.com/zara"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              title="Facebook"
            >
              📘
            </a>
            <a
              href="https://www.hm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              title="Website"
            >
              🌐
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} Fashion Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
