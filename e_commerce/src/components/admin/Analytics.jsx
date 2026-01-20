import React, { useState } from "react";
import { TrendingUp, Users, ShoppingCart, DollarSign, Calendar } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("7days");

  const analyticsData = {
    "7days": {
      revenue: 45230,
      orders: 156,
      customers: 89,
      avgOrderValue: 290,
      conversionRate: 3.2,
    },
    "30days": {
      revenue: 185450,
      orders: 623,
      customers: 342,
      avgOrderValue: 298,
      conversionRate: 3.5,
    },
    "90days": {
      revenue: 589230,
      orders: 1956,
      customers: 1023,
      avgOrderValue: 301,
      conversionRate: 3.8,
    },
  };

  const currentData = analyticsData[dateRange];

  const topProducts = [
    { name: "Premium Wireless Headphones", sales: 234, revenue: 701766 },
    { name: "Smart Fitness Watch", sales: 189, revenue: 850500 },
    { name: "Classic Denim Jacket", sales: 156, revenue: 296244 },
    { name: "Running Sports Shoes", sales: 142, revenue: 454400 },
  ];

  const categoryStats = [
    { category: "Electronics", sales: 45, percentage: 35 },
    { category: "Fashion", sales: 52, percentage: 40 },
    { category: "Wearables", sales: 25, percentage: 19 },
    { category: "Accessories", sales: 8, percentage: 6 },
  ];

  const recentActivity = [
    { time: "10:30 AM", action: "New order placed", details: "ORD005442", icon: ShoppingCart },
    { time: "09:45 AM", action: "Product reviewed", details: "Premium Headphones - 5 stars", icon: TrendingUp },
    { time: "08:20 AM", action: "User registered", details: "new.user@example.com", icon: Users },
    { time: "07:15 AM", action: "Payment received", details: "₹4,500 from Order ORD005441", icon: DollarSign },
  ];

  return (
    <div>
      {/* Date Range Selector */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Sales Analytics & Reports</h5>
        <div className="d-flex align-items-center gap-2">
          <Calendar size={18} className="text-muted" />
          <select
            className="form-select form-select-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: "150px" }}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-primary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">Total Revenue</p>
                  <h4 className="mb-0 fw-bold">₹{currentData.revenue.toLocaleString()}</h4>
                  <small className="text-success">↑ 12.5% from last period</small>
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
                  <h4 className="mb-0 fw-bold">{currentData.orders}</h4>
                  <small className="text-success">↑ 8.3% from last period</small>
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
                  <p className="text-muted small mb-1">Total Customers</p>
                  <h4 className="mb-0 fw-bold">{currentData.customers}</h4>
                  <small className="text-success">↑ 5.2% from last period</small>
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
                  <p className="text-muted small mb-1">Avg Order Value</p>
                  <h4 className="mb-0 fw-bold">₹{currentData.avgOrderValue}</h4>
                  <small className="text-success">↑ 2.1% from last period</small>
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
              {topProducts.map((product, index) => (
                <div key={index} className="mb-3 pb-3 border-bottom">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <p className="mb-0 small fw-bold">{product.name}</p>
                    <span className="badge bg-primary">{product.sales} sales</span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${(product.sales / 234) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mb-0 text-muted small mt-1">
                    Revenue: ₹{product.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom py-3">
              <h6 className="mb-0 fw-bold">Sales by Category</h6>
            </div>
            <div className="card-body">
              {categoryStats.map((cat, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <p className="mb-0 small fw-bold">{cat.category}</p>
                    <span className="badge bg-secondary">{cat.sales} sales</span>
                  </div>
                  <div className="progress" style={{ height: "24px" }}>
                    <div
                      className={`progress-bar bg-${
                        index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "info" : "warning"
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    >
                      <small className="fw-bold">{cat.percentage}%</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Recent Activity */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom py-3">
              <h6 className="mb-0 fw-bold">Recent Activity</h6>
            </div>
            <div className="card-body">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 small fw-bold">{activity.action}</p>
                      <p className="mb-0 text-muted small">{activity.details}</p>
                    </div>
                    <p className="mb-0 text-muted small" style={{ minWidth: "60px", textAlign: "right" }}>
                      {activity.time}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom py-3">
              <h6 className="mb-0 fw-bold">Key Metrics</h6>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <p className="text-muted small mb-1">Conversion Rate</p>
                <h5 className="mb-2 fw-bold">{currentData.conversionRate}%</h5>
                <div className="progress" style={{ height: "6px" }}>
                  <div className="progress-bar bg-success"
                    style={{ width: `${currentData.conversionRate * 10}%` }}></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-muted small mb-1">Customer Satisfaction</p>
                <h5 className="mb-2 fw-bold">4.6/5.0</h5>
                <div className="progress" style={{ height: "6px" }}>
                  <div className="progress-bar bg-warning"
                    style={{ width: "92%" }}></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-muted small mb-1">Inventory Health</p>
                <h5 className="mb-2 fw-bold">87%</h5>
                <div className="progress" style={{ height: "6px" }}>
                  <div className="progress-bar bg-info"
                    style={{ width: "87%" }}></div>
                </div>
              </div>

              <div>
                <p className="text-muted small mb-1">Return Rate</p>
                <h5 className="mb-2 fw-bold">2.3%</h5>
                <div className="progress" style={{ height: "6px" }}>
                  <div className="progress-bar bg-danger"
                    style={{ width: "23%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
