import React from "react";
import { FaMale, FaFemale, FaChild } from "react-icons/fa"; // ✅ Import icons

const categories = [
  { name: "Men", icon: <FaMale size={50} /> },
  { name: "Women", icon: <FaFemale size={50} /> },
  { name: "Kids", icon: <FaChild size={50} /> },
];

export default function CategoryGrid() {
  return (
    <section className="text-center py-12">
      <h3 className="text-3xl font-semibold">Shop By Categories</h3>
      <div className="grid grid-cols-3 gap-6 mt-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition cursor-pointer"
          >
            {category.icon}
            <p className="mt-2 font-semibold text-lg">{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
