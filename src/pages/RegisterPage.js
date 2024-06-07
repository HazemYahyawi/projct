import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // Import the CSS file
import FarmersImage from '../img/farmer.avif'; // Import the image

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password, role);
    navigate('/');
  };

  return (
    <div className="register-page">
      <div className="image-container">
        <img src={FarmersImage} alt="Farmers" className="side-image" />
      </div>
      <form onSubmit={handleSubmit} className="register-form">
        <h3>BIO MARKET</h3>
        <h2>Register</h2>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          className="form-input"
        />
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
        <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
          <option value="buyer">Buyer</option>
          <option value="farmer">Farmer</option>
        </select>
        <button type="submit" className="form-button">Register</button>
        <div className="login-link">
          <p>Already have an account?</p>
          <button type="button" onClick={() => navigate('/login')} className="login-button">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
