import React from 'react';
import fadesImage from '../../assets/fades.png';
import './About.css';

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">PRECISION & EXCELLENCE</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Welcome to Presidential Cuts, Rancho Mirage's premier destination for exceptional men's grooming.
              We specialize in delivering precision fades, classic cuts, and professional beard styling with a
              commitment to excellence that matches our name.
            </p>
            <p>
              Our skilled barbers combine traditional techniques with modern styles to create the perfect look
              for every client. Whether you're seeking a sharp business cut, a trendy fade, or a complete grooming
              experience, we deliver presidential-level service.
            </p>
            <ul className="features">
              <li><i className="fas fa-check"></i> Expert Precision Fades & Tapers</li>
              <li><i className="fas fa-check"></i> Professional Beard Styling</li>
              <li><i className="fas fa-check"></i> Kid-Friendly Environment</li>
              <li><i className="fas fa-check"></i> Hot Towel Treatments</li>
            </ul>
          </div>
          <div className="about-image">
            <img src={fadesImage} alt="Presidential Cuts Styles" className="fade-showcase" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
