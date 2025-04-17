import React from "react";

export default function ProductSection({ title, products }) {
  return (
    <section className="py-12 px-6">
      <h3 className="text-3xl font-semibold text-center">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
              <img src={product.images[0]} alt={product.title} className="w-full h-64 object-cover rounded-lg" />
              <p className="mt-2 text-lg font-semibold">{product.title}</p>
              <p className="text-gray-600">${product.price}</p>
              <button className="mt-4 bg-black text-white px-4 py-2 rounded">View Product</button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-4">No products found</p>
        )}
      </div>
    </section>
  );
}
