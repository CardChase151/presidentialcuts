import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay, isEqual } from 'date-fns';
import { BookingContext } from '../../context/BookingContext';
import './SelectDate.css';

function SelectDate() {
  const { selectedBarber, selectedService, selectedDate, setSelectedDate } = useContext(BookingContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  if (!selectedBarber || !selectedService) {
    navigate('/book');
    return null;
  }

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const handleDateClick = (date) => {
    if (isBefore(startOfDay(date), startOfDay(new Date()))) return;
    setSelectedDate(date);
  };

  const handleContinue = () => {
    if (selectedDate) {
      navigate('/book/time');
    }
  };

  const days = getDaysInMonth();
  const today = startOfDay(new Date());

  return (
    <div className="booking-page">
      <div className="container">
        <div className="progress-indicator">Step 3 of 5</div>
        <h1 className="page-title">Select Date</h1>
        <p className="page-subtitle">
          {selectedBarber.users?.name} - {selectedService.name}
        </p>

        <div className="calendar-section centered">
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

        <div className="booking-actions">
          <button onClick={() => navigate('/book/service')} className="back-button">
            Back
          </button>
          <button
            onClick={handleContinue}
            className="continue-button"
            disabled={!selectedDate}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectDate;
