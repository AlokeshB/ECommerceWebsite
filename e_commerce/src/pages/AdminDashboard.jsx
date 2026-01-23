import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, BarChart3, LogOut } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductManagement from "../components/admin/ProductManagement";
import OrderManagement from "../components/admin/OrderManagement";
import Analytics from "../components/admin/Analytics";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import { useProduct } from "../context/ProductContext";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="admin-container">
      {/* Top Bar */}
      <div className="admin-topbar bg-white shadow-sm p-3 d-flex align-items-center justify-content-between">
        <h4 className="mb-0">
          {menuItems.find((item) => item.id === activeTab)?.label ||
            "Dashboard"}
        </h4>
        <button
          className="btn btn-danger d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Navigation */}
      <div className="admin-nav bg-light p-3 border-bottom d-flex gap-2 flex-wrap">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`btn btn-sm ${
                activeTab === item.id ? "btn-primary" : "btn-outline-primary"
              } d-flex align-items-center gap-2`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="admin-content">
        <div className="admin-main-content p-4">
          {activeTab === "dashboard" && (
            <DashboardHome setActiveTab={setActiveTab} />
          )}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "analytics" && <Analytics />}
        </div>
      </main>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ setActiveTab }) => {
  const { orders } = useOrder();
  const { products } = useProduct();

  // --- FIX START: Deduplicate Orders ---
  // We use useMemo to filter out duplicates based on 'id' so this calculation
  // only runs when 'orders' changes, not on every render.
  const uniqueOrders = useMemo(() => {
    if (!orders) return [];
    const seen = new Set();
    return orders.filter((order) => {
      const duplicate = seen.has(order.id);
      seen.add(order.id);
      return !duplicate;
    });
  }, [orders]);
  // --- FIX END ---

  const totalRevenue = uniqueOrders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0,
  );

  const stats = [
    {
      label: "Total Products",
      value: products.length.toString(),
      icon: Package,
      color: "primary",
    },
    {
      label: "Total Orders",
      value: uniqueOrders.length.toString(),
      icon: ShoppingCart,
      color: "success",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: BarChart3,
      color: "info",
    },
    {
      label: "Pending Orders",
      value: uniqueOrders
        .filter((o) => o.status === "Pending")
        .length.toString(),
      icon: Package,
      color: "warning",
    },
  ];

  // Use uniqueOrders instead of original orders for the table
  const recentOrders = uniqueOrders.slice(0, 5);

  return (
    <div>
      <h5 className="mb-4 fw-bold">Welcome to Admin Dashboard</h5>
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="col-md-6 col-lg-3">
              <div
                className={`card border-0 shadow-sm bg-${stat.color} bg-opacity-10`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">{stat.label}</p>
                      <h4 className="mb-0 fw-bold">{stat.value}</h4>
                    </div>
                    <Icon className={`text-${stat.color}`} size={32} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom py-3">
              <h6 className="mb-0 fw-bold">Recent Orders</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small">Order ID</th>
                      <th className="small">Customer</th>
                      <th className="small">Amount</th>
                      <th className="small">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="small fw-bold">{order.id}</td>
                          <td className="small">
                            {order.customerName || order.email}
                          </td>
                          <td className="small">
                            ₹{order.totalAmount?.toLocaleString("en-IN") || "0"}
                          </td>
                          <td className="small">
                            <span
                              className={`badge ${
                                order.status === "Delivered"
                                  ? "bg-success"
                                  : order.status === "Pending"
                                    ? "bg-warning"
                                    : "bg-info"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-3">
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom py-3">
              <h6 className="mb-0 fw-bold">Quick Actions</h6>
            </div>
            <div className="card-body d-flex flex-column gap-2">
              <button
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setActiveTab("products")}
              >
                <Package size={18} />
                Manage Products
              </button>
              <button
                className="btn btn-info w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingCart size={18} />
                Manage Orders
              </button>
              <button
                className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 size={18} />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
