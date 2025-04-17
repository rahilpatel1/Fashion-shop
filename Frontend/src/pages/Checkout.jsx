import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThankYou from "./Thankyou";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // User details (mock user info for now)
  const [formData, setFormData] = useState({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    city: "",
    zip: "",
    paymentMethod: "creditCard",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(data.items);
      calculateTotal(data.items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // Calculate total price
  const calculateTotal = (items) => {
    const totalPrice = items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );
    setTotal(totalPrice.toFixed(2));
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form
  const validateForm = () => {
    let newErrors = {};
  
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Invalid Name (Only letters and spaces allowed)";
    }
  
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
  
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
  
    if (!formData.zip.trim()) {
      newErrors.zip = "Postal Code is required";
    } else if (!/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(formData.zip)) {
      newErrors.zip = "Invalid Postal Code (Format: A1A 1A1)";
    }
  
    if (formData.paymentMethod === "creditCard") {
      if (!formData.cardNumber.trim() || !/^\d{16}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = "Invalid Card Number (16 digits required)";
      }
      if (!formData.expiryDate.trim() || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Invalid Expiry Date (Format: MM/YY)";
      } else {
        // Extract MM and YY
        const [month, year] = formData.expiryDate.split("/").map(Number);
        
        // Get current month and year
        const currentYear = new Date().getFullYear() % 100; // Get last two digits of the year
        const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JS
        
        // Validate expiry is not in the past
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiryDate = "Card has expired. Enter a future date.";
        }
      }
      
      if (!formData.cvv.trim() || !/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = "Invalid CVV (3 digits required)";
      }
    }
  
    setErrors(newErrors);
  
    // Return true if no errors, else false
    return Object.keys(newErrors).length === 0;
  };
  
  
  

  // Handle order placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
  
    // ✅ Validate form before proceeding
    if (!validateForm()) {
      console.log("Validation failed. Errors:", errors);
      alert("⚠️ Please correct the errors before submitting.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const orderData = {
        user: {
          name: formData.name,
          email: formData.email,
          city: formData.city,
          zip: formData.zip,
        },
        payment: {
          method: formData.paymentMethod,
          ...(formData.paymentMethod === "creditCard" && {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
          }),
        },
        cartItems: cart.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        totalAmount: total,
      };
  
      console.log("Submitting order:", orderData);
  
      const response = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true, // ✅ Ensures cookies are sent with request if needed
      });
  
      if (response.status === 201 || response.status === 200) {
        alert("🎉 Order Placed Successfully!");
  
        // ✅ Clear Cart on Success
        setCart([]);
        localStorage.removeItem("cart");
        localStorage.setItem("orderSuccess", "true");
  
        // ✅ Clear backend cart (if API supports it)
        try {
          await axios.delete("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
          });
        } catch (err) {
          console.warn("⚠️ Backend cart clear failed:", err);
        }
  
        setOrderSuccess(true);
      } else {
        alert("❌ Unexpected response. Please try again.");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      alert(`❌ Order placement failed: ${err.response?.data?.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  if (orderSuccess) {
    return <ThankYou />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Checkout</h2>

      {/* Checkout Form */}
      <form onSubmit={handlePlaceOrder}>
        {/* Name Field */}
        <div className="mb-4">
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            placeholder="example@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Address Fields */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="Toronto"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
          <div className="flex-1">
            <label className="block font-medium">Postal Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="A1A 1A1"
            />
            {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block font-medium">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>

        {/* Credit Card Fields (Only if payment method is Credit Card) */}
        {formData.paymentMethod === "creditCard" && (
          <>
            <div className="mb-4">
              <label className="block font-medium">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
                placeholder="1234123412341234"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm">{errors.cardNumber}</p>
              )}
            </div>
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
                placeholder="MM/YY"
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm">{errors.expiryDate}</p>
              )}

              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
                placeholder="CVV"
              />
              {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
        
      </form>
     
      {/* <ThankYou/> */}
    </div>
  );
};

export default Checkout;
