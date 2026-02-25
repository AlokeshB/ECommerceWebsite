import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Check, Package, Truck, Home, MapPin, Loader2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [cancellationMessage, setCancellationMessage] = useState("");
  const [reviewingProductId, setReviewingProductId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  // Fetch order data
  const fetchOrder = useCallback(async () => {
    try {
      console.log("Fetching order with ID:", orderId); // Debug log
      
      // Track endpoint doesn't require authentication
      const response = await fetch(`http://localhost:5000/api/orders/track/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Order tracking response:", data); // Debug log
      
      if (data.success) {
        setOrder(data.order);
      } else {
        console.error("Order not found:", data.message);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      
      // Set up polling to refresh order status every 10 seconds
      const intervalId = setInterval(fetchOrder, 10000);
      
      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [orderId, fetchOrder]);

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }

    setCancellationLoading(true);
    setCancellationMessage("");

    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCancellationMessage("✓ Order cancelled successfully!");
        // Refresh the order to show updated status
        await fetchOrder();
        setTimeout(() => setCancellationMessage(""), 3000);
      } else {
        setCancellationMessage(`✗ ${data.message || "Failed to cancel order"}`);
        setTimeout(() => setCancellationMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setCancellationMessage("✗ Error cancelling order. Please try again.");
      setTimeout(() => setCancellationMessage(""), 3000);
    } finally {
      setCancellationLoading(false);
    }
  };

  // Handle product review submission
  const handleSubmitReview = async (productId) => {
    if (!reviewData.rating) {
      setReviewMessage("✗ Please select a rating");
      setTimeout(() => setReviewMessage(""), 3000);
      return;
    }

    setReviewSubmitting(true);
    setReviewMessage("");

    try {
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/products/${productId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReviewMessage("✓ Review submitted successfully!");
        setReviewData({ rating: 5, comment: "" });
        setReviewingProductId(null);
        setTimeout(() => setReviewMessage(""), 3000);
      } else {
        setReviewMessage(`✗ ${data.message || "Failed to submit review"}`);
        setTimeout(() => setReviewMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewMessage("✗ Error submitting review. Please try again.");
      setTimeout(() => setReviewMessage(""), 3000);
    } finally {
      setReviewSubmitting(false);
    }
  };
 
  const steps = [
    { status: "pending", icon: Check, label: "Order Placed" },
    { status: "confirmed", icon: Package, label: "Confirmed" },
    { status: "shipped", icon: Truck, label: "Shipped" },
    { status: "delivered", icon: Home, label: "Delivered" },
  ];
 
  // Logic to determine active steps
  const getStepStatus = (stepStatus) => {
    const statusOrder = ["pending", "confirmed", "shipped", "delivered"];
    const currentStatusIdx = statusOrder.indexOf(order?.orderStatus) || 0;
    const stepIdx = statusOrder.indexOf(stepStatus);
    
    if (stepIdx < currentStatusIdx) return "completed";
    if (stepIdx === currentStatusIdx) return "active";
    return "pending";
  };

  // Calculate progress bar width based on order status
  const getProgressWidth = () => {
    const statusMap = { 
      pending: 0, 
      confirmed: 33, 
      shipped: 66, 
      delivered: 100,
      cancelled: 0,
      returned: 0
    };
    return statusMap[order?.orderStatus] || 0;
  };
 
  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Loader2 size={48} className="spinner-border text-dark mb-3" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
 
  // Always render the page, order will be loaded from backend
  if (!order)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <Loader2 size={48} className="spinner-border text-dark mb-3" />
          <p>Fetching your order details...</p>
        </div>
      </div>
    );
 
  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "#f8f9fa" }}>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Refresh Button and Cancel Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-sm btn-outline-dark"
                onClick={fetchOrder}
                title="Refresh order status"
              >
                🔄 Refresh Status
              </button>
              {(order?.orderStatus === "pending" || order?.orderStatus === "confirmed") && 
               order?.orderStatus !== "cancelled" && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleCancelOrder}
                  disabled={cancellationLoading}
                  title="Cancel this order"
                >
                  {cancellationLoading ? (
                    <>
                      <Loader2 size={14} className="spinner-border me-1" />
                      Cancelling...
                    </>
                  ) : (
                    "✕ Cancel Order"
                  )}
                </button>
              )}
            </div>

            {/* Cancellation Message */}
            {cancellationMessage && (
              <div className={`alert ${cancellationMessage.includes("✓") ? "alert-success" : "alert-danger"} mb-3`} role="alert">
                {cancellationMessage}
              </div>
            )}

            {/* Order Header */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Order #{order.orderNumber}</h4>
                  <p className="text-muted small mb-0">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} | Total: ₹
                    {order.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <span className={`badge p-2 ${order.paymentStatus === 'completed' ? 'bg-success' : order.paymentStatus === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                    Payment: {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'PENDING'}
                  </span>
                  <span className="badge p-2 bg-primary">
                    {order.paymentMethod?.replace(/_/g, ' ').toUpperCase() || 'NOT SET'}
                  </span>
                </div>
              </div>
 
              {/* Progress Bar */}
              <div className="position-relative py-4 mb-4">
                <div className="progress" style={{ height: "4px" }}>
                  <div 
                    className="progress-bar bg-dark" 
                    style={{ width: `${getProgressWidth()}%`, transition: "width 0.3s ease" }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between position-absolute top-50 start-0 w-100 translate-middle-y">
                  {steps.map((step, idx) => {
                    const status = getStepStatus(step.status);
                    return (
                      <div key={idx} className="text-center bg-light px-2">
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm
                          ${
                            status === "active" || status === "completed"
                              ? "bg-dark text-white"
                              : "bg-white text-muted border"
                          }`}
                          style={{ width: "40px", height: "40px" }}
                        >
                          <step.icon size={18} />
                        </div>
                        <span
                          className={`small fw-bold ${
                            status === "active" ? "text-dark" : "text-muted"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
 
              {/* Order Items */}
              <div className="bg-light p-3 rounded mb-3">
                <h6 className="fw-bold mb-3">Items in this order</h6>
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex gap-3 mb-2 align-items-center bg-white p-2 rounded border"
                  >
                    <div
                      className="bg-light rounded p-2"
                      style={{ fontSize: "1.2rem" }}
                    >
                      📦
                    </div>
                    <div className="flex-grow-1">
                      <span className="small fw-bold d-block">{item.productName || item.product?.name || 'Product'}</span>
                      <span className="x-small text-muted">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="small fw-bold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Review Message */}
              {reviewMessage && (
                <div className={`alert ${reviewMessage.includes("✓") ? "alert-success" : "alert-danger"} mb-3`} role="alert">
                  {reviewMessage}
                </div>
              )}

              {/* Reviews Section - Only show if order is delivered */}
              {order?.orderStatus === "delivered" && (
                <div className="bg-light p-3 rounded mb-3">
                  <h6 className="fw-bold mb-3">📝 Rate & Review Products</h6>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border mb-2">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="small fw-bold d-block">{item.productName || 'Product'}</span>
                          <span className="x-small text-muted">Qty: {item.quantity}</span>
                        </div>
                      </div>

                      {reviewingProductId === item.productId ? (
                        <div className="ms-2">
                          <div className="mb-2">
                            <label className="small fw-bold mb-1">Rating (1-5 stars)</label>
                            <div className="d-flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  className={`btn btn-sm ${reviewData.rating >= star ? "btn-warning" : "btn-outline-secondary"}`}
                                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                                  style={{ padding: "0.25rem 0.5rem" }}
                                >
                                  ⭐
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-2">
                            <label className="small fw-bold mb-1">Comment (optional)</label>
                            <textarea
                              className="form-control form-control-sm"
                              rows="2"
                              placeholder="Share your experience..."
                              value={reviewData.comment}
                              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                            ></textarea>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleSubmitReview(item.productId)}
                              disabled={reviewSubmitting}
                            >
                              {reviewSubmitting ? "Submitting..." : "Submit Review"}
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setReviewingProductId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setReviewingProductId(item.productId)}
                        >
                          ✍️ Write Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
 
              {/* Address */}
              <div className="d-flex align-items-start gap-2 p-3 border rounded border-dark bg-light">
                <MapPin className="text-dark mt-1" size={18} />
                <div>
                  <h6 className="small fw-bold mb-1 text-dark">
                    Delivery Address
                  </h6>
                  <p className="small text-dark mb-0">
                    {order.shippingAddress ? 
                      `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}` 
                      : 'Address not available'
                    }
                  </p>
                </div>
              </div>
            </div>
 
            <div className="text-center">
              <Link to="/" className="btn btn-dark px-5 fw-bold">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
 
export default OrderTracking;