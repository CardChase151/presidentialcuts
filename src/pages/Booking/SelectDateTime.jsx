import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay, isEqual, parse } from 'date-fns';
import { supabase } from '../../services/supabase';
import { BookingContext } from '../../context/BookingContext';
import './SelectDateTime.css';

function SelectDateTime() {
  const { selectedBarber, selectedDate, setSelectedDate, selectedTime, setSelectedTime, selectedService, setSelectedService } = useContext(BookingContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [services, setServices] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [barberServices, setBarberServices] = useState([]);
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

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableTimeSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedService]);

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

  const fetchAvailableTimeSlots = async () => {
    if (!selectedDate || !selectedService) return;

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
          return;
        }

        startTime = schedule.start_time;
        endTime = schedule.end_time;
      }

      if (!isAvailable) {
        setAvailableTimeSlots([]);
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

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const handleDateClick = (date) => {
    if (isBefore(startOfDay(date), startOfDay(new Date()))) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleServiceClick = (service) => {
    // Check day restriction
    if (service.day_restriction) {
      const allowedDays = service.day_restriction.split(',').map(d => d.trim().toLowerCase());
      const selectedDayName = format(selectedDate || new Date(), 'EEEE').toLowerCase();

      if (!allowedDays.includes(selectedDayName)) {
        alert(`This service is only available on: ${service.day_restriction}`);
        return;
      }
    }

    setSelectedService(service);
    setSelectedTime(null);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime && selectedService) {
      navigate('/book/confirmation');
    }
  };

  const filteredServices = services.filter(service =>
    barberServices.length === 0 || barberServices.includes(service.id)
  );

  const days = getDaysInMonth();
  const today = startOfDay(new Date());

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Select Date, Time & Service</h1>
        <p className="page-subtitle">Booking with {selectedBarber.users?.name}</p>

        <div className="booking-grid">
          {/* Services Section */}
          <div className="services-section">
            <h2>Select Service</h2>
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

          {/* Calendar Section */}
          <div className="calendar-section">
            <div className="calendar-header">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <div className="calendar-grid">
              <div className="day-header">Sun</div>
              <div className="day-header">Mon</div>
              <div className="day-header">Tue</div>
              <div className="day-header">Wed</div>
              <div className="day-header">Thu</div>
              <div className="day-header">Fri</div>
              <div className="day-header">Sat</div>

              {/* Empty cells for days before month starts */}
              {Array.from({ length: days[0].getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day empty"></div>
              ))}

              {/* Days of the month */}
              {days.map(date => {
                const isPast = isBefore(startOfDay(date), today);
                const isSelected = selectedDate && isEqual(startOfDay(date), startOfDay(selectedDate));
                const isToday = isEqual(startOfDay(date), today);

                return (
                  <div
                    key={date.toString()}
                    className={`calendar-day ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => !isPast && handleDateClick(date)}
                  >
                    {format(date, 'd')}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="time-section">
            <h2>Select Time</h2>
            {!selectedDate ? (
              <p className="helper-text">Please select a date first</p>
            ) : !selectedService ? (
              <p className="helper-text">Please select a service first</p>
            ) : availableTimeSlots.length === 0 ? (
              <p className="helper-text">No available times for this date</p>
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
        </div>

        {/* Continue Button */}
        <div className="booking-actions">
          <button onClick={() => navigate('/book')} className="back-button">
            Back to Barbers
          </button>
          <button
            onClick={handleContinue}
            className="continue-button"
            disabled={!selectedDate || !selectedTime || !selectedService}
          >
            Continue to Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectDateTime;
