import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Layout Components
// import Navbar from './components/layout/Navbar';
// import Footer from './components/layout/Footer';

// // Page Components
// import Home from './pages/Home';
// import ProductListing from './pages/ProductListing'; // Corresponds to [cite: 146]
// import ProductDetails from './pages/ProductDetails'; // Corresponds to 
// import Cart from './pages/Cart';                     // Corresponds to [cite: 147]
// import Checkout from './pages/Checkout';             // Corresponds to 
// import OrderConfirmation from './pages/OrderConfirmation'; // Corresponds to [cite: 148]
// import Login from './pages/Login';                   // Corresponds to [cite: 85]
// import Register from './pages/Register';             // Corresponds to [cite: 85]
// import UserProfile from './pages/UserProfile';       // Corresponds to [cite: 149]
// import AdminDashboard from './pages/AdminDashboard'; // Corresponds to Admin Dashboard [cite: 15]
//import ProtectedRoute from './assets/routes/ProctoredRoute';

// function App() {
//   return (
//     <Router>
//       <div className="app-container">
//         {/* Navigation Bar visible on all pages */}
//         <Navbar />

//         <main className="main-content">
//           <Routes>
//             {/* --- Public Routes --- */}
//             <Route path="/" element={<Home />} />
            
//             {/* Product Management Module [cite: 7] */}
//             <Route path="/products" element={<ProductListing />} />
//             <Route path="/product/:id" element={<ProductDetails />} />

//             {/* Shopping Cart Module [cite: 9] */}
//             <Route path="/cart" element={<Cart />} />

//             {/* User Authentication Module [cite: 13] */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* --- Protected User Routes --- */}
//             {/* Order Management Module [cite: 11] */}
//             <Route 
//               path="/checkout" 
//               element={
//                 <ProtectedRoute>
//                   <Checkout />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/order-confirmation/:orderId" 
//               element={
//                 <ProtectedRoute>
//                   <OrderConfirmation />
//                 </ProtectedRoute>
//               } 
//             />
            
//             {/* User Profile Management [cite: 149] */}
//             <Route 
//               path="/profile" 
//               element={
//                 <ProtectedRoute>
//                   <UserProfile />
//                 </ProtectedRoute>
//               } 
//             />

//             {/* --- Protected Admin Routes --- */}
//             {/* Admin Dashboard Module [cite: 15] */}
//             <Route 
//               path="/admin" 
//               element={
//                 <ProtectedRoute role="admin">
//                   <AdminDashboard />
//                 </ProtectedRoute>
//               } 
//             />

//             {/* 404 Fallback */}
//             <Route path="*" element={<div>Page Not Found</div>} />
//           </Routes>
//         </main>

//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;
