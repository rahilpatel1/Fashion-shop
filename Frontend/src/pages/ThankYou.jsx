import React from "react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="text-center my-20">
      <h1 className="text-4xl font-bold text-green-600">🎉 Thank You!</h1>
      <p className="text-lg mt-4">Your order has been successfully placed.</p>
      <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded">
        Back to Home        
      </Link>     
    </div>
  );
};

export default ThankYou;
