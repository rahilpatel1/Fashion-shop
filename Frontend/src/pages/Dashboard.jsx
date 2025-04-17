// src/pages/Home.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <section className="text-center py-16">
          <h2 className="text-4xl font-bold">Unleash The Latest Trends With Rosyz.</h2>
          <p className="mt-4 text-gray-600">Step into the world of fashion with exclusive pieces.</p>
          <button className="mt-6 bg-black text-white px-6 py-3 rounded">Shop Now</button>
        </section>
        
        <section className="py-12">
          <h3 className="text-2xl font-semibold text-center">Shop By Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-gray-200 text-center rounded">Men</div>
            <div className="p-4 bg-gray-200 text-center rounded">Women</div>
            <div className="p-4 bg-gray-200 text-center rounded">Accessories</div>
            <div className="p-4 bg-gray-200 text-center rounded">Shoes</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;