import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FarmerPage.css';
import StockBar from '../components/StockBar';
import Nav1 from './Compo/Nav1';
import { Chart } from "react-google-charts";
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer ,} from 'recharts';
import { AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, Inject, AccumulationDataLabel, AccumulationTooltip, PieSeries } from '@syncfusion/ej2-react-charts';

const FarmerPage = () => {
  const farmerId = localStorage.getItem('userId');
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [comments, setComments] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });
  const [stats, setStats] = useState({
    productCount: 0,
    almondCount: 0,
    pistachioCount: 0,
    commentCount: 0
    
  });

  const [activeSection, setActiveSection] = useState('stats');
  const [errors, setErrors] = useState({});
  // ehdi pour la courbee de mois
  const data = [
    { name: 'Janvier', Pistachio: 4000, Almond: 2400, amt: 2400 },
    { name: 'Fevrier', Pistachio: 3000, Almond: 1398, amt: 2210 },
    { name: 'Mars', Pistachio: 2000, Almond: 9800, amt: 2290 },
    { name: 'Avril', Pistachio: 2780, Almond: 3908, amt: 2000 },
    { name: 'Mai', Pistachio: 1890, Almond: 4800, amt: 2181 },
    { name: 'Juin', Pistachio: 2390, Almond: 3800, amt: 2500 },
    { name: 'Juillet', Pistachio: 3490, Almond: 4300, amt: 2100 },
  ];
const data1 = [
    ["Products", "Hours per Day"],
    ["pustachio", 11],
    ["almond", 2],
    // CSS-style declaration
  ];
  
const option = {
    title: "ALL of the stock",
    pieHole: 0.4,
    is3D: false,
  };

  const datalabel = { visible: true, position: 'Inside', name: 'text' };
  const tooltip = { enable: true };
  const tooltipRender = (args) => {
    let value = args.point.y / args.series.sumOfPoints * 100;
    args.text = args.point.x + ' ' + Math.ceil(value) + ' %';
  };

  useEffect(() => {
    fetchProducts();
    fetchComments();
 
    fetchStats();
  }, []);
  useEffect(() => {
    if (activeSection === 'commands') {
      axios.get(`/api/requests/farmer/:${farmerId}`)
        .then(res => setRequests(res.data))
        .catch(err => console.error(err));
    }
  }, [activeSection, farmerId]);
  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await axios.get('/api/farmer/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { productCount, almondCount, pistachioCount, commentCount } = response.data;
      setStats({ productCount, almondCount, pistachioCount, commentCount });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await axios.get('/api/farmer/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  

  const fetchComments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await axios.get('/api/products/comments/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  const handleAcceptRequest = async (requestId) => {
    // Implement accept request logic here
    alert(`Request ${requestId} accepted`);
  };

  const handleDeclineRequest = async (requestId) => {
    // Implement decline request logic here
    alert(`Request ${requestId} declined`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewProduct({ ...newProduct, image: file });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newProduct.title) newErrors.title = 'Title is required';
    if (!newProduct.description) newErrors.description = 'Description is required';
    if (!newProduct.price) newErrors.price = 'Price is required';
    if (!newProduct.stock) newErrors.stock = 'Stock is required';
    if (!newProduct.category) newErrors.category = 'Category is required';
    if (!newProduct.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const formData = new FormData();
    formData.append('title', newProduct.title);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('category', newProduct.category);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    } else {
      console.error('Image file missing');
      return;
    }

    try {
      const response = await axios.post('/api/farmer/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts([...products, response.data]);
      setNewProduct({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: null,
      });
    } catch (error) {
      console.error('Error creating product:', error.response ? error.response.data : error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const formData = new FormData();
    formData.append('title', editingProduct.title);
    formData.append('description', editingProduct.description);
    formData.append('price', editingProduct.price);
    formData.append('stock', editingProduct.stock);
    formData.append('category', editingProduct.category);
    if (editingProduct.image instanceof File) {
      formData.append('image', editingProduct.image);
    }

    try {
      const response = await axios.put(`/api/farmer/products/${editingProduct._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts(products.map(product => product._id === editingProduct._id ? response.data : product));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      await axios.delete(`/api/farmer/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteComment = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      await axios.delete(`/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter(comment => comment._id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <Nav1 />
      <div className="farmer-container">
        <div className="sidebar">
          <ul>
            <li><a href="#stats" onClick={() => setActiveSection('stats')}>Stats</a></li>
            <li><a href="#create" onClick={() => setActiveSection('create')}>Create Product</a></li>
            <li><a href="#view" onClick={() => setActiveSection('view')}>View Products</a></li>
            <li><a href="#comments" onClick={() => setActiveSection('comments')}>View Comments</a></li>
            <li><a href="#commands" onClick={() => setActiveSection('commands')}>Commands</a></li>
          </ul>
        </div>

        <div className="content">
          {activeSection === 'stats' && (
            <section id="stats">
            <main className='main-container'>
              <div className='main-title'>
                <h3>DASHBOARD</h3>
              </div>
              <div className='main-cards'>
                <div className='card'>
                  <div className='card-inner'>
                    <h3>PRODUCTS</h3>
                    <BsFillArchiveFill className='card_icon' />
                  </div>
                  <h1>{stats.productCount}</h1>
                </div>
                <div className='card'>
                  <div className='card-inner'>
                    <h3>ALMOND</h3>
                    <BsFillGrid3X3GapFill className='card_icon' />
                  </div>
                  <h1>{stats.almondCount}</h1>
                </div>
                <div className='card'>
                  <div className='card-inner'>
                    <h3>PISTACHIO</h3>
                    <BsPeopleFill className='card_icon' />
                  </div>
                  <h1>{stats.pistachioCount}</h1>
                </div>
                <div className='card'>
                  <div className='card-inner'>
                    <h3>COMMENTS</h3>
                    <BsFillBellFill className='card_icon' />
                  </div>
                  <h1>{stats.commentCount}</h1>
                </div>
              </div>

                <div className='charts'>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Pistachio" stackId="a" fill="#8884d8" />
                      <Bar dataKey="Almond" stackId="a" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                  <AccumulationChartComponent id='charts' tooltip={tooltip} tooltipRender={tooltipRender}>
                    <Inject services={[AccumulationTooltip, PieSeries, AccumulationDataLabel]} />
                    <AccumulationSeriesCollectionDirective>
                      <AccumulationSeriesDirective dataSource={data} xName='x' yName='y' radius='70%' dataLabel={datalabel} />
                    </AccumulationSeriesCollectionDirective>
                  </AccumulationChartComponent>
                  <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={data1}
      options={option}
    />
                </div>
              </main>
            </section>
          )}

          {activeSection === 'create' && (
            <section id="create">
              <h2>Create Product</h2>
              <form className="form">
                <div>
                  <label>Title:</label>
                  <input type="text" name="title" value={newProduct.title} onChange={handleInputChange} />
                  {errors.title && <span className="error">{errors.title}</span>}
                </div>
                <div>
                  <label>Description:</label>
                  <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} />
                  {errors.description && <span className="error">{errors.description}</span>}
                </div>
                <div>
                  <label>Price:</label>
                  <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} />
                  {errors.price && <span className="error">{errors.price}</span>}
                </div>
                <div>
                  <label>Stock:</label>
                  <input type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} />
                  {errors.stock && <span className="error">{errors.stock}</span>}
                </div>
                <div>
                  <label>Category:</label>
                  <input type="text" name="category" value={newProduct.category} onChange={handleInputChange} />
                  {errors.category && <span className="error">{errors.category}</span>}
                </div>
                <div>
                  <label>Image:</label>
                  <input type="file" name="image" onChange={handleFileChange} />
                  {errors.image && <span className="error">{errors.image}</span>}
                </div>
                <button type="button" onClick={handleCreateProduct}>Create Product</button>
              </form>
            </section>
          )}
          {activeSection === 'commands' && (
            <div>
      {activeSection === 'commands' && (
        <section id="command">
          <h3>Received Requests</h3>
          {requests.length > 0 ? (
            requests.map((request) => (
              <div key={request._id} className="request-item">
                <p>Buyer ID: {request.buyerId}</p>
                <ul>
                  {request.products.map((product) => (
                    <li key={product.productId}>
                      Product ID: {product.productId}, Quantity: {product.quantity}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                <button onClick={() => handleDeclineRequest(request._id)}>Decline</button>
              </div>
            ))
          ) : (
            <p>No requests received</p>
          )}
        </section>
      )}
    </div>
          )}


          {activeSection === 'view' && (
            <section id="view">
              <h2>View Products</h2>

              <h3>Almond Products</h3>
              <ul className="product-list">
                {products.filter(product => product.title.toLowerCase() === 'almond').sort((a, b) => a.title.localeCompare(b.title)).map((product) => (
                  <li key={product._id} className="product-item">
                    <div><strong>Title:</strong> {product.title}</div>
                    <div><strong>Description:</strong> {product.description}</div>
                    <div><strong>Price:</strong> ${product.price}</div>
                    <div><strong>Stock:</strong> {product.stock}</div>
                    <div><strong>Category:</strong> {product.category}</div>
                    <div><strong>Image:</strong> <img src={product.image} alt={product.title} /></div>
                    <StockBar product={product} />
                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                  </li>
                ))}
              </ul>

              <h3>Pistachio Products</h3>
              <ul className="product-list">
                {products.filter(product => product.title.toLowerCase() === 'pistachio').sort((a, b) => a.title.localeCompare(b.title)).map((product) => (
                  <li key={product._id} className="product-item">
                    <div><strong>Title:</strong> {product.title}</div>
                    <div><strong>Description:</strong> {product.description}</div>
                    <div><strong>Price:</strong> ${product.price}</div>
                    <div><strong>Stock:</strong> {product.stock}</div>
                    <div><strong>Category:</strong> {product.category}</div>
                    <div><strong>Image:</strong> <img src={product.image} alt={product.title} /></div>
                    <StockBar product={product} />
                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {activeSection === 'comments' && (
            <section id="comments">
              <h2>View Comments</h2>
              <ul className="comment-list">
                {comments.map((comment) => (
                  <li key={comment._id} className="comment-item">
                    <div>{comment.content}</div>
                    <div><strong>Product:</strong> {comment.product}</div>
                    <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {editingProduct && (
            <section id="edit">
              <h2>Edit Product</h2>
              <form className="form">
                <div>
                  <label>Title:</label>
                  <select name="title" value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}>
                    <option value="">Select a product</option>
                    <option value="almond">Almond</option>
                    <option value="pistachio">Pistachio</option>
                  </select>
                </div>
                <div>
                  <label>Description:</label>
                  <input type="text" name="description" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                </div>
                <div>
                  <label>Price:</label>
                  <input type="number" name="price" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                </div>
                <div>
                  <label>Stock:</label>
                  <input type="number" name="stock" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
                </div>
                <div>
                  <label>Category:</label>
                  <input type="text" name="category" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} />
                </div>
                <div>
                  <label>Image:</label>
                  <input type="file" name="image" onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.files[0] })} />
                </div>
                <button type="button" onClick={handleUpdateProduct}>Update Product</button>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerPage;
