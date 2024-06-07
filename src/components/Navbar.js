import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ cart }) => {
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const cartKey = `cartItems_${userId}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    setLocalCart(cartItems);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = localCart.filter(item => item._id !== id);
    setLocalCart(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id, quantity) => {
    const updatedCart = localCart.map(item =>
      item._id === id ? { ...item, quantity: Number(quantity) } : item
    );
    setLocalCart(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleSendRequest = async () => {
    const userId = localStorage.getItem('userId');
    const cartKey = `cartItems_${userId}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

    const products = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        farmerId: item.farmer
    }));

    console.log('Request Data:', { buyerId: userId, products });

    if (!userId || products.length === 0) {
        alert('Invalid request data');
        return;
    }

    try {
        const response = await axios.post('/api/requests/send', {
            buyerId: userId,
            products
        });

        if (response.status === 201) {
            alert('Request sent successfully!');
        }
    } catch (error) {
        console.error('Error sending request:', error);
        alert('Error sending request');
    }
};


  return (
    <section id="header" className="header">
      <a href="/" className="logo"><i className="fas fa-male"></i> Market Place</a>
      <nav className="navbar">
        <a href="/">Home</a>
        <a href="#about">About</a>
        <a href="/product">ProductList</a>
        <a href="#logout" onClick={handleLogout}>Log out</a>
      </nav>
      <div className="icons">
        <div id="menu-btn" className="fas fa-bars"></div>
        <div className="fas fa-shopping-cart" onClick={handleCartClick}></div>
      </div>
      {showCart && (
        <div className="cart-modal">
          <h3>Shopping Cart</h3>
          {localCart.length > 0 ? (
            localCart.map((item) => (
              <div key={item._id} className="cart-item">
                <p>{item.name}</p>
                <p>Price: ${item.price}</p>
                <p>
                  Quantity: 
                  <input 
                    type="number" 
                    value={item.quantity} 
                    min="1" 
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  />
                </p>
                <button onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
              </div>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
          <button onClick={handleSendRequest}>Send Request</button>
        </div>
      )}
    </section>
  );
};

export default Navbar;
