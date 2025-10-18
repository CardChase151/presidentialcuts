import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { BookingContext } from '../../context/BookingContext';
import './SelectService.css';

function SelectService() {
  const { selectedBarber, selectedService, setSelectedService } = useContext(BookingContext);
  const [services, setServices] = useState([]);
  const [barberServices, setBarberServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedBarber) {
      navigate('/book');
      return;
    }
    fetchServices();
    fetchBarberServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBarber, navigate]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarberServices = async () => {
    try {
      const { data, error } = await supabase
        .from('barber_services')
        .select('service_id')
        .eq('barber_id', selectedBarber.id);

      if (error) throw error;
      setBarberServices(data?.map(bs => bs.service_id) || []);
    } catch (error) {
      console.error('Error fetching barber services:', error);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleContinue = () => {
    if (selectedService) {
      navigate('/book/date');
    }
  };

  const filteredServices = services.filter(service =>
    barberServices.length === 0 || barberServices.includes(service.id)
  );

  if (loading) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="loading">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <div className="progress-indicator">Step 2 of 5</div>
        <h1 className="page-title">Select Service</h1>
        <p className="page-subtitle">Booking with {selectedBarber.users?.name}</p>

        <div className="services-section centered">
          <div className="services-list">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className={`service-item ${selectedService?.id === service.id ? 'selected' : ''}`}
                onClick={() => handleServiceClick(service)}
              >
                <div>
                  <div className="service-name">{service.name}</div>
                  <div className="service-duration">{service.duration_minutes} minutes</div>
                  {service.day_restriction && (
                    <div className="service-restriction">{service.day_restriction} only</div>
                  )}
                </div>
                <div className="service-price">${service.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="booking-actions">
          <button onClick={() => navigate('/book')} className="back-button">
            Back
          </button>
          <button
            onClick={handleContinue}
            className="continue-button"
            disabled={!selectedService}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectService;
