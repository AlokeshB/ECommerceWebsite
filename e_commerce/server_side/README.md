# E-Commerce Backend API

A production-ready Express.js-based REST API for an E-Commerce platform, following the MVC (Model-View-Controller) architecture pattern.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Database Models](#database-models)
- [Middleware](#middleware)

---

## Project Structure

```
server_side/
├── src/
│   ├── config/
│   │   ├── db.js              # Database connection configuration
│   │   └── default.js         # Default configuration values
│   ├── controllers/
│   │   ├── authcontroller.js       # Authentication logic
│   │   ├── productcontroller.js    # Product management logic
│   │   ├── cartcontroller.js       # Shopping cart logic
│   │   ├── ordercontroller.js      # Order management logic
│   │   └── admincontroller.js      # Admin operations logic
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT authentication middleware
│   │   ├── adminMiddleware.js      # Admin authorization middleware
│   │   ├── errorMiddleware.js      # Global error handler
│   │   └── uploadMiddleware.js     # File upload handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Product.js         # Product schema
│   │   ├── Cart.js            # Shopping cart schema
│   │   └── Order.js           # Order schema
│   ├── routes/
│   │   ├── authRoute.js       # Authentication routes
│   │   ├── productRoute.js    # Product routes
│   │   ├── cartRoute.js       # Cart routes
│   │   ├── orderRoute.js      # Order routes
│   │   └── adminRoute.js      # Admin routes
│   ├── utils/
│   │   ├── generateToken.js   # JWT token generation & verification
│   │   └── apiFeatures.js     # API utility functions (search, filter, sort)
│   └── app.js                 # Express app setup
├── server.js                  # Server entry point
├── package.json              # Dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

---

## Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Local or MongoDB Atlas connection string)
- **npm** or **yarn** package manager

### Steps

1. **Navigate to server_side directory:**
   ```bash
   cd server_side
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your configuration:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=ecommerce
   JWT_SECRET=your_secure_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `ecommerce` |
| `JWT_SECRET` | JWT authentication secret | Required |
| `JWT_EXPIRE` | JWT token expiration time | `7d` |
| `NODE_ENV` | Environment mode | `development` |

---

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Expected Output
```
✓ Database connected successfully
✓ Server running on port 5000
✓ Environment: development
✓ API URL: http://localhost:5000
```

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login user |
| GET | `/profile` | Yes | Get user profile |
| PUT | `/update-profile` | Yes | Update user profile |
| PUT | `/change-password` | Yes | Change password |

**Register/Login Example:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

---

### Product Endpoints (`/products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all products (with search, filter, sort) |
| GET | `/:id` | No | Get single product |
| GET | `/category/:category` | No | Get products by category |
| GET | `/search/:keyword` | No | Search products |
| GET | `/categories` | No | Get all categories |
| GET | `/:id/reviews` | No | Get product reviews |
| POST | `/:id/review` | Yes | Add review to product |

**Query Parameters for `/products`:**
- `keyword`: Search term
- `price[lte]`: Max price
- `price[gte]`: Min price
- `rating[gte]`: Min rating
- `sort`: Sort field (e.g., `-price`, `name`)
- `page`: Page number
- `limit`: Items per page

**Example:**
```
GET /api/products?keyword=laptop&price[lte]=50000&sort=-rating&page=1
```

---

### Cart Endpoints (`/cart`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get user cart |
| POST | `/add` | Yes | Add product to cart |
| PUT | `/update/:itemId` | Yes | Update cart item quantity |
| DELETE | `/remove/:itemId` | Yes | Remove item from cart |
| DELETE | `/clear` | Yes | Clear entire cart |

**Add to Cart Example:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

---

### Order Endpoints (`/orders`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create` | Yes | Create new order |
| GET | `/my-orders` | Yes | Get user's orders |
| GET | `/:id` | Yes | Get order details |
| PUT | `/:id/cancel` | Yes | Cancel order |
| GET | `/track/:id` | No | Track order (public) |

**Create Order Example:**
```json
{
  "shippingAddress": {
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

---

### Admin Endpoints (`/admin`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/products/create` | Yes | Admin | Create product |
| PUT | `/products/:id` | Yes | Admin | Update product |
| DELETE | `/products/:id` | Yes | Admin | Delete product |
| GET | `/orders` | Yes | Admin | Get all orders |
| PUT | `/orders/:id/status` | Yes | Admin | Update order status |
| GET | `/analytics/dashboard` | Yes | Admin | Get dashboard analytics |
| GET | `/users` | Yes | Admin | Get all users |
| PUT | `/users/:id/role` | Yes | Admin | Update user role |

**Create Product Example:**
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 50000,
  "discountPrice": 45000,
  "category": "Electronics",
  "stock": 100
}
```

**Update Order Status Example:**
```json
{
  "orderStatus": "shipped",
  "paymentStatus": "completed",
  "trackingNumber": "TRACK123456",
  "note": "Order shipped successfully"
}
```

---

## Authentication

### Bearer Token
All protected endpoints require a `Bearer` token in the Authorization header:

```
Authorization: Bearer <token>
```

### Getting a Token
1. Register or login to get a JWT token
2. Include token in all subsequent requests
3. Token expires as per `JWT_EXPIRE` setting

### Token Structure
```javascript
{
  "id": "user_id",
  "role": "user" // or "admin"
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

### Common Errors

**Missing Authorization:**
```json
{
  "success": false,
  "message": "No token provided. Authorization denied."
}
```

**Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

**Insufficient Permissions:**
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

---

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  role: "user" | "admin",
  isEmailVerified: Boolean,
  isActive: Boolean,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: String,
  image: String,
  images: [String],
  stock: Number,
  rating: Number (0-5),
  numReviews: Number,
  reviews: [{
    userId: ObjectId,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: DateTime
  }],
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Cart Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    addedAt: DateTime
  }],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  totalAmount: Number,
  shippingCost: Number,
  tax: Number,
  paymentMethod: String,
  paymentStatus: "pending" | "completed" | "failed" | "refunded",
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned",
  trackingNumber: String,
  estimatedDelivery: DateTime,
  actualDelivery: DateTime,
  notes: String,
  statusHistory: [{
    status: String,
    timestamp: DateTime,
    note: String
  }],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## Middleware

### Authentication Middleware (`authMiddleware.js`)
- Verifies JWT token in Authorization header
- Attaches user data to request object
- Returns 401 if token is invalid or missing

### Admin Middleware (`adminMiddleware.js`)
- Checks if user has admin role
- Returns 403 if user is not admin
- Must be used after `authMiddleware`

### Error Middleware (`errorMiddleware.js`)
- Global error handler
- Catches validation errors
- Handles MongoDB errors (CastError, duplicate keys)
- Returns formatted error responses

### Upload Middleware (`uploadMiddleware.js`)
- File upload handler
- Can be extended for image uploads
- Supports multipart/form-data requests

---

## Features

✅ **User Authentication**
- Registration & Login with JWT
- Password hashing with bcryptjs
- Profile management
- Password change functionality

✅ **Product Management**
- Product CRUD operations
- Category filtering
- Search functionality
- Product reviews and ratings
- Discount pricing

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Cart persistence per user
- Auto-calculate totals

✅ **Order Management**
- Create orders from cart
- Order tracking
- Order status updates
- Order history for users
- Automatic stock management

✅ **Admin Dashboard**
- Product management
- Order management
- User management
- Analytics and reporting
- Role-based access control

✅ **API Features**
- Advanced search and filtering
- Sorting capabilities
- Pagination support
- Error handling
- CORS support

---

## Database Setup

### Local MongoDB

1. **Install MongoDB Community Edition:**
   - Windows: [Download from MongoDB](https://www.mongodb.com/try/download/community)
   - Mac: `brew tap mongodb/brew && brew install mongodb-community`

2. **Start MongoDB Service:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   ```

3. **Verify Connection:**
   ```bash
   mongosh
   ```

### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   ```

---

## Testing API Endpoints

### Using Postman

1. Import collection
2. Set environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: JWT token from login
3. Test endpoints with pre-configured requests

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","confirmPassword":"pass123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

**Get Products:**
```bash
curl -X GET http://localhost:5000/api/products?keyword=laptop&page=1
```

---

## Troubleshooting

### Database Connection Errors

**Error:** `Error: connect ECONNREFUSED`
- **Solution:** Ensure MongoDB is running. Start MongoDB service.

**Error:** `MongoServerError: authentication failed`
- **Solution:** Check MongoDB credentials in `.env`

### JWT Token Issues

**Error:** `Invalid or expired token`
- **Solution:** Generate new token by logging in again.

**Error:** `No token provided`
- **Solution:** Include Authorization header with Bearer token.

### CORS Issues

**Error:** `Access to XMLHttpRequest blocked by CORS policy`
- **Solution:** CORS is already enabled. Check frontend CORS config.

---

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` to git
   - Use strong, unique `JWT_SECRET`

2. **Password Security:**
   - Passwords are hashed with bcryptjs (salt rounds: 10)
   - Never store plain text passwords

3. **API Security:**
   - All sensitive operations require authentication
   - Admin operations require admin role
   - Implement rate limiting in production

4. **Database:**
   - Use MongoDB Atlas for production
   - Enable IP whitelist
   - Use strong database passwords

---

## Performance Optimization

1. **Indexing:**
   - Database indexes on frequently searched fields
   - User email is unique indexed

2. **Pagination:**
   - Default: 10 items per page
   - Configurable via query parameters

3. **Caching (Future):**
   - Implement Redis caching
   - Cache product listings

4. **Query Optimization:**
   - Populate related data efficiently
   - Use projection to limit returned fields

---

## Deployment

### Deploy to Heroku

1. **Create Heroku account and install CLI**

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   heroku create app-name
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

### Deploy to Railway/Render

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

---

## Future Enhancements

1. **Email Notifications:**
   - Order confirmation emails
   - Password reset functionality

2. **Payment Integration:**
   - Stripe/Razorpay integration
   - Payment gateway status updates

3. **Advanced Features:**
   - Wishlist
   - Product recommendations
   - Coupon/discount codes
   - Inventory management

4. **Performance:**
   - Redis caching
   - API rate limiting
   - Database query optimization

5. **Testing:**
   - Unit tests with Jest
   - Integration tests
   - API testing

---

## License

ISC License

---

## Support

For issues or questions, create an issue in the repository or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** February 2026
