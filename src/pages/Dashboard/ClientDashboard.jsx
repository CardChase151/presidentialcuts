import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parse, isPast } from 'date-fns';
import { supabase } from '../../services/supabase';
import { AuthContext } from '../../context/AuthContext';
import './ClientDashboard.css';

function ClientDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          barbers!appointments_barber_id_fkey (
            id,
            users!barbers_user_id_fkey (name)
          ),
          services!appointments_service_id_fkey (name, price, duration_minutes)
        `)
        .eq('client_id', user.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      alert('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const upcomingAppointments = appointments.filter(apt => {
    const aptDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
    return !isPast(aptDateTime) && apt.status === 'confirmed';
  });

  const pastAppointments = appointments.filter(apt => {
    const aptDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
    return isPast(aptDateTime) || apt.status !== 'confirmed';
  });

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
          <h1>Welcome, {user.name}</h1>
          <button onClick={() => navigate('/book')} className="book-button">
            <i className="fas fa-plus"></i> Book Appointment
          </button>
        </div>

        <section className="appointments-section">
          <h2>Upcoming Appointments</h2>
          {upcomingAppointments.length === 0 ? (
            <div className="no-appointments">
              <p>No upcoming appointments</p>
              <button onClick={() => navigate('/book')} className="book-now-link">
                Book your first appointment
              </button>
            </div>
          ) : (
            <div className="appointments-grid">
              {upcomingAppointments.map(apt => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-header">
                    <h3>{apt.services?.name}</h3>
                    <span className="status-badge confirmed">Confirmed</span>
                  </div>
                  <div className="appointment-details">
                    <div className="detail">
                      <i className="fas fa-user"></i>
                      <span>Barber: {apt.barbers?.users?.name}</span>
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
                      <i className="fas fa-dollar-sign"></i>
                      <span>${apt.services?.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="cancel-button"
                  >
                    Cancel Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {pastAppointments.length > 0 && (
          <section className="appointments-section">
            <h2>Past Appointments</h2>
            <div className="appointments-grid">
              {pastAppointments.map(apt => (
                <div key={apt.id} className={`appointment-card past ${apt.status}`}>
                  <div className="appointment-header">
                    <h3>{apt.services?.name}</h3>
                    <span className={`status-badge ${apt.status}`}>{apt.status}</span>
                  </div>
                  <div className="appointment-details">
                    <div className="detail">
                      <i className="fas fa-user"></i>
                      <span>Barber: {apt.barbers?.users?.name}</span>
                    </div>
                    <div className="detail">
                      <i className="fas fa-calendar"></i>
                      <span>{format(new Date(apt.appointment_date), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="detail">
                      <i className="fas fa-clock"></i>
                      <span>{format(parse(apt.appointment_time, 'HH:mm:ss', new Date()), 'h:mm a')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
