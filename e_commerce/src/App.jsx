import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported here or in main.jsx
import Home from './assets/pages/Home';
import Cart from './assets/pages/Cart';
import Checkout from './assets/pages/Checkout';
import OrderTracking from './assets/pages/OrderTracking';
// import Checkout from './assets/pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/tracking/:orderId" element={<OrderTracking />} />
        {/* <Route path="/checkout" element={<Checkout />} /> */}
      </Routes>
    </Router>
  );
}

export default App;