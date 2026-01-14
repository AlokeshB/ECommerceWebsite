import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    mobile: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API Call
    if (credentials.mobile && credentials.password) {
      // For now, we simulate getting a name back from the server
      // In a real app, this comes from the database
      const simulatedUser = { 
        name: "ABCD User", 
        id: credentials.mobile 
      };
      //For frontend, it will be stored in localStorage
      
      // Passing the user data back up to the Navbar
      if (onLogin) onLogin(simulatedUser);
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate__animated animate__fadeIn">
      <div className="mb-3">
        <label className="form-label text-muted small fw-bold">Mobile Number (UserID)</label>
        <input 
          type="tel" 
          className="form-control form-control-lg bg-light border-0" 
          name="mobile"
          placeholder="Enter your mobile number"
          value={credentials.mobile}
          onChange={handleChange}
          required 
        />
      </div>

      <div className="mb-3">
        <label className="form-label text-muted small fw-bold">Password</label>
        <input 
          type="password" 
          className="form-control form-control-lg bg-light border-0" 
          name="password"
          placeholder="••••••••"
          value={credentials.password}
          onChange={handleChange}
          required 
        />
      </div>

      <div className="d-flex justify-content-end mb-4">
        <button 
          type="button" 
          className="btn btn-link text-decoration-none text-muted p-0 small"
          onClick={() => alert("Reset password link sent to email/mobile!")}
        >
          Forgot Password?
        </button>
      </div>

      <button type="submit" className="btn btn-primary w-100 py-3 fw-bold shadow-sm">
        Login Securely
      </button>
    </form>
  );
};

export default Login;