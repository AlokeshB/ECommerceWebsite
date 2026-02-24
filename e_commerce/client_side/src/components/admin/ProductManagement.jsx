import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Filter, Loader2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { CATEGORIES, SUB_CATEGORIES } from "../categories";
import { useNotifications } from "../../context/NotificationContext";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: "",
    category: "Men",
    subCategory: "Topwear",
    price: "",
    discountPercentage: "",
    image: "",
    description: "",
    sizes: [],
    deliveryFee: "",
  });
  const [newSize, setNewSize] = useState({ size: "", stock: "" });

  // Fetch products from backend on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      addNotification("Error fetching products", "error");
    } finally {
      setLoading(false);
    }
  };

  const allCategories = ["All", ...CATEGORIES];
  const subCategories = SUB_CATEGORIES;

  const filteredProducts = products.filter((product) => {
    const productName = product.name ? product.name.toLowerCase() : "";
    const productCategory = product.category ? product.category.toLowerCase() : "";
    const productSubCategory = product.subCategory ? product.subCategory.toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    const filterCat = selectedCategory.toLowerCase();
    const matchesSearch = productName.includes(search) || productSubCategory.includes(search);
    const matchesCategory = 
      selectedCategory === "All" || 
      productCategory === filterCat;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ name: "", category: "Men", subCategory: "Topwear", price: "", discountPercentage: "", image: "", description: "", sizes: [], deliveryFee: "" });
    setNewSize({ size: "", stock: "" });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setSubmitting(true);
        const authToken = sessionStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setProducts(products.filter((product) => product._id !== id));
          addNotification("Product deleted successfully", "success");
        } else {
          addNotification(data.message || "Error deleting product", "error");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        addNotification("Error deleting product", "error");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.image) {
      addNotification("Please fill in: Name, Price, and Image URL", "error");
      return;
    }

    try {
      setSubmitting(true);
      const authToken = sessionStorage.getItem("authToken");
      
      const payload = {
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        price: parseFloat(formData.price),
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
        image: formData.image,
        description: formData.description || "",
        sizes: formData.sizes || [],
        deliveryFee: formData.deliveryFee ? parseFloat(formData.deliveryFee) : 0,
      };

      if (editingProduct) {
        // Update product
        const response = await fetch(`http://localhost:5000/api/admin/products/${editingProduct._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data.success) {
          setProducts(
            products.map((product) =>
              product._id === editingProduct._id ? data.product : product
            )
          );
          addNotification(`Updated product: ${formData.name}`, "success");
          setShowModal(false);
        } else {
          addNotification(data.message || "Error updating product", "error");
        }
      } else {
        // Create product
        const response = await fetch("http://localhost:5000/api/admin/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data.success) {
          setProducts([...products, data.product]);
          addNotification(`New Arrival! Check out our new ${formData.name}`, "success");
          setShowModal(false);
        } else {
          addNotification(data.message || "Error adding product", "error");
        }
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      addNotification("Error submitting product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSize = () => {
    if (newSize.size && newSize.stock) {
      const updatedSizes = [...(formData.sizes || []), { size: newSize.size, stock: parseInt(newSize.stock) }];
      setFormData({ ...formData, sizes: updatedSizes });
      setNewSize({ size: "", stock: "" });
    }
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const getStockBadgeClass = (stock) => {
    if (stock > 20) return "bg-success";
    if (stock > 10) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Product Management</h5>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleAddProduct}
          disabled={loading}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Loader2 className="spinner-border text-primary me-2" size={32} />
          <span>Loading products...</span>
        </div>
      )}

      {/* Filters */}
      {!loading && (
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
      )}

      {/* Products Table */}
      {!loading && (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="small">Image</th>
                  <th className="small">Product Name</th>
                  <th className="small">Category</th>
                  <th className="small">Sub Category</th>
                  <th className="small">Price</th>
                  <th className="small">Stock</th>
                  <th className="small">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40?text=No+Image";
                          }}
                        />
                      </td>
                      <td className="small fw-bold">{product.name}</td>
                      <td className="small">
                        <span className="badge bg-secondary">{product.category}</span>
                      </td>
                      <td className="small">
                        <span className="badge bg-info">{product.subCategory || "N/A"}</span>
                      </td>
                      <td className="small fw-bold">₹{product.price}</td>
                      <td className="small">
                        {(() => {
                          const totalStock = product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0;
                          return (
                            <span className={`badge ${getStockBadgeClass(totalStock)}`}>
                              {totalStock} units
                            </span>
                          );
                        })()}
                      </td>
                      <td className="small">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditProduct(product)}
                          disabled={submitting}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={submitting}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal d-block show" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingProduct ? "Edit Product" : "Add New Product"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
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
                  
                  {/* Category and Sub Category in same row */}
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => {
                          const newCategory = e.target.value;
                          setFormData({
                            ...formData,
                            category: newCategory,
                            subCategory: subCategories[newCategory][0],
                          });
                        }}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Sub Category</label>
                      <select
                        className="form-select"
                        value={formData.subCategory}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      >
                        {subCategories[formData.category].map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price and Discount in same row */}
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Discount Percentage (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter discount (optional)"
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Discount Preview */}
                  {formData.price && formData.discountPercentage && (
                    <div className="mb-3 p-2 bg-light border-start border-success border-3 rounded-2">
                      <small className="text-success fw-bold">
                        Discounted Price: ₹{(formData.price * (1 - formData.discountPercentage / 100)).toFixed(2)}
                      </small>
                    </div>
                  )}

                  {/* Delivery Fee */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Delivery Fee (₹) - Leave empty for Free Delivery</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter delivery fee or leave empty for free"
                      value={formData.deliveryFee}
                      onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Product Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                    />
                    {formData.image && (
                      <div className="mt-3">
                        <p className="small text-muted mb-2">Image Preview:</p>
                        <img
                          src={formData.image}
                          alt="Product Preview"
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Product Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter product description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Available Sizes</label>
                    <div className="card border-light p-3 mb-3">
                      <div className="row g-2 mb-2">
                        <div className="col-8">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Size (e.g., XS, S, M, L, XL, XXL)"
                            value={newSize.size}
                            onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                          />
                        </div>
                        <div className="col-4">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Stock"
                            value={newSize.stock}
                            onChange={(e) => setNewSize({ ...newSize, stock: e.target.value })}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={handleAddSize}
                      >
                        + Add Size
                      </button>
                    </div>
                    {formData.sizes && formData.sizes.length > 0 && (
                      <div>
                        <p className="text-muted small mb-2">Added Sizes:</p>
                        <div className="d-flex flex-wrap gap-2">
                          {formData.sizes.map((s, idx) => (
                            <div key={idx} className="badge bg-info p-2 d-flex align-items-center gap-2">
                              <span>{s.size} ({s.stock})</span>
                              <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => handleRemoveSize(idx)}
                                style={{ fontSize: "0.75rem" }}
                              ></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="spinner-border spinner-border-sm me-2" />
                        {editingProduct ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>{editingProduct ? "Update" : "Add"} Product</>
                    )}
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
