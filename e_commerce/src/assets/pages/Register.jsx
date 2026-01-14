import React, { useState } from 'react';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    zip: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Success Action
    alert(`Registration Successful!\nYour UserID is: ${formData.mobile}`);
    console.log("formData:", formData);
    // Optional: Switch back to Login view or auto-login
    if (onRegisterSuccess) onRegisterSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="animate__animated animate__fadeIn">
      <div className="row g-3">
        {/* Full Name */}
        <div className="col-12">
          <label className="form-label text-muted small fw-bold">Full Name</label>
          <input type="text" className="form-control bg-light border-0" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        {/* Mobile & Email */}
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold">Mobile (UserID)</label>
          <input type="tel" className="form-control bg-light border-0" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold">Email Address</label>
          <input type="email" className="form-control bg-light border-0" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        {/* Address Section */}
        <div className="col-12">
          <label className="form-label text-muted small fw-bold">Shipping Address</label>
          <textarea className="form-control bg-light border-0" name="address" rows="2" value={formData.address} onChange={handleChange} required></textarea>
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold">City</label>
          <input type="text" className="form-control bg-light border-0" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold">Zip Code</label>
          <input type="text" className="form-control bg-light border-0" name="zip" value={formData.zip} onChange={handleChange} required />
        </div>

        {/* Password Section */}
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold">Password</label>
          <input type="password" className="form-control bg-light border-0" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label text-muted small fw-bold">Confirm Password</label>
          <input type="password" className="form-control bg-light border-0" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
      </div>

      <div className="mt-4">
        <button type="submit" className="btn btn-success w-100 py-3 fw-bold shadow-sm">
          Create Account
        </button>
      </div>
    </form>
  );
};

export default Register;