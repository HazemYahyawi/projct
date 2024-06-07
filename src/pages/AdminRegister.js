import React, { useState } from 'react';
import axios from 'axios';
import './AdminRegister.css';
import img from '../img/admin.jpg'

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/RegisterA', {
        name,
        email,
        password,
        role: 'admin',
      });
      console.log(response.data);
      alert('Admin registered successfully');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="admin-register-container">
      <img src={img} alt="Admin Registration" className="header-image" />
      
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit" className="submit-button">Register</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AdminRegister;
