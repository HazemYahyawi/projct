import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file
import FarmersImage from '../img/Logo2.0.jpg'; // Import the image

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = await login(email, password); 
    if (role) {
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'buyer':
          navigate('/buyer');
          break;
        case 'farmer':
          navigate('/farmer');
          break;
        default:
          navigate('/');
      }
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      
      <form onSubmit={handleSubmit} className="login-form">
      <div className="image-container">
        <img src={FarmersImage} alt="Farmers" className="side-image1" />
      </div>
        <h1>Sign in</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="form-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="form-input"
        />
        <button type="submit" className="form-button">Sign In</button>
        <div className="social-container">
          <button type="button" className="social-button facebook-button">
            <i className="fab fa-facebook-f" />
            Sign in with Facebook
          </button>
          <button type="button" className="social-button google-button">
            <i className="fab fa-google" />
            Sign in with Google
          </button>
        </div>
        <a href="/register" className="forgot-password-link">Forgot your password?</a>
        <p className="register-link">Don't have an account? <button type="button" className='form-button' onClick={handleRegister}>Register Now</button></p>
      </form>
    </div>
  );
};

export default LoginPage;
