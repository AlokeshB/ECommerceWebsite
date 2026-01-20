import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductManagement from "../components/admin/ProductManagement";
import OrderManagement from "../components/admin/OrderManagement";
import Analytics from "../components/admin/Analytics";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="admin-container d-flex">
      {/* Sidebar */}
      <aside className={`admin-sidebar bg-dark text-white ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0">Admin Panel</h5>
          <button
            className="btn btn-dark btn-sm d-lg-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item w-100 text-start px-3 py-3 border-0 bg-transparent text-white ${
                  activeTab === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  // Only close sidebar on mobile (below 992px)
                  if (window.innerWidth < 992) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <Icon size={20} className="me-2" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer border-top mt-auto p-3">
          <button
            className="btn btn-outline-light w-100 btn-sm mb-2 d-flex align-items-center justify-content-center gap-2"
            onClick={handleGoHome}
          >
            <Home size={18} />
            Home
          </button>
          <button
            className="btn btn-danger w-100 btn-sm d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content flex-grow-1">
        {/* Top Bar */}
        <div className="admin-topbar bg-white shadow-sm p-3 d-flex align-items-center justify-content-between">
          <button
            className="btn btn-light d-lg-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <h4 className="mb-0">
            {menuItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
          </h4>
          <div className="topbar-user d-flex align-items-center gap-3">
            <div className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "40px", height: "40px" }}>
              A
            </div>
            <span className="d-none d-md-block text-dark fw-bold">Admin</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-main-content p-4">
          {activeTab === "dashboard" && <DashboardHome />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = () => {
  const stats = [
    { label: "Total Products", value: "234", icon: Package, color: "primary" },
    { label: "Total Orders", value: "1,245", icon: ShoppingCart, color: "success" },
    { label: "Total Revenue", value: "₹89,450", icon: BarChart3, color: "info" },
    { label: "Active Users", value: "567", icon: Package, color: "warning" },
  ];

  return (
    <div>
      <h5 className="mb-4 fw-bold">Welcome to Admin Dashboard</h5>
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="col-md-6 col-lg-3">
              <div className={`card border-0 shadow-sm bg-${stat.color} bg-opacity-10`}>
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
                    {[
                      { id: "ORD001", customer: "John Doe", amount: "₹2,500", status: "Delivered" },
                      { id: "ORD002", customer: "Jane Smith", amount: "₹1,800", status: "Pending" },
                      { id: "ORD003", customer: "Mike Johnson", amount: "₹3,200", status: "Processing" },
                    ].map((order) => (
                      <tr key={order.id}>
                        <td className="small fw-bold">{order.id}</td>
                        <td className="small">{order.customer}</td>
                        <td className="small">{order.amount}</td>
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
                    ))}
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
            <div className="card-body">
              <button className="btn btn-primary w-100 mb-2">
                <Package size={18} className="me-2" />
                Add New Product
              </button>
              <button className="btn btn-info w-100 mb-2">
                <ShoppingCart size={18} className="me-2" />
                View All Orders
              </button>
              <button className="btn btn-secondary w-100">
                <BarChart3 size={18} className="me-2" />
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Page Component
const SettingsPage = () => {
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-light border-bottom py-3">
            <h6 className="mb-0 fw-bold">Admin Settings</h6>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label className="form-label fw-bold">Store Name</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="Fashion Hub"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Store Email</label>
                <input
                  type="email"
                  className="form-control"
                  defaultValue="admin@fashionhub.com"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Store Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  defaultValue="+91 9876543210"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Currency</label>
                <select className="form-select">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-dark">
                Save Settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
