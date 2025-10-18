import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { supabase } from '../../services/supabase';
import { AuthContext } from '../../context/AuthContext';
import './ClientDashboard.css';

function BarberDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.is_barber) {
      navigate('/');
      return;
    }
    fetchBarberData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchBarberData = async () => {
    try {
      // Get barber record
      const { data: barberData, error: barberError } = await supabase
        .from('barbers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (barberError) throw barberError;

      // Get appointments for this barber
      const { data: appointmentsData, error: apptError } = await supabase
        .from('appointments')
        .select(`
          *,
          services!appointments_service_id_fkey (name, price, duration_minutes)
        `)
        .eq('barber_id', barberData.id)
        .eq('status', 'confirmed')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (apptError) throw apptError;
      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error('Error fetching barber data:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Barber Dashboard</h1>
          <p>Welcome, {user.name}</p>
        </div>

        <section className="appointments-section">
          <h2>Your Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <div className="no-appointments">
              <p>No upcoming appointments</p>
            </div>
          ) : (
            <div className="appointments-grid">
              {appointments.map(apt => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-header">
                    <h3>{apt.services?.name}</h3>
                    <span className="status-badge confirmed">Confirmed</span>
                  </div>
                  <div className="appointment-details">
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
                      <i className="fas fa-hourglass-half"></i>
                      <span>{apt.services?.duration_minutes} minutes</span>
                    </div>
                    <div className="detail">
                      <i className="fas fa-envelope"></i>
                      <span>{apt.client_email}</span>
                    </div>
                    {apt.client_phone && (
                      <div className="detail">
                        <i className="fas fa-phone"></i>
                        <span>{apt.client_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="info-message">
          <i className="fas fa-info-circle"></i>
          <p>To manage your schedule, services, and profile, please contact the owner or use the advanced settings.</p>
        </div>
      </div>
    </div>
  );
}

export default BarberDashboard;
