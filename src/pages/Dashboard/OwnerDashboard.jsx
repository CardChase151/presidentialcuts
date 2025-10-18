import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { supabase } from '../../services/supabase';
import { AuthContext } from '../../context/AuthContext';
import './ClientDashboard.css';

function OwnerDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.is_owner) {
      navigate('/');
      return;
    }
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    try {
      // Get all barbers
      const { data: barbersData, error: barbersError } = await supabase
        .from('barbers')
        .select(`
          *,
          users!barbers_user_id_fkey (name)
        `);

      if (barbersError) throw barbersError;
      setBarbers(barbersData || []);

      // Get all appointments
      const { data: appointmentsData, error: apptError } = await supabase
        .from('appointments')
        .select(`
          *,
          barbers!appointments_barber_id_fkey (
            users!barbers_user_id_fkey (name)
          ),
          services!appointments_service_id_fkey (name, price, duration_minutes)
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (apptError) throw apptError;
      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBarberActive = async (barberId, isActive) => {
    try {
      const { error } = await supabase
        .from('barbers')
        .update({ is_active: !isActive })
        .eq('id', barberId);

      if (error) throw error;
      fetchAllData();
    } catch (error) {
      console.error('Error toggling barber status:', error);
      alert('Failed to update barber status');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Owner Dashboard</h1>
          <p>Welcome, {user.name}</p>
        </div>

        {/* Barbers Management */}
        <section className="appointments-section">
          <h2>Manage Barbers</h2>
          <div className="appointments-grid">
            {barbers.map(barber => (
              <div key={barber.id} className="appointment-card">
                <div className="appointment-header">
                  <h3>{barber.users?.name}</h3>
                  <span className={`status-badge ${barber.is_active ? 'confirmed' : 'cancelled'}`}>
                    {barber.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {barber.bio && (
                  <div className="barber-bio">
                    <p>{barber.bio}</p>
                  </div>
                )}
                <button
                  onClick={() => toggleBarberActive(barber.id, barber.is_active)}
                  className={barber.is_active ? 'cancel-button' : 'book-now-link'}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {barber.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* All Appointments */}
        <section className="appointments-section">
          <h2>All Appointments ({confirmedAppointments.length})</h2>
          {confirmedAppointments.length === 0 ? (
            <div className="no-appointments">
              <p>No appointments scheduled</p>
            </div>
          ) : (
            <div className="appointments-grid">
              {confirmedAppointments.map(apt => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-header">
                    <h3>{apt.services?.name}</h3>
                    <span className="status-badge confirmed">Confirmed</span>
                  </div>
                  <div className="appointment-details">
                    <div className="detail">
                      <i className="fas fa-cut"></i>
                      <span>Barber: {apt.barbers?.users?.name}</span>
                    </div>
                    <div className="detail">
                      <i className="fas fa-user"></i>
                      <span>Client: {apt.client_name}</span>
                    </div>
                    <div className="detail">
                      <i className="fas fa-calendar"></i>
                      <span>{format(new Date(apt.appointment_date), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="detail">
                      <i className="fas fa-clock"></i>
                      <span>{format(parse(apt.appointment_time, 'HH:mm:ss', new Date()), 'h:mm a')}</span>
                    </div>
                    <div className="detail">
                      <i className="fas fa-dollar-sign"></i>
                      <span>${apt.services?.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="info-message">
          <i className="fas fa-info-circle"></i>
          <p>Advanced features like service management, barber onboarding, and schedule overrides will be added in future updates.</p>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
