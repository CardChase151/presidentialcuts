import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './Header.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (user?.is_owner) {
      navigate('/dashboard/owner');
    } else if (user?.is_barber) {
      navigate('/dashboard/barber');
    } else {
      navigate('/dashboard/client');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Presidential Cuts Logo" />
        </Link>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><a href="/#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a></li>
          <li><a href="/#services" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Services</a></li>
          <li><Link to="/book" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Book Now</Link></li>
          <li><a href="/#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>

          {user ? (
            <>
              <li>
                <button onClick={handleDashboardClick} className="nav-link nav-button">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-link nav-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="nav-link login-btn" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>

        <div
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Header;
