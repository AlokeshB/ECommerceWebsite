# E-Commerce Backend Integration - Testing Guide

## 🚀 Quick Start Testing

### Prerequisites
1. Backend server running on `http://localhost:5000`
2. MongoDB connected
3. Frontend running on `http://localhost:5173` (or your Vite dev server port)

### Test Scenario 1: User Registration → Automatic Home Login

**Steps:**
1. Click "Register" from Home page
2. Fill in form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Address: 123 Main St
   - City: Mumbai
   - State: Maharashtra
   - Zip: 400001
   - Country: India
   - Password: Test@123
   - Confirm Password: Test@123
3. Click "Register"

**Expected Result:**
   - ✅ User created in MongoDB database
   - ✅ Auto-redirect to Home page
   - ✅ Navbar shows user as "logged in"
   - ✅ Token stored in sessionStorage (check DevTools → Application → Session Storage)

---

### Test Scenario 2: User Profile Management

**Steps:**
1. Register/Login as user (as above)
2. Click on Navbar → Profile icon
3. Go to "Addresses" tab
4. Click "Add New" address
5. Add address:
   - Street: 456 Oak Lane
   - City: Delhi
   - State: Delhi
   - Zip: 110001
6. Click "Save Address"

**Expected Result:**
   - ✅ Address appears in list immediately
   - ✅ Address persisted in MongoDB (user.addresses array)
   - ✅ Refresh page → Address still there (proving backend persistence)

---

### Test Scenario 3: Payment Card Management

**Steps:**
1. Go to Profile → Payment Cards tab
2. Click "Add Card"
3. Fill in:
   - Card Number: 4111 1111 1111 1111
   - Cardholder: John Doe
   - Expiry Month: 12
   - Expiry Year: 25
   - CVV: 123
4. Click "Add Card"

**Expected Result:**
   - ✅ Card appears in list (showing last 4 digits: 1111)
   - ✅ Card stored in PaymentCard collection in MongoDB
   - ✅ Refresh page → Card still visible (proving database persistence)

---

### Test Scenario 4: Product Purchase Flow

**Steps:**
1. Go to Home page
2. Click on any product
3. Click "Add to Cart"
4. Go to Cart page
5. Click "Checkout"
6. Review order
7. Select Payment Method
8. Click "Place Order"

**Expected Result:**
   - ✅ Order created in MongoDB
   - ✅ Cart cleared from database
   - ✅ Success modal appears
   - ✅ Redirected to Order Tracking page
   - ✅ Order visible in Profile → My Orders

---

### Test Scenario 5: Session & Token Verification

**Steps:**
1. Login/Register user
2. Open DevTools → Application → Session Storage
3. Verify `authToken` and `userData` present
4. Refresh the page
5. Check Network tab → Should see call to `/api/auth/profile`

**Expected Result:**
   - ✅ Token remains valid after refresh
   - ✅ Backend verifies token and returns updated user data
   - ✅ User remains logged in across page refreshes
   - ✅ Close browser tab → Next session requires new login (sessionStorage cleared)

---

### Test Scenario 6: Logout & Fresh Login

**Steps:**
1. Login as user
2. Click Navbar → Profile → Logout
3. Check SessionStorage (should be empty)
4. Try accessing `/profile` page → Should redirect to Login
5. Login with same credentials

**Expected Result:**
   - ✅ SessionStorage cleared after logout
   - ✅ Protected routes redirect to login
   - ✅ Can login again successfully
   - ✅ New token issues for new session

---

## 🔍 Database Verification

### Check User with Addresses (MongoDB)
```javascript
// In MongoDB terminal
db.users.findOne({ email: "john@example.com" })

// Should show:
{
  _id: ObjectId(...),
  name: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
  addresses: [
    {
      street: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India",
      isDefault: true,
      _id: ObjectId(...)
    },
    // ... more addresses
  ],
  role: "user",
  createdAt: ISODate("..."),
  updatedAt: ISODate("..."),
  __v: 0
}
```

### Check Payment Cards (MongoDB)
```javascript
// In MongoDB terminal
db.paymentcards.find({ userId: ObjectId("...") })

// Should show:
{
  _id: ObjectId(...),
  userId: ObjectId("..."),
  cardNumber: "4111111111111111",
  cardHolder: "John Doe",
  expiryMonth: "12",
  expiryYear: "25",
  cvv: "123",
  isDefault: false,
  isActive: true,
  createdAt: ISODate("..."),
  updatedAt: ISODate("..."),
  __v: 0
}
```

### Check Orders (MongoDB)
```javascript
// In MongoDB terminal
db.orders.find({ userId: ObjectId("...") })

// Should show order with all details
```

---

## 🚨 Common Issues & Solutions

### Issue: "User not logged in after registration"
**Solution:** 
- Check AuthContext register() method
- Verify token is being set in sessionStorage
- Check browser console for errors

### Issue: "Addresses not saving"
**Solution:**
- Verify backend address endpoint: `/api/auth/addresses`
- Check MongoDB user document for addresses array
- Check Network tab for failed requests

### Issue: "Cards not showing"
**Solution:**
- Check PaymentCard collection exists in MongoDB
- Verify endpoint: `/api/payment-cards`
- Check user authorization in controller

### Issue: "Orders not visible in profile"
**Solution:**
- Verify order was created in MongoDB
- Check `/api/orders/my-orders` endpoint returns data
- Verify userId matches in database

---

## 📊 Data Persistence Verification

### Before (Old System - ❌ Problematic)
- User registers → Data saved to localStorage
- Refresh page → Data still from localStorage
- Close browser → Data persists forever (security risk!)
- Database: NOT updated

### After (New System - ✅ Correct)
- User registers → Data saved to MongoDB
- SessionStorage used only for temp auth token
- Refresh page → Data fetched from MongoDB
- Close browser → SessionStorage cleared (logout)
- Database: Single source of truth

---

## ✅ What to Verify After Deployment

1. [ ] New users can register and are logged in automatically
2. [ ] User addresses save to MongoDB
3. [ ] Payment cards save to MongoDB  
4. [ ] Orders are created in MongoDB
5. [ ] All product data comes from /api/products
6. [ ] Cart operations call backend APIs
7. [ ] Notifications are fetched from backend
8. [ ] SessionStorage clears on logout
9. [ ] Token verification works on refresh
10. [ ] Multi-device login works (different browsers/devices)

---

## 🎯 Key Improvements

| Feature | Before | After |
|---------|--------|-------|
| User Registration | Optional localStorage | ✅ MongoDB required |
| Login Redirect | Manual redirect needed | ✅ Auto-redirect to Home |
| Data Persistence | localStorage + Manual | ✅ Automatic via DB |
| Session Management | Forever (security risk) | ✅ SessionStorage (cleared on close) |
| Multi-Device | ❌ Not supported | ✅ Full support |
| Data Sync | ❌ Manual/Complex | ✅ Automatic |
| Addresses | localStorage array | ✅ MongoDB sub-document |
| Payment Cards | localStorage array | ✅ Separate collection |
| Source of Truth | localStorage (unreliable) | ✅ MongoDB (reliable) |

---

**Last Updated**: February 23, 2026
**Status**: ✅ All localStorage Removed - Backend-Only System
