import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported here or in main.jsx
import Home from './pages/Home';
import Cart from './pages/Cart';
// import Checkout from './assets/pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/tracking/:orderId" element={<OrderTracking />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}
 
export default App;