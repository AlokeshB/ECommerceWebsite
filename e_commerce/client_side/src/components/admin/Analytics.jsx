import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  Loader2,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7days");

  // Fetch analytics from backend API
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const authToken = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/admin/analytics/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh analytics every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  return (
    <div>
      {/* Date Range Selector */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Sales Analytics & Reports</h5>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-outline-dark"
            onClick={fetchAnalytics}
            disabled={loading}
            title="Refresh analytics"
          >
            🔄 Refresh
          </button>
          <Calendar size={18} className="text-muted" />
          <select
            className="form-select form-select-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: "150px" }}
            disabled={loading}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "500px" }}>
          <Loader2 className="spinner-border text-dark" />
        </div>
      ) : analytics ? (
        <>
          {/* KPI Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm bg-primary bg-opacity-10">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Total Revenue</p>
                      <h4 className="mb-0 fw-bold">
                        ₹{analytics.totalRevenue?.toLocaleString() || 0}
                      </h4>
                      <small className="text-success">
                        ↑ 12.5% from last period
                      </small>
                    </div>
                    <DollarSign className="text-primary" size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm bg-success bg-opacity-10">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Total Orders</p>
                      <h4 className="mb-0 fw-bold">{analytics.totalOrders || 0}</h4>
                      <small className="text-success">
                        ↑ 8.3% from last period
                      </small>
                    </div>
                    <ShoppingCart className="text-success" size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm bg-info bg-opacity-10">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Total Users</p>
                      <h4 className="mb-0 fw-bold">{analytics.totalUsers || 0}</h4>
                      <small className="text-success">
                        ↑ 5.2% from last period
                      </small>
                    </div>
                    <Users className="text-info" size={32} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Total Products</p>
                      <h4 className="mb-0 fw-bold">{analytics.totalProducts || 0}</h4>
                      <small className="text-success">
                        ↑ 2.1% from last period
                      </small>
                    </div>
                    <TrendingUp className="text-warning" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>

      <div className="row g-3 mb-4">
        {/* Top Products */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom py-3">
              <h6 className="mb-0 fw-bold">Top Selling Products</h6>
            </div>
            <div className="card-body">
              {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((item, index) => {
                  const productName = item.product?.[0]?.name || "Unknown Product";
                  const totalSold = item.totalSold || 0;
                  const maxSales = Math.max(...analytics.topProducts.map(p => p.totalSold || 0));
                  return (
                    <div key={index} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <p className="mb-0 small fw-bold">{productName}</p>
                        <span className="badge bg-primary">
                          {totalSold} sales
                        </span>
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: `${maxSales > 0 ? (totalSold / maxSales) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted text-center py-3">No sales data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom py-3">
              <h6 className="mb-0 fw-bold">Order Distribution by Status</h6>
            </div>
            <div className="card-body">
              {analytics?.ordersByStatus && analytics.ordersByStatus.length > 0 ? (
                analytics.ordersByStatus.map((item, index) => {
                  const totalOrders = analytics.ordersByStatus.reduce((sum, o) => sum + o.count, 0);
                  const percentage = totalOrders > 0 ? Math.round((item.count / totalOrders) * 100) : 0;
                  return (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="mb-0 small fw-bold text-capitalize">{item._id}</p>
                        <span className="badge bg-secondary">
                          {item.count} orders
                        </span>
                      </div>
                      <div className="progress" style={{ height: "24px" }}>
                        <div
                          className={`progress-bar bg-${
                            item._id === "pending"
                              ? "warning"
                              : item._id === "delivered"
                                ? "success"
                                : item._id === "cancelled"
                                  ? "danger"
                                  : "info"
                          }`}
                          style={{ width: `${percentage}%` }}
                        >
                          <small className="fw-bold">{percentage}%</small>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted text-center py-3">
                  No order data yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Recent Orders */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom py-3">
              <h6 className="mb-0 fw-bold">Top Selling Products</h6>
            </div>
            <div className="card-body">
              {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="small">Product Name</th>
                        <th className="small">Units Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topProducts.slice(0, 5).map((item, index) => {
                        const productName = item.product?.[0]?.name || "Unknown Product";
                        return (
                          <tr key={index}>
                            <td className="small fw-bold">{productName}</td>
                            <td className="small">
                              <span className="badge bg-primary">{item.totalSold} sold</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-3">No product sales data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom py-3">
              <h6 className="mb-0 fw-bold">Quick Stats</h6>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <p className="text-muted small mb-1">Avg Order Value</p>
                <h5 className="mb-2 fw-bold">
                  ₹{analytics?.totalOrders > 0 ? Math.round(analytics.totalRevenue / analytics.totalOrders) : 0}
                </h5>
              </div>

              <div className="mb-4">
                <p className="text-muted small mb-1">Total Orders</p>
                <h5 className="mb-2 fw-bold">{analytics?.totalOrders || 0}</h5>
              </div>

              <div className="mb-4">
                <p className="text-muted small mb-1">Active Users</p>
                <h5 className="mb-2 fw-bold">{analytics?.totalUsers || 0}</h5>
              </div>

              <div>
                <p className="text-muted small mb-1">Total Products</p>
                <h5 className="mb-2 fw-bold">{analytics?.totalProducts || 0}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      ) : (
        <div className="alert alert-warning" role="alert">
          <p>No analytics data available at this moment.</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
