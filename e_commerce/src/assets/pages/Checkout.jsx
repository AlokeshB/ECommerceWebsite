import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/layout/Navbar';
import { MapPin, CreditCard, ChevronRight, CheckCircle, Truck, ShieldCheck, Loader2 } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('default');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Mock User Auth Check (Simulating your existing Navbar user state)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    if (!user) {
      // Redirect or show login if no user is found
      alert("Please login to proceed with the checkout.");
      navigate('/'); 
    }
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate, orderPlaced]);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      // Simulate Order ID generation
      const orderId = "ORD" + Math.floor(Math.random() * 1000000);
      
      setTimeout(() => {
        clearCart(); // Empty cart after success
        navigate(`/tracking/${orderId}`);
      }, 3000);
    }, 2500);
  };

  if (orderPlaced) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-white">
        <div className="text-center animate__animated animate__zoomIn">
          <CheckCircle size={80} className="text-success mb-3" />
          <h2 className="fw-bold">Thank you, {user?.name}!</h2>
          <p className="text-muted fs-5">Your order has been placed successfully.</p>
          <div className="mt-4">
            <Loader2 className="spinner-border text-primary border-0" />
            <p className="small text-muted mt-2">Redirecting to order tracking...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-4">
        <div className="row g-4">
          {/* LEFT: Checkout Steps */}
          <div className="col-lg-8">
            {/* 1. Delivery Address */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-header bg-white py-3 d-flex align-items-center gap-2">
                <span className="badge bg-primary">1</span>
                <h6 className="mb-0 fw-bold">DELIVERY ADDRESS</h6>
              </div>
              <div className="card-body">
                <div className={`p-3 border rounded mb-2 ${selectedAddress === 'default' ? 'border-primary bg-light' : ''}`} onClick={() => setSelectedAddress('default')} style={{cursor:'pointer'}}>
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">{user?.name}</span>
                    <span className="badge bg-secondary">HOME</span>
                  </div>
                  <p className="small text-muted mb-0 mt-1">
                    123, Market Street, Apartment 4B, Chennai, TN - 600001
                  </p>
                </div>
                <button className="btn btn-link text-decoration-none small p-0 mt-2 fw-bold">+ Add a new address</button>
              </div>
            </div>

            {/* 2. Order Summary */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-header bg-white py-3 d-flex align-items-center gap-2">
                <span className="badge bg-primary">2</span>
                <h6 className="mb-0 fw-bold">ORDER SUMMARY ({cartItems.length} Items)</h6>
              </div>
              <div className="card-body p-0">
                {cartItems.map(item => (
                  <div key={item.id} className="d-flex gap-3 p-3 border-bottom align-items-center">
                    <div className="bg-light rounded p-2" style={{width: '60px', height: '60px', fontSize: '1.5rem', textAlign: 'center'}}>{item.img}</div>
                    <div className="flex-grow-1">
                      <h6 className="small fw-bold mb-0">{item.name}</h6>
                      <span className="text-muted x-small">Qty: {item.qty}</span>
                    </div>
                    <span className="fw-bold small">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Payment Options */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3 d-flex align-items-center gap-2">
                <span className="badge bg-primary">3</span>
                <h6 className="mb-0 fw-bold">PAYMENT OPTIONS</h6>
              </div>
              <div className="card-body">
                {['upi', 'card', 'cod'].map(method => (
                  <div key={method} className={`form-check p-3 border rounded mb-2 ${paymentMethod === method ? 'border-primary bg-light' : ''}`}>
                    <input 
                      className="form-check-input ms-0 me-3" 
                      type="radio" 
                      name="payment" 
                      id={method} 
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <label className="form-check-label fw-bold text-uppercase small" htmlFor={method}>
                      {method === 'upi' && 'PhonePe / Google Pay / UPI'}
                      {method === 'card' && 'Credit / Debit / ATM Card'}
                      {method === 'cod' && 'Cash on Delivery'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Price Details */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{top: '90px'}}>
              <div className="card-body">
                <h6 className="text-muted fw-bold small border-bottom pb-2">PRICE DETAILS</h6>
                <div className="d-flex justify-content-between my-3">
                  <span>Price ({cartItems.length} items)</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-success">
                  <span>Delivery Charges</span>
                  <span>FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <h5 className="fw-bold">Amount Payable</h5>
                  <h5 className="fw-bold text-primary">₹{getCartTotal()}</h5>
                </div>
                
                <button 
                  className="btn btn-primary w-100 py-3 fw-bold shadow-sm d-flex align-items-center text-white justify-content-center gap-2"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="spinner-border spinner-border-sm border-0" />
                      PROCESSING...
                    </>
                  ) : (
                    <>CONFIRM ORDER <ChevronRight size={18} /></>
                  )}
                </button>
                
                <div className="mt-3 p-2 bg-light rounded text-center">
                  <ShieldCheck size={16} className="text-success me-1" />
                  <span className="x-small text-muted">Safe and Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;