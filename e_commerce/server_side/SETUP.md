# Backend Setup & Architecture Guide

Complete guide for setting up, understanding, and deploying the E-Commerce backend API.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [MVC Architecture](#mvc-architecture)
3. [Project Structure](#project-structure)
4. [Request Flow](#request-flow)
5. [Database Schema](#database-schema)
6. [API Response Format](#api-response-format)
7. [Security Features](#security-features)
8. [Features Summary](#features-summary)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)

---

# Quick Start

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js v14+ installed
- MongoDB running locally or MongoDB Atlas connection string

### Step 1: Install Dependencies
```bash
cd server_side
npm install
```

### Step 2: Configure Environment
The `.env` file is pre-configured for local development:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**For MongoDB Atlas, update MONGODB_URI:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### Step 3: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✓ Database connected successfully
✓ Server running on port 5000
✓ Environment: development
✓ API URL: http://localhost:5000
```

### Step 4: Seed Sample Data (Optional)
```bash
npm run seed
```

This creates:
- Admin user (admin@example.com / admin123)
- 8 sample products

### Step 5: Test the API

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

### 🛠️ Available Scripts

```bash
npm start      # Start production server
npm run dev    # Start development server with auto-reload
npm run seed   # Seed database with sample data
```

---

# MVC Architecture

## 🏗️ MVC Architecture Implementation

This backend follows the **Model-View-Controller (MVC)** architecture pattern for clean separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                     │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    ROUTES LAYER                          │
│  (Express Route Handlers - Maps URL to Controllers)      │
│  ├── /api/auth/*                                         │
│  ├── /api/products/*                                     │
│  ├── /api/cart/*                                         │
│  ├── /api/orders/*                                       │
│  └── /api/admin/*                                        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 MIDDLEWARE LAYER                         │
│  ├── Authentication (JWT verification)                  │
│  ├── Authorization (Role checking)                      │
│  ├── Error Handling (Global error catch)                │
│  └── File Upload (Multipart handling)                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                CONTROLLERS LAYER                         │
│  (Business Logic - Handles requests)                    │
│  ├── authController (Register, Login, Profile)          │
│  ├── productController (CRUD, Search, Filter)           │
│  ├── cartController (Add, Remove, Update)               │
│  ├── orderController (Create, Track, Cancel)            │
│  └── adminController (Management, Analytics)            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   MODELS LAYER                           │
│  (Mongoose Schemas - Database structure)                │
│  ├── User Model (Authentication data)                   │
│  ├── Product Model (Product information)                │
│  ├── Cart Model (Shopping cart items)                   │
│  └── Order Model (Order information)                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   MongoDB DATABASE                       │
│  (Persistent data storage)                              │
└─────────────────────────────────────────────────────────┘
```

---

# Project Structure

## 📁 Complete File Organization

### Entry Points
- **server.js** - Main server entry point
- **src/app.js** - Express app configuration

### Models (Database Layer)
```javascript
src/models/
├── User.js         // User schema with password hashing
├── Product.js      // Product with reviews & ratings
├── Cart.js         // Shopping cart per user
└── Order.js        // Order tracking & status management
```

### Controllers (Business Logic Layer)
```javascript
src/controllers/
├── authcontroller.js       // 5 endpoints (register, login, profile, update, change-password)
├── productcontroller.js    // 6 endpoints (list, detail, category, search, review)
├── cartcontroller.js       // 5 endpoints (get, add, update, remove, clear)
├── ordercontroller.js      // 4 endpoints (create, detail, my-orders, cancel, track)
└── admincontroller.js      // 8 endpoints (product, order, user, analytics management)
```

### Routes (API Endpoints)
```javascript
src/routes/
├── authRoute.js        // /api/auth/*
├── productRoute.js     // /api/products/*
├── cartRoute.js        // /api/cart/*
├── orderRoute.js       // /api/orders/*
└── adminRoute.js       // /api/admin/*
```

### Middleware (Request Processing)
```javascript
src/middleware/
├── authMiddleware.js        // JWT token verification
├── adminMiddleware.js       // Admin role checking
├── errorMiddleware.js       // Global error handling
└── uploadMiddleware.js      // File upload processing
```

### Utilities (Helper Functions)
```javascript
src/utils/
├── generateToken.js    // JWT token generation & verification
├── apiFeatures.js      // Search, filter, sort, pagination
└── seeder.js           // Database seeding with sample data
```

### Configuration
```javascript
src/config/
├── db.js           // MongoDB connection
└── default.js      // Application defaults
```

### Root Level Files
```
.env                  // Environment variables (configured)
.gitignore           // Git ignore rules
package.json         // Dependencies and scripts
README.md            // Detailed API documentation
```

---

# Request Flow

## 🔄 Request Flow Example: User Registration

```
1. CLIENT sends POST /api/auth/register
   └─> { name, email, password, confirmPassword }

2. ROUTES (authRoute.js)
   └─> Receives request and routes to controller

3. MIDDLEWARE
   └─> Express.json() parses body
   
4. CONTROLLER (authController.register)
   └─> Validates input data
   └─> Checks if user exists
   └─> Creates new user
   └─> Returns JWT token

5. MODEL (User.js)
   └─> Hashes password using bcryptjs
   └─> Saves user to MongoDB

6. RESPONSE
   └─> { success: true, token: "...", user: {...} }

7. CLIENT receives response and stores token for future requests
```

## 🔐 Authentication Flow

### JWT Token-Based Authentication

```
LOGIN
├─> User provides email/password
├─> Controller validates credentials
├─> generateToken() creates JWT
└─> Token sent to client

AUTHENTICATED REQUEST
├─> Client includes: Authorization: Bearer <token>
├─> authMiddleware extracts token
├─> verifyToken() validates JWT
├─> User data attached to request (req.user)
└─> Request proceeds to controller

TOKEN STRUCTURE
└─> Header.Payload.Signature
    ├─> Payload contains: { id, role }
    └─> Signed with JWT_SECRET
```

---

# Database Schema

## 📊 Database Schema Relationships

```
┌──────────────┐
│    USER      │
├──────────────┤
│ _id (PK)     │
│ name         │
│ email        │
│ password     │
│ role         │
│ address      │
│ ...          │
└──────┬───────┘
       │ 1
       │
    ┌──┴──┬────────────────────────────────┐
    │     │                                │
    │1    │ N                        N     │ N
    ▼     ▼                               ▼
┌──────────────┐                   ┌──────────────┐
│    CART      │                   │    ORDER     │
├──────────────┤                   ├──────────────┤
│ _id (PK)     │                   │ _id (PK)     │
│ userId (FK)  │                   │ userId (FK)  │
│ items[       │                   │ items[       │
│  - productId │◄──────┐           │  - productId │◄──────┐
│  - quantity  │       │           │  - quantity  │       │
│  - price     │       │           │  - price     │       │
│ ]            │       │           │ ]            │       │
└──────────────┘       │           └──────────────┘       │
                       │ N                                │ N
                       │                                  │
                    ┌──┴──────────────────────────────────┤
                    │                                     │
                    0..1                                  │
                 ┌──────┐                                 │
                 │      │                                 │
            ┌────┴──────────────────────┐                │
            │                           │                │
        ┌──────────────┐        ┌──────────────┐        │
        │   PRODUCT    │        │  REVIEWS     │        │
        ├──────────────┤        ├──────────────┤        │
        │ _id (PK)     │        │ userId       │        │
        │ name         │        │ rating       │        │
        │ description  │        │ comment      │        │
        │ price        │        └──────────────┘        │
        │ discountPrice│                                 │
        │ category     │                                 │
        │ stock        │                                 │
        │ rating       │                                 │
        │ reviews[]    │                                 │
        │ createdBy(FK)├─────────────────────────────────┘
        │ ...          │
        └──────────────┘
```

---

# API Response Format

## 🔌 Standard Response Structure

### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* payload */ } // or user, token, product, etc.
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error description"
}
```

---

# Security Features

## 🛡️ Security Implementation

### 1. Password Security
- Hashed with **bcryptjs** (10 salt rounds)
- Never stored in plain text
- Verified on login using comparePassword()

### 2. JWT Authentication
- Token-based stateless authentication
- Expires after configured duration (default: 7 days)
- Secret key stored in environment variables
- Verified on every protected request

### 3. Authorization
- Role-based access control (user/admin)
- Admin middleware checks user role
- Endpoint permissions enforced

### 4. Data Validation
- Input validation in controllers
- Mongoose schema validation
- Comprehensive error handling middleware

### 5. CORS Protection
- CORS enabled for cross-origin requests
- Configurable allowed origins

---

# Features Summary

## 📈 Complete Features List

### ✅ User Management
- Registration with email/password
- Login with JWT token
- Profile view & update
- Password change
- Role-based access (user/admin)

### ✅ Product Management
- List products with pagination
- Search by keyword
- Filter by category & price
- Get product details
- Product reviews & ratings

### ✅ Shopping Cart
- Add items to cart
- Update quantities
- Remove items
- Clear cart
- Automatic total calculation

### ✅ Order Management
- Create orders from cart
- View order history
- Track order status
- Cancel orders
- Order status history

### ✅ Admin Dashboard
- Product management (CRUD)
- Order status updates
- User management
- Analytics & reporting
- Revenue tracking

---

# Troubleshooting

## 🐛 Common Issues & Solutions

### MongoDB Connection Issues

**Problem:** "Error: connect ECONNREFUSED"
```
Solution: Ensure MongoDB is running
- Windows: Start MongoDB service
- Mac: brew services start mongodb-community
- Verify: mongosh
```

**Problem:** "MongoServerError: authentication failed"
```
Solution: Check MongoDB credentials in .env
- Verify MONGODB_URI format
- Check username and password
- Verify database name
```

### Port Already in Use

**Problem:** "Error: listen EADDRINUSE: address already in use :::5000"
```
Solution: Change PORT in .env or kill the process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### JWT Token Errors

**Problem:** "Invalid or expired token"
```
Solution: Generate new token by logging in
- Logout and login again
- Check JWT_SECRET in .env (must match)
- Verify token format: Bearer <token>
```

**Problem:** "No token provided"
```
Solution: Include Authorization header
Authorization: Bearer <your_token_here>
```

### Database Not Connecting

**Problem:** Can't connect to local MongoDB
```
Solution:
1. Check MongoDB is running: mongosh
2. Verify MONGODB_URI in .env
3. Check credentials if using Auth
4. Try resetting MongoDB service
```

### Node Module Issues

**Problem:** "Cannot find module"
```
Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

# Deployment

## 🚀 Deployment Checklist

### Before Deploying to Production

- [ ] Update JWT_SECRET to a strong random key
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas instead of localhost
- [ ] Enable HTTPS/SSL
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up error monitoring
- [ ] Configure CORS allowed origins
- [ ] Test all endpoints thoroughly
- [ ] Set up backup strategy

### Deploy to Heroku

1. **Install Heroku CLI**
```bash
# Windows: Download from heroku.com or use npm
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create app-name
```

4. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_strong_secret_key
heroku config:set NODE_ENV=production
```

5. **Deploy**
```bash
git push heroku main
```

### Deploy to Railway or Render

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

### Deploy to AWS

1. Create EC2 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies: `npm install`
5. Set environment variables
6. Start server: `npm start`
7. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

---

## 📚 Dependencies

### Production Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Development Dependencies
- **nodemon** - Auto-reload server during development

---

## 📞 Support

For detailed API endpoint documentation, see [README.md](./README.md)

**Key Features:**
- 28+ API Endpoints
- Complete authentication system
- Product management
- Shopping cart & orders
- Admin dashboard
- Advanced search & filtering
- Analytics & reporting

**Stack:**
- Framework: Express.js
- Database: MongoDB
- Authentication: JWT
- Architecture: MVC

---

**Version:** 1.0.0  
**Last Updated:** February 2026
