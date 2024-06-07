import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import img from '../img/for1.jpg';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios.get(`/api/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        axios.get(`/api/products/comments/${id}`)
            .then(res => setComments(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/products/comments/${id}`, { content: newComment }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setComments([...comments, res.data]);
            setNewComment('');
        } catch (err) {
            setError('Failed to post comment. Make sure you are logged in.');
        }
    };

    const handleAddToCart = () => {
        const userId = localStorage.getItem('userId');
        const cartKey = `cartItems_${userId}`;
        const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
        const existingItemIndex = cartItems.findIndex(item => item.id === product._id);
    
        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            cartItems.push({ ...product, quantity });
        }
    
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
        alert('Item added to cart!');
    };

    return (
        <div className="product-detail">
            {product && (
                <div className="product-info">
                    <img src={img} alt={product.name} className="product-image" />
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p className="price">Price: ${product.price}</p>
                    <p className="stock">Stock: {product.stock}</p>
                </div>
            )}
            <div className="comments-section">
                <h3>Comments</h3>
                {comments.map(comment => (
                    <div key={comment._id} className="comment">
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    required
                ></textarea>
                <button type="submit">Submit</button>
            </form>
            {error && <p className="error">{error}</p>}
            {product && product.stock > 0 && (
                <div className="add-to-cart">
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1"
                        max={product.stock}
                        required
                    />
                    <button onClick={handleAddToCart} className="add-to-cart-button">Add to Cart</button>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
