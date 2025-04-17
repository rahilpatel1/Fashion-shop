import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiShoppingCart, FiUser, FiMenu,FiHeart , FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout().then(() => {
      navigate("/login");
    });
  };

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50 border-b border-gray-200 w-full">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold text-gray-900">
          Fashion Store
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-2xl justify-items-end text-gray-800 focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navbar Links (Hidden on Mobile) */}
        <nav className="hidden lg:flex space-x-8 text-lg font-medium">
          <Link to="/home" className="hover:text-gray-600 transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-gray-600 transition">
            Shop
          </Link>
          <Link to="/about" className="hover:text-gray-600 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-gray-600 transition">
            Contact
          </Link>
          {/* <Link to="/wishlist" className="hover:text-gray-600 transition">
            Wishlist
          </Link> */}

        </nav>

        {/* Icons & User Actions */}
        <div className="hidden lg:flex space-x-4 items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="text-xl hover:text-gray-600 transition">
                <FiShoppingCart />
              </Link>

              <Link to="/wishlist" className="text-xl hover:text-gray-600 transition">
                <FiHeart  />
              </Link>

              <Link to="/profile" className="hover:text-gray-600 transition">
                <FiUser />
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-red-600 hover:text-gray-200 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-black text-white px-5 py-2 rounded-lg transition"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu (Visible when toggled) */}
      {menuOpen && (
        <div className="lg:hidden bg-white  shadow-md border-t border-gray-200">
          <nav className="flex flex-col items-center text-center space-y-4 py-4 text-lg font-medium">
            <Link to="/home" className="hover:text-gray-600 transition" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/shop" className="hover:text-gray-600 transition" onClick={toggleMenu}>
              Shop
            </Link>
            <Link to="/about" className="hover:text-gray-600 transition" onClick={toggleMenu}>
              About
            </Link>
            <Link to="/contact" className="hover:text-gray-600 transition" onClick={toggleMenu}>
              Contact
            </Link>
            {user ? (
              <>
                <Link to="/cart" className="hover:text-gray-600 transition" onClick={toggleMenu}>
                  Cart
                </Link>
                <Link to="/profile" className="hover:text-gray-600 transition" onClick={toggleMenu}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-red-600 hover:text-gray-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    toggleMenu();
                  }}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    toggleMenu();
                  }}
                  className="bg-black text-white px-5 py-2 rounded-lg transition"
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
