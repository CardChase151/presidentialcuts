import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import './Services.css';

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('price', { ascending: false });

    if (!error && data) {
      setServices(data);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">SERVICES & PRICING</h2>
        <div className="price-list">
          {services.map((service) => (
            <div key={service.id} className={`price-item ${service.day_restriction ? 'special' : ''}`}>
              <div className="service-info">
                <span className="service-name">
                  {service.name}
                  {service.day_restriction && (
                    <small> ({service.day_restriction} Only)</small>
                  )}
                </span>
                <span className="service-duration">{service.duration_minutes} min</span>
              </div>
              <span className="service-price">{formatPrice(service.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
