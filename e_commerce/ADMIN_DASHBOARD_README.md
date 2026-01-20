# Admin Dashboard Documentation

## Overview
The Admin Dashboard is a comprehensive management system for the e-commerce platform, providing administrators with tools to manage products, orders, and view detailed analytics.

## Features

### 1. Dashboard Home
- **Quick Statistics**: Overview of key metrics including:
  - Total Products
  - Total Orders
  - Total Revenue
  - Active Users
- **Recent Orders**: Quick view of latest orders with status
- **Quick Actions**: Fast access buttons for common tasks

### 2. Product Management
- **Add Products**: Create new products with details:
  - Product Name
  - Category (Electronics, Fashion, Wearables, Accessories)
  - Price
  - Stock Quantity
  - Product Image (emoji)

- **Edit Products**: Update existing product information
- **Delete Products**: Remove products from catalog
- **Search & Filter**: Find products by name or category
- **Stock Status**: Visual indicators for inventory levels

### 3. Order Management
- **View Orders**: Complete list of all orders with:
  - Order ID
  - Customer Name
  - Order Date
  - Order Amount
  - Number of Items
  - Current Status

- **Order Details**: Expand orders to see:
  - Customer Email
  - Ordered Products
  - Itemized Breakdown
  - Tracking Information

- **Update Status**: Change order status through:
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled

- **Search & Filter**: Find orders by ID, customer name, or email
- **Delete Orders**: Remove orders from system

### 4. Analytics & Reports
- **Date Range Selection**: View data for 7 days, 30 days, or 90 days
- **Key Metrics**:
  - Total Revenue with trend indicators
  - Total Orders placed
  - Total Customers
  - Average Order Value
  - Conversion Rate

- **Top Selling Products**: Track best-performing products with:
  - Sales count
  - Revenue generated
  - Visual progress bars

- **Sales by Category**: Distribution of sales across product categories with percentages

- **Recent Activity**: Feed of recent system events:
  - New orders
  - Product reviews
  - User registrations
  - Payment receipts

- **Key Performance Indicators**:
  - Conversion Rate
  - Customer Satisfaction
  - Inventory Health
  - Return Rate

### 5. Settings
- **Store Configuration**:
  - Store Name
  - Store Email
  - Store Phone
  - Currency Selection

## Access
- **URL**: `/admin`
- **Admin Link**: Settings icon in navbar (visible for demo purposes)
- Currently accessible without authentication (for demonstration)

## Navigation
- **Sidebar**: Main navigation menu with collapsible design
- **Responsive**: Mobile-friendly layout with hamburger menu
- **Top Bar**: Quick access to admin profile and logout

## Technical Stack
- **Framework**: React
- **UI Components**: Bootstrap 5
- **Icons**: Lucide React
- **Styling**: Custom CSS with responsive design
- **State Management**: React useState hooks

## Future Enhancements
- User authentication and role-based access control
- Database integration for persistent data
- Advanced filtering and sorting options
- Export reports to PDF/Excel
- Email notifications for orders
- Inventory alerts and low stock warnings
- Customer management system
- Multi-language support
