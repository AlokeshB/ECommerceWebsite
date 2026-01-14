import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Check, Package, Truck, Home as HomeIcon, MapPin } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  
  const steps = [
    { title: 'Order Placed', desc: 'Jan 13, 2026', status: 'completed', icon: Check },
    { title: 'Packed', desc: 'Jan 14, 2026', status: 'pending', icon: Package },
    { title: 'Shipped', desc: 'Expected Jan 15', status: 'pending', icon: Truck },
    { title: 'Delivered', desc: 'Expected Jan 17', status: 'pending', icon: HomeIcon },
  ];

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-0">Order {orderId}</h4>
                  <p className="text-muted small">Placed on Tuesday, 13 Jan 2026</p>
                </div>
                <Link to="/" className="btn btn-outline-primary btn-sm">Manage Order</Link>
              </div>

              {/* TRACKING PROGRESS LINE */}
              <div className="position-relative py-4 mb-5">
                <div className="progress" style={{height: '4px'}}>
                  <div className="progress-bar" style={{width: '25%'}}></div>
                </div>
                
                <div className="d-flex justify-content-between position-absolute top-50 start-0 w-100 translate-middle-y">
                  {steps.map((step, index) => (
                    <div key={index} className="text-center" style={{width: '25%'}}>
                      <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm 
                        ${step.status === 'completed' ? 'bg-primary text-white' : 'bg-white text-muted border'}`} 
                        style={{width: '40px', height: '40px'}}>
                        <step.icon size={20} />
                      </div>
                      <h6 className="small fw-bold mb-0">{step.title}</h6>
                      <span className="x-small text-muted">{step.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-light rounded d-flex align-items-center gap-3">
                <MapPin className="text-primary" />
                <div>
                  <h6 className="small fw-bold mb-0">Delivery Address</h6>
                  <p className="x-small text-muted mb-0">123, Market Street, Chennai, TN - 600001</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/" className="btn btn-primary px-5 py-2">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;