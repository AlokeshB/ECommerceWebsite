import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Premium Wireless Headphones", category: "Electronics", price: 2999, stock: 45, image: "🎧" },
    { id: 2, name: "Smart Fitness Watch", category: "Wearables", price: 4500, stock: 32, image: "⌚" },
    { id: 3, name: "Classic Denim Jacket", category: "Fashion", price: 1899, stock: 18, image: "🧥" },
    { id: 4, name: "Running Sports Shoes", category: "Fashion", price: 3200, stock: 25, image: "👟" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    image: "",
  });

  const categories = ["Electronics", "Fashion", "Wearables", "Accessories"];
  const allCategories = ["All", ...categories];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ name: "", category: "Electronics", price: "", stock: "", image: "" });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p))
      );
    } else {
      setProducts([...products, { ...formData, id: Math.max(...products.map((p) => p.id), 0) + 1 }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Product Management</h5>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleAddProduct}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <Filter size={18} className="text-muted" />
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="small">Image</th>
                <th className="small">Product Name</th>
                <th className="small">Category</th>
                <th className="small">Price</th>
                <th className="small">Stock</th>
                <th className="small">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <span style={{ fontSize: "24px" }}>{product.image}</span>
                    </td>
                    <td className="small fw-bold">{product.name}</td>
                    <td className="small">
                      <span className="badge bg-secondary">{product.category}</span>
                    </td>
                    <td className="small fw-bold">₹{product.price}</td>
                    <td className="small">
                      <span
                        className={`badge ${
                          product.stock > 20 ? "bg-success" : product.stock > 10 ? "bg-warning" : "bg-danger"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="small">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block show" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingProduct ? "Edit Product" : "Add New Product"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Image (Emoji)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., 🎧"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? "Update" : "Add"} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
