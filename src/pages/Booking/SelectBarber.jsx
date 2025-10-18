import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { BookingContext } from '../../context/BookingContext';
import './SelectBarber.css';

function SelectBarber() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedBarber } = useContext(BookingContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select(`
          *,
          users!barbers_user_id_fkey (
            name
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      setBarbers(data || []);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBarber = (barber) => {
    setSelectedBarber(barber);
    navigate('/book/datetime');
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="loading">Loading barbers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Select Your Barber</h1>
        <p className="page-subtitle">Choose from our team of skilled professionals</p>

        {barbers.length === 0 ? (
          <div className="no-barbers">
            <p>No barbers available at this time. Please check back later.</p>
          </div>
        ) : (
          <div className="barbers-grid">
            {barbers.map((barber) => (
              <div key={barber.id} className="barber-card">
                {barber.photo_url && (
                  <img
                    src={barber.photo_url}
                    alt={barber.users?.name || 'Barber'}
                    className="barber-photo"
                  />
                )}
                <div className="barber-info">
                  <h3>{barber.users?.name || 'Professional Barber'}</h3>
                  {barber.bio && <p className="barber-bio">{barber.bio}</p>}
                  <button
                    onClick={() => handleSelectBarber(barber)}
                    className="select-button"
                  >
                    Select {barber.users?.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectBarber;
