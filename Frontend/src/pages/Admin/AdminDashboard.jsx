import React, { useState, useEffect } from "react";
import axios from "axios";

const initialFormState = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
  averageReview: 0,
  isNewArrival: false,
  sizes: [],
  image: ""
};


const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [currentSize, setCurrentSize] = useState("");
  const [formErrors, setFormErrors] = useState({});


  const [form, setForm] = useState({
    title: "", image: "", description: "", category: "", brand: "",
    price: "", salePrice: "", totalStock: "", averageReview: "",
    isNewArrival: false, sizes: "",
  });
  const [editId, setEditId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (Array.isArray(response.data)) setProducts(response.data);
      else setError("Unexpected response format");
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddSize = () => {
    if (currentSize && !formData.sizes.includes(currentSize)) {
      setFormData({ ...formData, sizes: [...formData.sizes, currentSize] });
      setCurrentSize("");
    }
  };

  const handleRemoveSize = (size) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((s) => s !== size) });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.image.trim()) errors.image = "Image URL is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.brand.trim()) errors.brand = "Brand is required";
    if (!formData.price || formData.price < 0) errors.price = "Price must be greater than 0";
    if (formData.sizes.length === 0) errors.sizes = "At least one size is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = { ...formData };

      if (editId) {
        await axios.put(`http://localhost:5000/api/admin/products/${editId}`, payload);
        setMessage("✅ Product updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/admin/products", payload);
        setMessage("✅ Product added successfully!");
      }

      setMessageType("success");
      resetForm(); // Clear formData properly
      fetchProducts();

      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessageType("error");
      setMessage("❌ Failed to save product");
      console.error("Submission error:", error);
    }
  };


  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
      fetchProducts();
    }

  };

  const startEditing = (product) => {
    setFormData({
      ...product,
      sizes: product.sizes || [], // ensure it's an array
    });
    // setForm({ ...product, sizes: product.sizes.join(", ") });
    setEditingProduct(product);
    setEditId(product._id);
    setIsAdding(true);
  };

  const startAdding = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingProduct(null);
    setIsAdding(false);
    setFormErrors({});
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-screen min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        />
      </div>

      <button
        onClick={startAdding}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Product
      </button>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 space-y-6 w-full">
          <h2 className="text-xl font-semibold border-b pb-2">Product Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["title", "image", "description", "category", "brand", "price", "salePrice", "totalStock"].map((name) => (
              <div key={name}>
                <label className="block font-medium mb-1 capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type={name.toLowerCase().includes("price") || name === "totalStock" ? "number" : "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
                {formErrors[name] && <p className="text-sm text-red-600 mt-1">{formErrors[name]}</p>}
              </div>
            ))}

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-1">Sizes</h3>
                <div className="flex gap-2">
                  <input type="text" value={currentSize} onChange={(e) => setCurrentSize(e.target.value)} className="border p-2 rounded" placeholder="Add size (S, M, etc.)" />
                  <button type="button" onClick={handleAddSize} className="bg-gray-200 px-4 py-2 rounded">Add</button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {formData.sizes.map((size) => (
                    <span key={size} className="bg-gray-300 px-3 py-1 rounded inline-flex items-center">
                      {size}
                      <button onClick={() => handleRemoveSize(size)} className="ml-2 text-red-600 hover:text-red-800">&times;</button>
                    </span>
                  ))}
                </div>
                {formErrors.sizes && <p className="text-sm text-red-600 mt-1">{formErrors.sizes}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1">New Arrival</label>
                <select
                  name="isNewArrival"
                  value={formData.isNewArrival ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.value === "true" })}
                  className="border p-2 rounded w-full"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Image</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Brand</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Stock</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Sizes</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img src={product.image} alt={product.title} className="h-10 w-10 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2">{product.title}</td>
                  <td className="px-4 py-2">{product.brand}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">${product.price}</td>
                  <td className="px-4 py-2">{product.totalStock}</td>
                  <td className="px-4 py-2">{product.sizes?.join(", ")}</td>
                  <td className="px-4 py-2 space-x-2 flex justify-start items-center">
                    <button
                      onClick={() => startEditing(product)}
                      className="inline-flex items-center gap-2 bg-yellow-500 text-black font-medium pl-3 py-1.5 rounded-lg hover:bg-yellow-400 transition duration-200"
                    >
                      <i className="bi bi-pencil-square"></i>Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="inline-flex items-center gap-2 bg-red-600 text-white font-medium pl-3 py-1.5 rounded-lg hover:bg-red-500 transition duration-200"
                    >
                      <i className="bi bi-trash3"></i> Delete
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;