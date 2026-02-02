import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light border-top text-dark pt-4 pt-md-5 pb-3 pb-md-4 mt-auto">
      <div className="container">
        <div className="row g-3 g-md-4">
          {/* Brand Info */}
          <div className="col-12 col-md-4 col-lg-3">
            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "16px" }}>FASHION-HUB</h5>
            <p className="text-muted small mb-3">
              Your one-stop destination for premium products. We ensure quality,
              fast delivery, and the best customer experience.
            </p>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-dark btn-sm rounded-circle p-2"><Facebook size={16} /></button>
              <button className="btn btn-outline-dark btn-sm rounded-circle p-2"><Twitter size={16} /></button>
              <button className="btn btn-outline-dark btn-sm rounded-circle p-2"><Instagram size={16} /></button>
            </div>
          </div>
 
          {/* Quick Links */}
          <div className="col-6 col-md-2 col-lg-2">
            <h6 className="fw-bold text-dark mb-3" style={{ fontSize: "14px" }}>Quick Links</h6>
            <ul className="list-unstyled text-muted d-flex flex-column gap-2">
              <li className="small"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="small"><Link to="/about" className="text-decoration-none text-muted">About Us</Link></li>
              <li className="small"><Link to="/profile" className="text-decoration-none text-muted">Order Status</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-md-4 col-lg-4">
            <h6 className="fw-bold text-dark mb-3" style={{ fontSize: "14px" }}>Contact Us</h6>
            <ul className="list-unstyled text-muted d-flex flex-column gap-2">
              <li className="d-flex align-items-start gap-2">
                <MapPin size={16} className="text-dark flex-shrink-0 mt-1" />
                <span className="text-muted small">CCC campus, Cognizant Technology Solutions, CHIL SEZ IT Park, Keeranatham, Sarvanampatty, Coimbatore-641035</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={14} className="text-dark flex-shrink-0" />
                <span className="text-muted small">+91 86973 29250</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={14} className="text-dark flex-shrink-0" />
                <span className="text-muted small">support@fashionhub.com</span>
              </li>
            </ul>
          </div>
          
          {/* Contributors */}
          <div className="col-6 col-md-2 col-lg-3">
            <h6 className="fw-bold text-dark mb-3" style={{ fontSize: "14px" }}>Contributors</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li>Ahan Sarkar</li>
              <li>Aminur Rahman</li>
              <li>Purbadri Ghosh</li>
              <li>Alokesh Bhattacharya</li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary my-3 my-md-4" />
        <div className="text-center text-muted small">
          &copy; 2026 Fashion-Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;