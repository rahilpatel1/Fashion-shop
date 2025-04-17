import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import ThankYou from "./pages/Thankyou";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/Admin/AdminDashboard";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route path="/home" element={<Home />} /> {/* ✅ Defined /home route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/thankyou" element={<ThankYou />} /> {/* Added ThankYou page */}
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/Admin/*" element={<AdminDashboard />} />
     

      
      </Routes>
      <Footer />
    </div>
  );
}
