import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Hero.css';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <img src={logo} alt="Presidential Cuts" className="hero-logo" />
        <h1>PRESIDENTIAL CUTS</h1>
        <p className="hero-subtitle">Premium Barbershop Experience in Rancho Mirage</p>
        <Link to="/book" className="cta-button">Book Your Appointment</Link>
        <div className="social-links">
          <a href="https://www.facebook.com/p/Presidential-Cuts-61556301353853/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/presidentialcuts_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
