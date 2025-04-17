import React from "react";

export default function PromoBanner() {
  return (
    <section className="bg-white py-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        
        <div className="p-6 bg-white shadow-md rounded-lg border border-purple-700">
          <h3 className="text-lg font-semibold text-[#4a148c]">🚚 Free Shipping</h3>
          <p className="text-gray-600 mt-2">Enjoy free shipping on orders over $50!</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg border border-purple-700">
          <h3 className="text-lg font-semibold text-[#4a148c]">💳 Loyalty Rewards</h3>
          <p className="text-gray-600 mt-2">Earn points with every purchase and save big!</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg border border-purple-700">
          <h3 className="text-lg font-semibold text-[#4a148c]">📱 Shop on the Go</h3>
          <p className="text-gray-600 mt-2">Download our app for exclusive deals!</p>
        </div>

      </div>
    </section>
  );
}
