import React, { createContext, useState, useEffect } from 'react';

export const BookingContext = createContext();

// Helper functions for localStorage
const getStoredBooking = () => {
  try {
    const stored = localStorage.getItem('presidentialCutsBooking');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date string back to Date object if it exists
      if (parsed.selectedDate) {
        parsed.selectedDate = new Date(parsed.selectedDate);
      }
      return parsed;
    }
  } catch (error) {
    console.error('Error loading booking from localStorage:', error);
  }
  return {};
};

const saveBookingToStorage = (booking) => {
  try {
    localStorage.setItem('presidentialCutsBooking', JSON.stringify(booking));
  } catch (error) {
    console.error('Error saving booking to localStorage:', error);
  }
};

export function BookingProvider({ children }) {
  // Initialize state from localStorage
  const storedBooking = getStoredBooking();
  const [selectedBarber, setSelectedBarber] = useState(storedBooking.selectedBarber || null);
  const [selectedDate, setSelectedDate] = useState(storedBooking.selectedDate || null);
  const [selectedTime, setSelectedTime] = useState(storedBooking.selectedTime || null);
  const [selectedService, setSelectedService] = useState(storedBooking.selectedService || null);

  // Save to localStorage whenever booking state changes
  useEffect(() => {
    const booking = {
      selectedBarber,
      selectedDate,
      selectedTime,
      selectedService
    };
    saveBookingToStorage(booking);
  }, [selectedBarber, selectedDate, selectedTime, selectedService]);

  const resetBooking = () => {
    setSelectedBarber(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedService(null);
    localStorage.removeItem('presidentialCutsBooking');
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
