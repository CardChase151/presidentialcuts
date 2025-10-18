import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Presidential Cuts. All rights reserved.</p>
        <p>36101 Bob Hope Dr STE E6, Rancho Mirage, CA 92270 | <a href="tel:7608088113">(760) 808-8113</a></p>
        <div className="footer-social">
          <a href="https://www.facebook.com/p/Presidential-Cuts-61556301353853/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/presidentialcuts_/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
