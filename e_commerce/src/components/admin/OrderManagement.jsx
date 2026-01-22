import React, { useState } from "react";
import { Eye, Edit2, Trash2, Search, Filter, ChevronDown } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useOrder } from "../../context/OrderContext";

const OrderManagement = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrder();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const statuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
  const allStatuses = ["All", ...statuses];

  const statusColors = {
    Processing: "info",
    Pending: "warning",
    Shipped: "primary",
    Delivered: "success",
    Cancelled: "danger",
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    setEditingOrder(null);
    setShowStatusModal(false);
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(id);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Order Management</h5>
        <div className="text-muted small">
          Total Orders: <strong>{orders.length}</strong>
        </div>
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
                  placeholder="Search by Order ID, Customer, or Email..."
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
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {allStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "All" ? "All Statuses" : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="small">Order ID</th>
                <th className="small">Customer</th>
                <th className="small">Date</th>
                <th className="small">Amount</th>
                <th className="small">Items</th>
                <th className="small">Status</th>
                <th className="small">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td className="small fw-bold">{order.id}</td>
                      <td className="small">{order.customerName || "N/A"}</td>
                      <td className="small">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="small fw-bold">₹{order.totalAmount || order.amount}</td>
                      <td className="small">{order.items?.length || 0}</td>
                      <td className="small">
                        <span className={`badge bg-${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="small">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => {
                            setEditingOrder(order);
                            setShowStatusModal(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Order Details */}
                    {expandedOrder === order.id && (
                      <tr className="bg-light">
                        <td colSpan="7">
                          <div className="p-3">
                            <h6 className="fw-bold mb-3">Order Details</h6>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <p>
                                  <strong>Email:</strong> {order.email || "N/A"}
                                </p>
                                <p>
                                  <strong>Order Date:</strong> {new Date(order.date).toLocaleString()}
                                </p>
                                <p>
                                  <strong>Total Items:</strong> {order.items?.length || 0}
                                </p>
                              </div>
                              <div className="col-md-6">
                                <p>
                                  <strong>Order Total:</strong> ₹{order.totalAmount || order.amount}
                                </p>
                                <p>
                                  <strong>Current Status:</strong>{" "}
                                  <span className={`badge bg-${statusColors[order.status]}`}>
                                    {order.status}
                                  </span>
                                </p>
                                <p>
                                  <strong>Tracking ID:</strong> TRK{order.id}001
                                </p>
                              </div>
                            </div>

                            <div className="mt-3">
                              <h6 className="fw-bold mb-2">Ordered Items</h6>
                              <table className="table table-sm table-bordered">
                                <thead className="table-light">
                                  <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                      <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.price * item.quantity}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="3" className="text-center text-muted">No items</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && editingOrder && (
        <div className="modal d-block show" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Order Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  <strong>Order ID:</strong> {editingOrder.id}
                </p>
                <p className="mb-3">
                  <strong>Current Status:</strong>{" "}
                  <span className={`badge bg-${statusColors[editingOrder.status]}`}>
                    {editingOrder.status}
                  </span>
                </p>
                <label className="form-label fw-bold">Change Status To:</label>
                <div className="d-grid gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      className={`btn btn-outline-${statusColors[status]} text-start`}
                      onClick={() => handleStatusChange(editingOrder.id, status)}
                      disabled={status === editingOrder.status}
                    >
                      <span className={`badge bg-${statusColors[status]} me-2`}>
                        {status}
                      </span>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
