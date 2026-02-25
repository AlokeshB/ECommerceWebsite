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
import { NotificationBell } from "../components/NotificationBell";
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
        <div className="d-flex align-items-center gap-4">
          <NotificationBell role="admin" />
          <button
            className="btn btn-danger d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
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
  const [analytics, setAnalytics] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const authToken = sessionStorage.getItem("authToken");
        
        if (!authToken) {
          setError("No auth token found");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/admin/analytics/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log("Analytics Response Status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Analytics Data:", data);
        
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch analytics");
          setAnalytics(null);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError(error.message || "Error fetching analytics");
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h5>Error Loading Analytics</h5>
        <p>{error}</p>
        <button 
          className="btn btn-sm btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="alert alert-warning" role="alert">
        <h5>No Data Available</h5>
        <p>Analytics data could not be loaded. Please check your connection and try again.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: (analytics?.totalProducts || 0).toString(),
      icon: Package,
      color: "primary",
    },
    {
      label: "Total Orders",
      value: (analytics?.totalOrders || 0).toString(),
      icon: ShoppingCart,
      color: "success",
    },
    {
      label: "Total Revenue",
      value: `₹${(analytics?.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: BarChart3,
      color: "info",
    },
    {
      label: "Total Users",
      value: (analytics?.totalUsers || 0).toString(),
      icon: Package,
      color: "warning",
    },
  ];

  // Get recent orders from analytics
  const recentOrders = [];

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
              <h6 className="mb-0 fw-bold">Order Status Distribution</h6>
            </div>
            <div className="card-body">
              {analytics?.ordersByStatus && analytics.ordersByStatus.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="small">Status</th>
                        <th className="small">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.ordersByStatus.map((item, index) => (
                        <tr key={index}>
                          <td className="small fw-bold text-capitalize">{item._id}</td>
                          <td className="small">
                            <span className="badge bg-primary">{item.count}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted py-3">No orders yet</p>
              )}
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
