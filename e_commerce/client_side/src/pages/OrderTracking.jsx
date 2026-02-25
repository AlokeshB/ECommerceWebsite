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
 
  if (!order)
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h3>Order not found!</h3>
            <p className="text-muted">Order ID: <strong>{orderId}</strong></p>
            <p className="text-muted small">Please check the order ID and try again. You may also contact support.</p>
            <Link to="/" className="btn btn-dark mt-3">
              Go Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
 
  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "#f8f9fa" }}>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Refresh Button */}
            <div className="text-end mb-3">
              <button
                className="btn btn-sm btn-outline-dark"
                onClick={fetchOrder}
                title="Refresh order status"
              >
                🔄 Refresh Status
              </button>
            </div>

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