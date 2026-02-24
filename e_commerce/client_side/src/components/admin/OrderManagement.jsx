import React, { useState, useEffect } from "react";
import { Eye, Edit2, X, Search, Filter, Loader2, AlertCircle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNotifications } from "../../context/NotificationContext";

const OrderManagement = () => {
  const { addNotification } = useNotifications();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];
  const allStatuses = ["All", ...statuses];

  const statusColors = {
    pending: "warning",
    confirmed: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
    returned: "secondary",
  };

  // Fetch orders from backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const authToken = sessionStorage.getItem("authToken");
        const response = await fetch("http://localhost:5000/api/orders/my-orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        addNotification("Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [addNotification]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingAddress?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.userId?.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || order.orderStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCancelOrder = async () => {
    if (!selectedOrderForCancel) return;

    setCancelling(true);
    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/orders/${selectedOrderForCancel._id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the order in local state
        setOrders(
          orders.map((order) =>
            order._id === selectedOrderForCancel._id
              ? { ...order, orderStatus: "cancelled" }
              : order
          )
        );
        addNotification(
          `Order #${selectedOrderForCancel.orderNumber} has been cancelled`,
          "success"
        );
        setShowCancelModal(false);
        setSelectedOrderForCancel(null);
      } else {
        addNotification(data.message || "Failed to cancel order", "error");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      addNotification("Error cancelling order", "error");
    } finally {
      setCancelling(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrderForStatus || !newStatus) return;

    setUpdatingStatus(true);
    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${selectedOrderForStatus._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            orderStatus: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the order in local state
        setOrders(
          orders.map((order) =>
            order._id === selectedOrderForStatus._id
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
        addNotification(
          `Order #${selectedOrderForStatus.orderNumber} status updated to ${newStatus}`,
          "success"
        );
        setShowStatusModal(false);
        setSelectedOrderForStatus(null);
        setNewStatus(null);
      } else {
        addNotification(data.message || "Failed to update status", "error");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      addNotification("Error updating status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Order Management</h5>
        <div className="text-muted small">
          Total Orders: <strong>{orders.length}</strong>
        </div>
      </div>

      {loading && (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <Loader2 className="spinner-border text-dark" />
        </div>
      )}

      {!loading && (
        <>
          {/* Filters (Search & Status) */}
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
                          {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
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
                      <React.Fragment key={order._id}>
                        <tr>
                          <td className="small fw-bold">{order.orderNumber}</td>
                          <td className="small">{order.shippingAddress?.fullName || "N/A"}</td>
                          <td className="small">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="small fw-bold">
                            ₹{order.totalAmount?.toLocaleString()}
                          </td>
                          <td className="small">{order.items?.length || 0}</td>
                          <td className="small">
                            <span
                              className={`badge bg-${
                                statusColors[order.orderStatus] || "secondary"
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="small">
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() =>
                                setExpandedOrder(
                                  expandedOrder === order._id ? null : order._id
                                )
                              }
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => {
                                setSelectedOrderForStatus(order);
                                setNewStatus(order.orderStatus);
                                setShowStatusModal(true);
                              }}
                              title="Update Status"
                            >
                              <Edit2 size={16} />
                            </button>
                            {order.orderStatus !== "delivered" &&
                              order.orderStatus !== "cancelled" && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    setSelectedOrderForCancel(order);
                                    setShowCancelModal(true);
                                  }}
                                  title="Cancel Order"
                                >
                                  <X size={16} />
                                </button>
                              )}
                          </td>
                        </tr>

                        {/* EXPANDED SECTION */}
                        {expandedOrder === order._id && (
                          <tr className="bg-light">
                            <td colSpan="7">
                              <div className="p-3">
                                <h6 className="fw-bold mb-3">Order Details</h6>
                                <div className="row mb-4">
                                  <div className="col-md-6">
                                    <p className="mb-1">
                                      <strong>Order #:</strong> {order.orderNumber}
                                    </p>
                                    <p className="mb-1">
                                      <strong>Date:</strong>{" "}
                                      {new Date(order.createdAt).toLocaleDateString(
                                        "en-IN"
                                      )}
                                    </p>
                                  </div>
                                  <div className="col-md-6 text-md-end">
                                    <p className="mb-1">
                                      <strong>Total:</strong> ₹
                                      {order.totalAmount?.toLocaleString()}
                                    </p>
                                    <p className="mb-1">
                                      <strong>Status:</strong>{" "}
                                      <span
                                        className={`badge bg-${
                                          statusColors[order.orderStatus] ||
                                          "secondary"
                                        }`}
                                      >
                                        {order.orderStatus}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <h6 className="fw-bold mb-2">Items</h6>
                                <div className="table-responsive bg-white rounded shadow-sm mb-3">
                                  <table className="table table-sm mb-0">
                                    <thead className="table-dark">
                                      <tr>
                                        <th>Product</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-end">Unit Price</th>
                                        <th className="text-end">Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items?.map((item, index) => (
                                        <tr key={index}>
                                          <td>
                                            {item.product?.name || "Unknown Product"}
                                          </td>
                                          <td className="text-center">
                                            {item.quantity}
                                          </td>
                                          <td className="text-end">₹{item.price}</td>
                                          <td className="text-end fw-bold">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <h6 className="fw-bold mb-2">Shipping Address</h6>
                                <div className="p-3 border rounded bg-white">
                                  <p className="mb-1 small">
                                    <strong>{order.shippingAddress?.fullName}</strong>
                                  </p>
                                  <p className="mb-1 small text-muted">
                                    {order.shippingAddress?.address}
                                  </p>
                                  <p className="mb-1 small text-muted">
                                    {order.shippingAddress?.city},{" "}
                                    {order.shippingAddress?.state}{" "}
                                    {order.shippingAddress?.zipCode}
                                  </p>
                                  <p className="small text-muted">
                                    Phone: {order.shippingAddress?.phone}
                                  </p>
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
        </>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrderForStatus && (
        <div
          className="modal d-block show"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">Update Order Status</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowStatusModal(false)}
                  disabled={updatingStatus}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">
                  Order #<strong>{selectedOrderForStatus.orderNumber}</strong> - Current Status: <span className={`badge bg-${statusColors[selectedOrderForStatus.orderStatus]}`}>{selectedOrderForStatus.orderStatus}</span>
                </p>
                <label className="form-label fw-bold">Select New Status</label>
                <select
                  className="form-select"
                  value={newStatus || ""}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Choose a status...</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowStatusModal(false)}
                  disabled={updatingStatus}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateOrderStatus}
                  disabled={updatingStatus || !newStatus}
                >
                  {updatingStatus ? (
                    <>
                      <Loader2 size={16} className="spinner-border me-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrderForCancel && (
        <div
          className="modal d-block show"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">Cancel Order</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <AlertCircle size={24} className="text-danger" />
                  <div>
                    <h6 className="fw-bold mb-1">Cancel Order?</h6>
                    <p className="text-muted small mb-0">
                      Order #{selectedOrderForCancel.orderNumber}
                    </p>
                  </div>
                </div>
                <p className="text-muted small">
                  This action will cancel the order and refund the payment.
                  Product stock will be restored automatically.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <>
                      <Loader2 size={16} className="spinner-border me-2" />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel Order"
                  )}
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
