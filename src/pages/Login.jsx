import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [activeTab, setActiveTab] = useState('customer');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    if (user.is_owner) navigate('/dashboard/owner');
    else if (user.is_barber) navigate('/dashboard/barber');
    else navigate('/dashboard/client');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const result = await login(formData.email, formData.password, activeTab === 'barber');
      if (result.success) {
        if (result.user.is_owner) {
          navigate('/dashboard/owner');
        } else if (result.user.is_barber) {
          navigate('/dashboard/barber');
        } else {
          navigate('/dashboard/client');
        }
      } else {
        setError(result.error);
      }
    } else {
      if (!formData.name) {
        setError('Please provide your name');
        setLoading(false);
        return;
      }

      const result = await register(formData.email, formData.password, formData.name, formData.phone);
      if (result.success) {
        navigate('/dashboard/client');
      } else {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  return (
    <div className={`login-page ${activeTab === 'barber' ? 'barber-mode' : ''}`}>
      <div className={`login-container ${activeTab === 'barber' ? 'barber-mode' : ''}`}>
        <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>

        <div className="tabs">
          <button
            className={activeTab === 'customer' ? 'active' : ''}
            onClick={() => setActiveTab('customer')}
          >
            Customer
          </button>
          <button
            className={activeTab === 'barber' ? 'active' : ''}
            onClick={() => setActiveTab('barber')}
          >
            Barber
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="toggle-form">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="toggle-button">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="toggle-button">
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
