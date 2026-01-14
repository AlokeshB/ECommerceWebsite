import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-info-subtle bg-gradient text-light pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4">
          
          {/* Column 1: Brand Info */}
          <div className="col-md-4">
            <h5 className="fw-bold text-primary mb-3">FASHIONIFY</h5>
            <p className="text-primary small">
              Your one-stop destination for premium products. We ensure quality, 
              fast delivery, and the best customer experience.
            </p>
            <div className="d-flex gap-3 mt-3">
              <button className="btn btn-outline-primary btn-sm rounded-circle p-2"><Facebook size={18} /></button>
              <button className="btn btn-outline-primary btn-sm rounded-circle p-2"><Twitter size={18} /></button>
              <button className="btn btn-outline-primary btn-sm rounded-circle p-2"><Instagram size={18} /></button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-md-2 col-6">
            <h6 className="fw-bold text-primary mb-3">Quick Links</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li><a href="#" className="text-decoration-none hover-white">Home</a></li>
              <li><a href="#" className="text-decoration-none hover-white">Shop</a></li>
              <li><a href="#" className="text-decoration-none hover-white">About Us</a></li>
              <li><a href="#" className="text-decoration-none hover-white">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="col-md-2 col-6">
            <h6 className="fw-bold text-primary mb-3">Support</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li><a href="#" className="text-decoration-none hover-white">FAQ</a></li>
              <li><a href="#" className="text-decoration-none hover-white">Shipping</a></li>
              <li><a href="#" className="text-decoration-none hover-white">Returns</a></li>
              <li><a href="#" className="text-decoration-none hover-white">Order Status</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="col-md-4">
            <h6 className="fw-bold text-primary mb-3">Contact Us</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-3">
              <li className="d-flex align-items-center gap-2">
                <MapPin size={36} className="text-primary" />
                <span className="text-primary">CCC campus, Cognizant Technology Solutions, CHIL SEZ IT Park, Keeranatham, Sarvanampatty, Coimbatore-641035</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span className="text-primary">+91 98765 43210</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span className="text-primary">support@eshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-primary my-4" />
        
        <div className="text-center text-primary small">
          &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;