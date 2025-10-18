import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { supabase } from '../../services/supabase';
import { BookingContext } from '../../context/BookingContext';
import { AuthContext } from '../../context/AuthContext';
import './Confirmation.css';

function Confirmation() {
  const { selectedBarber, selectedDate, selectedTime, selectedService, resetBooking } = useContext(BookingContext);
  const { user } = useContext(AuthContext);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!selectedBarber || !selectedDate || !selectedTime || !selectedService) {
    navigate('/book');
    return null;
  }

  const handleGuestChange = (e) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    if (user) {
      // User is logged in
      await createAppointment({
        client_id: user.id,
        client_name: user.name,
        client_email: user.email,
        client_phone: user.phone
      });
    } else {
      // Guest checkout
      if (!guestInfo.name || !guestInfo.email) {
        setError('Please provide your name and email');
        return;
      }

      await createAppointment({
        client_id: null,
        client_name: guestInfo.name,
        client_email: guestInfo.email,
        client_phone: guestInfo.phone
      });
    }
  };

  const createAppointment = async (clientData) => {
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          barber_id: selectedBarber.id,
          service_id: selectedService.id,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: selectedTime,
          status: 'confirmed',
          ...clientData
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Success - reset booking and redirect
      resetBooking();

      if (user) {
        navigate('/dashboard/client');
      } else {
        // Show success message for guest
        alert(`Appointment confirmed!\n\nBarber: ${selectedBarber.users?.name}\nDate: ${format(selectedDate, 'MMMM d, yyyy')}\nTime: ${format(parse(selectedTime, 'HH:mm:ss', new Date()), 'h:mm a')}\nService: ${selectedService.name}\n\nA confirmation email has been sent to ${clientData.client_email}`);
        navigate('/');
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('Failed to create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formattedTime = format(parse(selectedTime, 'HH:mm:ss', new Date()), 'h:mm a');

  return (
    <div className="booking-page">
      <div className="container">
        <div className="progress-indicator">Step 5 of 5</div>
        <h1 className="page-title">Confirm Your Appointment</h1>

        <div className="confirmation-content">
          <div className="booking-summary">
            <h2>Appointment Details</h2>
            <div className="detail-item">
              <span className="label">Barber:</span>
              <span className="value">{selectedBarber.users?.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Service:</span>
              <span className="value">{selectedService.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Date:</span>
              <span className="value">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="detail-item">
              <span className="label">Time:</span>
              <span className="value">{formattedTime}</span>
            </div>
            <div className="detail-item">
              <span className="label">Duration:</span>
              <span className="value">{selectedService.duration_minutes} minutes</span>
            </div>
            <div className="detail-item price">
              <span className="label">Price:</span>
              <span className="value">${selectedService.price}</span>
            </div>
          </div>

          {user ? (
            <div className="user-info">
              <h2>Your Information</h2>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
            </div>
          ) : (
            <div className="guest-checkout">
              <h2>Your Information</h2>
              <p className="login-option">
                Already have an account? <button onClick={() => navigate('/login')} className="link-button">Login</button>
              </p>

              <form className="guest-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={guestInfo.name}
                    onChange={handleGuestChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={guestInfo.email}
                    onChange={handleGuestChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={guestInfo.phone}
                    onChange={handleGuestChange}
                  />
                </div>
              </form>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="confirmation-actions">
            <button onClick={() => navigate('/book/time')} className="back-button">
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="confirm-button"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
