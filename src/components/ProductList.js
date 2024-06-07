import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './productList.css';
import Navbar from './Navbar';
import img from '../img/for1.jpg';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className='1'>
            <Navbar />
            <div className="product-list">
                {products.map(product => (
                    <div className="product-item" key={product._id}>
                        <img src={img} alt={product.title} className="product-image" />
                        <div className="product-details">
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p className="price">Price: ${product.price}</p>
                            <p className="stock">Stock: {product.stock}</p>
                            <p className="farmer">Farmer: {product.farmer.name}</p>
                            <Link to={`/products/${product._id}`} className="view-details">View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
