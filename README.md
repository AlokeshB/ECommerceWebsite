# E-Commerce Platform - Complete Documentation

A production-ready full-stack E-Commerce platform with React frontend and Express.js backend.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Frontend Documentation](#frontend-documentation)
6. [Backend API Documentation](#backend-api-documentation)
7. [Frontend-Backend Integration](#frontend-backend-integration)
8. [Setup & Installation](#setup--installation)
9. [Testing Guide](#testing-guide)
10. [Deployment Guide](#deployment-guide)

---

# Project Overview

## Introduction

This is a complete E-Commerce Platform designed to allow users to browse products, manage shopping carts, make payments, and track orders. The platform features a responsive React frontend and a production-ready Express.js backend with MongoDB database.

## Key Features

### User Features
- ✅ User Registration & Login with JWT authentication
- ✅ Secure profile management with address support
- ✅ Product browsing and detailed product views
- ✅ Category filtering and search functionality
- ✅ Shopping cart management (add, remove, update quantities)
- ✅ Payment card management
- ✅ Secure checkout with order creation
- ✅ Real-time order tracking with status history
- ✅ Order history and management
- ✅ Product reviews and ratings

### Admin Features
- ✅ Product management (Create, Read, Update, Delete)
- ✅ Order management and status updates
- ✅ User management
- ✅ Analytics and reporting
- ✅ Revenue tracking

### Data Persistence
- ✅ All user data stored in MongoDB
- ✅ No localStorage usage for data persistence
- ✅ SessionStorage only for temporary authentication tokens
- ✅ Multi-device login support

---

# Architecture

## MVC Architecture

The backend follows the Model-View-Controller (MVC) pattern for clean separation of concerns. Request flow:

1. **Routes Layer** - Maps URL to Controllers
2. **Middleware Layer** - Authentication, Authorization, Error Handling
3. **Controllers Layer** - Business Logic
4. **Models Layer** - Data Structures (Mongoose Schemas)
5. **MongoDB Database** - Persistent Storage

## Data Flow

```
Frontend (React Context) ↔ Bearer Token ↔ Backend API ↔ MongoDB
```

---

# Technology Stack

## Frontend
- **Framework**: React.js with React Router
- **Build Tool**: Vite.js
- **State Management**: React Context API
- **Styling**: Responsive CSS
- **API Communication**: Fetch API with Bearer tokens

## Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **Architecture**: MVC Pattern

## Ports
- **Frontend**: 5173 (Vite dev server)
- **Backend**: 5000
- **Database**: MongoDB (local or Atlas)

---

# Project Structure

## Root Directory

```
e-commerce-website/
├── e_commerce/
│   ├── client_side/      # React Frontend
│   └── server_side/      # Express Backend
├── README.md             # This file (complete documentation)
└── .gitignore            # Git ignore rules
```

## Frontend Structure

```
client_side/
├── src/
│   ├── components/       # Reusable components (Navbar, Footer, etc.)
│   ├── pages/           # App pages (Home, Cart, Checkout, etc.)
│   ├── context/         # React Context providers
│   ├── routes/          # Route guards
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
├── package.json
└── index.html
```

## Backend Structure

```
server_side/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/      # Business logic handlers
│   ├── middleware/       # Auth, error handling, uploads
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper functions
│   └── app.js
├── server.js
├── .env
├── package.json
└── README.md
```

---

# Frontend Documentation

## Frontend Setup

### Prerequisites
- Node.js v14+
- npm or yarn

### Installation & Running

1. Navigate to frontend:
   ```bash
   cd e_commerce/client_side
   npm install
   npm run dev
   ```

2. Open `http://localhost:5173` in browser

## Frontend Modules

### 🔐 Authentication
- User registration with full address details
- JWT-based login
- Profile management
- Session storage for auth tokens
- Role-based routing (user/admin)

### 📦 Product Management
- Browse all products from MongoDB
- View detailed product information
- Filter by category
- Search products
- Product reviews and ratings

### 🛒 Shopping Cart
- Add/remove items from cart
- Update quantities
- Cart persisted in MongoDB
- Real-time total calculation

### 📋 Orders
- Secure checkout flow
- Order creation with shipping details
- Real-time order tracking
- Order history in user profile
- "Buy Now" for single-item checkout

### 👤 User Profile
- View and update profile information
- Manage multiple addresses
- Manage payment cards
- View order history
- View notifications

### 🎛️ Admin Dashboard
- Product CRUD operations
- Order management with status updates
- Analytics and reporting
- User management
- Protected by admin role

## Frontend State Management (Context API)

- **AuthContext** - User authentication and profile
- **CartContext** - Shopping cart operations
- **ProductContext** - Product listing and filtering
- **OrderContext** - Order management
- **NotificationContext** - App notifications
- **WishlistContext** - User wishlist

---

# Backend API Documentation

## Backend Setup

### Prerequisites
- Node.js v14+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Quick Start

1. Navigate to backend:
   ```bash
   cd e_commerce/server_side
   npm install
   ```

2. Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017
   DB_NAME=ecommerce
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Available Scripts

```bash
npm start      # Production mode
npm run dev    # Development mode with auto-reload
npm run seed   # Seed database with sample data
```

## API Endpoints

### API Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /auth/register
Register new user

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India"
}
```

#### POST /auth/login
User login - Returns JWT token

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /auth/profile
Get user profile (requires auth)

#### PUT /auth/update-profile
Update user profile (requires auth)

#### POST /auth/addresses
Add user address (requires auth)

#### GET /auth/addresses
Get all user addresses (requires auth)

#### DELETE /auth/addresses/:id
Delete user address (requires auth)

### Product Endpoints

#### GET /products
Get all products with filtering

**Query Parameters:**
- `keyword` - Search term
- `price[gte]` - Minimum price
- `price[lte]` - Maximum price
- `page` - Page number
- `limit` - Items per page

#### GET /products/:id
Get product details

#### GET /products/category/:category
Get products by category

#### POST /products/:id/review
Add review to product (requires auth)

### Cart Endpoints (all require authentication)

#### GET /cart
Get user's shopping cart

#### POST /cart/add
Add product to cart

```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

#### PUT /cart/update/:itemId
Update cart item quantity

#### DELETE /cart/remove/:itemId
Remove item from cart

#### DELETE /cart/clear
Clear entire cart

### Order Endpoints (require authentication unless noted)

#### POST /orders/create
Create new order

```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "MH",
    "zipCode": "400001",
    "country": "India"
  },
  "paymentMethod": "upi"
}
```

#### GET /orders/my-orders
Get user's orders (requires auth)

#### GET /orders/:id
Get order details (requires auth)

#### GET /orders/track/:id
Track order status (public endpoint)

#### PUT /orders/:id/cancel
Cancel order (requires auth)

### Payment Card Endpoints (require authentication)

#### POST /payment-cards
Add payment card

```json
{
  "cardNumber": "4111111111111111",
  "cardHolder": "John Doe",
  "expiryMonth": "12",
  "expiryYear": "25",
  "cvv": "123"
}
```

#### GET /payment-cards
Get user's cards

#### DELETE /payment-cards/:id
Delete card

### Admin Endpoints (require admin role)

#### POST /admin/products/create
Create product

#### PUT /admin/products/:id
Update product

#### DELETE /admin/products/:id
Delete product

#### GET /admin/orders
Get all orders

#### PUT /admin/orders/:id/status
Update order status

#### GET /admin/analytics/dashboard
Get analytics data

## Database Schemas

### User
```javascript
{
  name, email, password (hashed), phone,
  address, city, state, zipCode, country,
  addresses: [{ street, city, state, zipCode, country }],
  role: "user" | "admin",
  createdAt, updatedAt
}
```

### Product
```javascript
{
  name, description, price, discountPrice,
  category, image, images: [String],
  stock, rating, numReviews,
  reviews: [{ userId, userName, rating, comment }],
  createdAt, updatedAt
}
```

### Order
```javascript
{
  orderNumber, userId,
  items: [{ product, quantity, price }],
  shippingAddress: { ... },
  totalAmount, shippingCost, tax,
  paymentMethod, paymentStatus,
  orderStatus, trackingNumber,
  statusHistory: [{ status, timestamp }],
  createdAt, updatedAt
}
```

### Cart
```javascript
{
  userId,
  items: [{ productId, quantity, price }],
  createdAt, updatedAt
}
```

### PaymentCard
```javascript
{
  userId, cardNumber, cardHolder,
  expiryMonth, expiryYear, cvv,
  isDefault, isActive,
  createdAt, updatedAt
}
```

## Security

- **Password Hashing** - bcryptjs with 10 salt rounds
- **Authentication** - JWT tokens with configurable expiration
- **Authorization** - Role-based access control (user/admin)
- **Token Storage** - SessionStorage (cleared on browser close)
- **Input Validation** - Mongoose schemas and controller validation

## Error Handling

Standard error response:
```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Server Error

---

# Frontend-Backend Integration

## Integration Status: ✅ COMPLETE

### All Modules Integrated

✅ **Authentication** - Register, Login, Profile Management
✅ **Products** - Browse, Search, Filter, Details
✅ **Cart** - Add, Remove, Update, Persist
✅ **Orders** - Create, Track, History
✅ **Addresses** - Add, View, Update, Delete
✅ **Payment Cards** - Add, View, Delete
✅ **Admin Dashboard** - Product & Order Management
✅ **Notifications** - Real-time notifications

### Data Storage

| Data | Old | New |
|------|-----|-----|
| Auth Token | sessionStorage | sessionStorage ✅ |
| User Data | localStorage | MongoDB ✅ |
| Products | Static | MongoDB ✅ |
| Orders | localStorage | MongoDB ✅ |
| Addresses | localStorage | MongoDB ✅ |
| Cards | localStorage | MongoDB ✅ |
| Cart | localStorage | MongoDB ✅ |

### Request Example: Add to Cart

```javascript
const response = await fetch("http://localhost:5000/api/cart/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  },
  body: JSON.stringify({
    productId: product._id,
    quantity: 1,
  }),
});
```

---

# Setup & Installation

## Full Stack Setup

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm/yarn

### Backend Setup

```bash
cd e_commerce/server_side
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGODB_URI=mongodb://127.0.0.1:27017" >> .env
echo "DB_NAME=ecommerce" >> .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "JWT_EXPIRE=7d" >> .env
echo "NODE_ENV=development" >> .env

# Start server
npm run dev
```

### Frontend Setup

```bash
cd e_commerce/client_side
npm install
npm run dev
```

### Verify Setup

- Backend: http://localhost:5000/api (should return API response)
- Frontend: http://localhost:5173 (React app loads)
- MongoDB: Connected to ecommerce database

---

# Testing Guide

## Test Scenarios

### 1. User Registration
1. Click "Register"
2. Fill form with details
3. Submit

**Expected:** Auto-login and redirect to Home ✅

### 2. User Login
1. Click "Login"
2. Enter credentials
3. Submit

**Expected:** Logged in, token in sessionStorage ✅

### 3. Add to Cart
1. Browse products
2. Click "Add to Cart"
3. Verify in Cart page

**Expected:** Item in cart, persisted in MongoDB ✅

### 4. Checkout
1. Go to Cart
2. Click "Checkout"
3. Fill shipping address
4. Select payment method
5. Place order

**Expected:** Order created in MongoDB, redirected to tracking ✅

### 5. User Profile
1. Login
2. Click Profile
3. Go to "Addresses" tab
4. Add new address

**Expected:** Address persisted in MongoDB ✅

### 6. Payment Cards
1. Go to Profile → Payment Cards
2. Add payment card
3. Verify card saved

**Expected:** Card stored in MongoDB ✅

## Verification

- [ ] Users can register and auto-login
- [ ] User addresses save to MongoDB
- [ ] Payment cards save to MongoDB
- [ ] Products fetched from `/api/products`
- [ ] Cart operations call backend APIs
- [ ] Orders created in MongoDB
- [ ] Order tracking works
- [ ] SessionStorage cleared on logout
- [ ] Token persists across page refresh

## Common Issues

| Issue | Solution |
|-------|----------|
| User not logged in after register | Check AuthContext and sessionStorage |
| Products not loading | Verify backend running, `/api/products` accessible |
| Cards/Addresses not saving | Check MongoDB is connected, API endpoints |
| Orders not visible | Verify order created in MongoDB, `/api/orders/my-orders` works |

---

# Deployment Guide

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=ecommerce
JWT_SECRET=strong_random_key_here
JWT_EXPIRE=7d
NODE_ENV=production
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### Deployment Checklist

- [ ] Change JWT_SECRET to strong random key
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas (not localhost)
- [ ] Enable HTTPS/SSL
- [ ] Test all endpoints
- [ ] Set up error monitoring
- [ ] Configure CORS origins

## Deploy to Heroku

```bash
heroku login
heroku create app-name
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

## Deploy to Railway/Render

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Automatic deployment on push

---

## Project Summary

**Type:** Full-Stack E-Commerce Platform
**Frontend:** React + Vite + Context API
**Backend:** Express.js + MongoDB
**Database:** 7 collections (User, Product, Order, Cart, PaymentCard, Notification, Wishlist)
**APIs:** 28+ endpoints
**Authentication:** JWT Bearer tokens
**Data Storage:** MongoDB (single source of truth)

---

**Version:** 1.0.0  
**Last Updated:** March 2, 2026  
**Status:** ✅ Complete & Production Ready
