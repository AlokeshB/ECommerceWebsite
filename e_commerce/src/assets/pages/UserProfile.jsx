import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { Package, User, MapPin, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    navigate('/'); 
    return null;
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-5">
        <div className="row g-4">
          
          {/* SIDEBAR */}
          <div className="col-lg-3">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-bottom text-center">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fs-2 fw-bold" style={{width: '80px', height: '80px'}}>
                  {user.firstName}
                </div>
                <h5 className="fw-bold mb-0">{user.firstName}</h5>
                <p className="text-muted small">{user.email}</p>
              </div>
              <div className="list-group list-group-flush">
                <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'orders' ? 'bg-light fw-bold text-primary' : ''}`} onClick={() => setActiveTab('orders')}>
                  <Package size={18} className="me-2"/> My Orders
                </button>
                <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'profile' ? 'bg-light fw-bold text-primary' : ''}`} onClick={() => setActiveTab('profile')}>
                  <User size={18} className="me-2"/> Profile Information
                </button>
                <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'address' ? 'bg-light fw-bold text-primary' : ''}`} onClick={() => setActiveTab('address')}>
                  <MapPin size={18} className="me-2"/> Manage Addresses
                </button>
                <button className="list-group-item list-group-item-action border-0 py-3 text-danger" onClick={() => { logout(); navigate('/'); }}>
                  <LogOut size={18} className="me-2"/> Logout
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="col-lg-9">
            <div className="bg-white rounded shadow-sm p-4 h-100">
              
              {activeTab === 'orders' && (
                <div>
                  <h5 className="fw-bold mb-4">Order History</h5>
                  <div className="text-center py-5 text-muted">
                    <Package size={40} className="mb-2 opacity-50"/>
                    <p>No orders placed yet.</p>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h5 className="fw-bold mb-4">Personal Information</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small text-muted">User ID</label>
                      <input type="text" className="form-control" value={user.id} disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted">Mobile Number</label>
                      <input type="text" className="form-control" value={user.mobile} disabled />
                    </div>
                    <div className="col-md-12">
                      <label className="small text-muted">Email ID</label>
                      <input type="text" className="form-control" value={user.email} disabled />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;