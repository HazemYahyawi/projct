import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Nav.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Nav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <section id="header" className="header">
      <a href="/" className="logo"><i className="fas fa-male"></i> Admin dashboard</a>
      <nav className="navbar">
        
        <a href="#logout" onClick={handleLogout}>Log out</a>
      </nav>
      <div className="icons">
        <div id="menu-btn" className="fas fa-bars"></div>
        
      </div>
    </section>
  );
};

export default Nav;
