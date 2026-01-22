import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light border-top text-dark pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-md-4">
            <h5 className="fw-bold text-dark mb-3">FASHION-HUB</h5>
            <p className="text-muted small">
              Your one-stop destination for premium products. We ensure quality,
              fast delivery, and the best customer experience.
            </p>
            <div className="d-flex gap-3 mt-3">
              <button className="btn btn-outline-dark btn-sm rounded-circle p-2"><Facebook size={18} /></button>
              <button className="btn btn-outline-dark btn-sm rounded-circle p-2"><Twitter size={18} /></button>
              <button className="btn btn-outline-dark btn-sm rounded-circle p-2"><Instagram size={18} /></button>
            </div>
          </div>
 
          {/* Quick Links */}
          <div className="col-md-2 col-6">
            <h6 className="fw-bold text-dark mb-3">Quick Links</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/about" className="text-decoration-none text-muted">About Us</Link></li>
              <li><Link to="/profile" className="text-decoration-none text-muted">Order Status</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h6 className="fw-bold text-dark mb-3">Contact Us</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-3">
              <li className="d-flex align-items-start gap-2">
                <MapPin size={18} className="text-dark flex-shrink-0 mt-1" />
                <span className="text-muted">CCC campus, Cognizant Technology Solutions, CHIL SEZ IT Park, Keeranatham, Sarvanampatty, Coimbatore-641035</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-dark flex-shrink-0" />
                <span className="text-muted">+91 86973 29250</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-dark flex-shrink-0" />
                <span className="text-muted">support@fashionhub.com</span>
              </li>
            </ul>
          </div>
          <div className="col-md-2 col-6">
            <h6 className="fw-bold text-dark mb-3">Contributors</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li className="text-decoration-none text-muted">AHAN SARKAR</li>
              <li className="text-decoration-none text-muted">AMINUR RAHMAN</li>
              <li className="text-decoration-none text-muted">PURBADRI GHOSH</li>
              <li className="text-decoration-none text-muted">ALOKESH BHATTACHARYA</li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <div className="text-center text-muted small">
          &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;