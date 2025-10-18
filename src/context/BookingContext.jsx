import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const resetBooking = () => {
    setSelectedBarber(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedService(null);
  };

  const value = {
    selectedBarber,
    setSelectedBarber,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedService,
    setSelectedService,
    resetBooking
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
