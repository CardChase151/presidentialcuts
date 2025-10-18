import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import SelectBarber from './pages/Booking/SelectBarber';
import SelectDateTime from './pages/Booking/SelectDateTime';
import Confirmation from './pages/Booking/Confirmation';
import Login from './pages/Login';
import ClientDashboard from './pages/Dashboard/ClientDashboard';
import BarberDashboard from './pages/Dashboard/BarberDashboard';
import OwnerDashboard from './pages/Dashboard/OwnerDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book" element={<SelectBarber />} />
              <Route path="/book/datetime" element={<SelectDateTime />} />
              <Route path="/book/confirmation" element={<Confirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              <Route path="/dashboard/barber" element={<BarberDashboard />} />
              <Route path="/dashboard/owner" element={<OwnerDashboard />} />
            </Routes>
          </Layout>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
