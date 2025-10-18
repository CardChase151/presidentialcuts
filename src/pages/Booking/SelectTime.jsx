import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { supabase } from '../../services/supabase';
import { BookingContext } from '../../context/BookingContext';
import './SelectTime.css';

function SelectTime() {
  const { selectedBarber, selectedService, selectedDate, selectedTime, setSelectedTime } = useContext(BookingContext);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedBarber || !selectedService || !selectedDate) {
      navigate('/book');
      return;
    }
    fetchAvailableTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBarber, selectedService, selectedDate, navigate]);

  const fetchAvailableTimeSlots = async () => {
    setLoading(true);
    try {
      const dayOfWeek = selectedDate.getDay();
      const dateString = format(selectedDate, 'yyyy-MM-dd');

      // Check for schedule override first
      const { data: override } = await supabase
        .from('schedule_overrides')
        .select('*')
        .eq('barber_id', selectedBarber.id)
        .eq('date', dateString)
        .single();

      let startTime, endTime, isAvailable = true;

      if (override) {
        isAvailable = override.is_available;
        startTime = override.start_time;
        endTime = override.end_time;
      } else {
        // Get regular schedule
        const { data: schedule } = await supabase
          .from('barber_schedules')
          .select('*')
          .eq('barber_id', selectedBarber.id)
          .eq('day_of_week', dayOfWeek)
          .single();

        if (!schedule) {
          setAvailableTimeSlots([]);
          setLoading(false);
          return;
        }

        startTime = schedule.start_time;
        endTime = schedule.end_time;
      }

      if (!isAvailable) {
        setAvailableTimeSlots([]);
        setLoading(false);
        return;
      }

      // Get existing appointments for this barber on this date
      const { data: appointments } = await supabase
        .from('appointments')
        .select('appointment_time, service_id, services!appointments_service_id_fkey(duration_minutes)')
        .eq('barber_id', selectedBarber.id)
        .eq('appointment_date', dateString)
        .eq('status', 'confirmed');

      // Generate time slots
      const slots = generateTimeSlots(startTime, endTime, selectedService.duration_minutes, appointments || []);
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = (startTime, endTime, serviceDuration, existingAppointments) => {
    const slots = [];
    const start = parse(startTime, 'HH:mm:ss', new Date());
    const end = parse(endTime, 'HH:mm:ss', new Date());

    let currentTime = start;

    while (currentTime < end) {
      const timeString = format(currentTime, 'HH:mm:ss');
      // eslint-disable-next-line no-loop-func
      const isBooked = existingAppointments.some(apt => {
        const aptTime = parse(apt.appointment_time, 'HH:mm:ss', new Date());
        const aptDuration = apt.services?.duration_minutes || 30;
        const aptEnd = new Date(aptTime.getTime() + aptDuration * 60000);
        const slotEnd = new Date(currentTime.getTime() + serviceDuration * 60000);

        return (currentTime >= aptTime && currentTime < aptEnd) ||
               (slotEnd > aptTime && slotEnd <= aptEnd) ||
               (currentTime <= aptTime && slotEnd >= aptEnd);
      });

      if (!isBooked) {
        slots.push(timeString);
      }

      currentTime = new Date(currentTime.getTime() + 15 * 60000); // 15-minute intervals
    }

    return slots;
  };

  const handleContinue = () => {
    if (selectedTime) {
      navigate('/book/confirmation');
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="loading">Loading available times...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <div className="progress-indicator">Step 4 of 5</div>
        <h1 className="page-title">Select Time</h1>
        <p className="page-subtitle">
          {selectedBarber.users?.name} - {selectedService.name}<br />
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </p>

        <div className="time-section centered">
          {availableTimeSlots.length === 0 ? (
            <p className="helper-text">No available times for this date. Please select a different date.</p>
          ) : (
            <div className="time-slots">
              {availableTimeSlots.map(time => (
                <button
                  key={time}
                  className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {format(parse(time, 'HH:mm:ss', new Date()), 'h:mm a')}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="booking-actions">
          <button onClick={() => navigate('/book/date')} className="back-button">
            Back
          </button>
          <button
            onClick={handleContinue}
            className="continue-button"
            disabled={!selectedTime}
          >
            Review & Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectTime;
