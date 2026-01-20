import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Check, Package, Truck, Home, MapPin, Loader2 } from "lucide-react";
 
const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    // 1. Fetch orders from "Database"
    const storedOrders = JSON.parse(localStorage.getItem("eshop_orders")) || [];
    // 2. Find the matching order
    const foundOrder = storedOrders.find((o) => o.id === orderId);
 
    setOrder(foundOrder);
    setLoading(false);
  }, [orderId]);
 
  const steps = [
    { status: "Ordered", icon: Check, label: "Order Placed" },
    { status: "Packed", icon: Package, label: "Packed" },
    { status: "Shipped", icon: Truck, label: "Shipped" },
    { status: "Delivered", icon: Home, label: "Delivered" },
  ];
 
  // Logic to determine active steps
  const getStepStatus = (stepLabel) => {
    const statusMap = { Ordered: 1, Packed: 2, Shipped: 3, Delivered: 4 };
    const currentStatusVal = statusMap[order?.status] || 1;
    const stepVal = statusMap[stepLabel];
    if (stepVal < currentStatusVal) return "completed";
    if (stepVal === currentStatusVal) return "active";
    return "pending";
  };
 
  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Loader2 className="spinner-border text-dark" />
      </div>
    );
 
  if (!order)
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-5 text-center">
          <h3>Order not found!</h3>
          <Link to="/" className="btn btn-dark mt-3">
            Go Home
          </Link>
        </div>
      </div>
    );
 
  return (
    <div className="bg-light min-vh-100 pb-5">
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Order Header */}
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Order #{order.id}</h4>
                  <p className="text-muted small mb-0">
                    Placed on {order.date} | Total: ₹
                    {order.total.toLocaleString()}
                  </p>
                </div>
                <span className="badge bg-success p-2">
                  Payment: {order.paymentMethod.toUpperCase()}
                </span>
              </div>
 
              {/* Progress Bar */}
              <div className="position-relative py-4 mb-4">
                <div className="progress" style={{ height: "4px" }}>
                  {/* Mock progress bar width */}
                  <div className="progress-bar" style={{ width: "15%" }}></div>
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
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex gap-3 mb-2 align-items-center bg-white p-2 rounded border"
                  >
                    <div
                      className="bg-light rounded p-2"
                      style={{ fontSize: "1.2rem" }}
                    >
                      {item.img}
                    </div>
                    <div className="flex-grow-1">
                      <span className="small fw-bold d-block">{item.name}</span>
                      <span className="x-small text-muted">
                        Qty: {item.quantity || 1}
                      </span>
                    </div>
                    <span className="small fw-bold">
                      ₹{(item.price * (item.quantity || 1)).toLocaleString()}
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
                    {order.address}, {order.city} - {order.zip}
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
    </div>
  );
};
 
export default OrderTracking;