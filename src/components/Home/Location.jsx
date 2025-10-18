import React from 'react';
import './Location.css';

function Location() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">VISIT US</h2>
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Location</h3>
                <p>36101 Bob Hope Dr STE E6<br />Rancho Mirage, CA 92270</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <div>
                <h3>Phone</h3>
                <p><a href="tel:7608088113">(760) 808-8113</a></p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-clock"></i>
              <div>
                <h3>Hours</h3>
                <p>
                  Monday: 7 AM – 4 PM<br />
                  Tuesday - Saturday: 7 AM – 4 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-star"></i>
              <div>
                <h3>Amenities</h3>
                <p>Good for kids • Restroom available</p>
              </div>
            </div>
            <div className="social-contact">
              <a href="https://www.facebook.com/p/Presidential-Cuts-61556301353853/" target="_blank" rel="noopener noreferrer" className="social-btn">
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
              <a href="https://www.instagram.com/presidentialcuts_/" target="_blank" rel="noopener noreferrer" className="social-btn">
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </div>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.8!2d-116.4!3d33.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80db1d5d1d5d5d5d%3A0x1d5d5d5d5d5d5d5d!2s36101%20Bob%20Hope%20Dr%20STE%20E6%2C%20Rancho%20Mirage%2C%20CA%2092270!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Presidential Cuts Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Location;
