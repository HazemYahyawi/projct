import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';
import { FaUser, FaShoppingCart, FaList, FaComments } from 'react-icons/fa';
import Nav from './Compo/Nav';
import { Chart } from "react-google-charts";
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer ,} from 'recharts';
import { AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, Inject, AccumulationDataLabel, AccumulationTooltip, PieSeries } from '@syncfusion/ej2-react-charts';


const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  
  const [stats, setStats] = useState({
    userCount: 0,
    farmerCount: 0,
    buyerCount: 0,
    productCount: 0,
    almondCount: 0,
    pistachioCount: 0,
    commentCount: 0,
  });

  
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
    fetchUsers();
    fetchProducts();
    fetchComments();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await axios.get('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('User is not authorized to access user list');
      } else {
        console.error('Error fetching users:', error);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/products/comments/all'); // Ensure the endpoint matches
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { userCount, farmerCount, buyerCount, productCount, almondCount, pistachioCount, commentCount } = response.data;
      setStats({ userCount, farmerCount, buyerCount, productCount, almondCount, pistachioCount, commentCount });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditName('');
    setEditEmail('');
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      await axios.put(
        `/api/admin/users/${editingUser._id}`,
        { name: editName, email: editEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('User information updated successfully!');
      setEditingUser(null);
      setEditName('');
      setEditEmail('');
      const response = await axios.get('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user information');
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('User deleted successfully!');
      const response = await axios.get('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const renderUsers = (role) => (
    <ul className="user-list">
      {users.filter((user) => user.role === role).map((user) => (
        <li key={user._id} className="user-item">
          {editingUser && editingUser._id === user._id ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="edit-input"
              />
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="edit-input"
              />
              <button onClick={handleSaveEdit} className="save-button">Save</button>
              <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
            </>
          ) : (
            <>
              <div className="user-info">
                <div className="user-name">Name: {user.name}</div>
                <div className="user-email">Email: {user.email}</div>
              </div>
              <button onClick={() => handleEdit(user)} className="edit-button">Edit</button>
              <button onClick={() => handleDeleteUser(user._id)} className="delete-button">Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );

  const renderProducts = () => (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product._id} className="product-item">
          <div className="product-info">
            <div className="product-name">Name: {product.title}</div>
            <div className="product-price">Price: ${product.price}</div>
          </div>
        </li>
      ))}
    </ul>
  );

  const renderComments = () => (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li key={comment._id} className="comment-item">
          <div className="comment-content">{comment.content}</div>
        </li>
      ))}
    </ul>
  );

  const renderStats = () => (
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
          <div className='card'>
            <div className='card-inner'>
              <h3>BUYERS</h3>
              <BsFillBellFill className='card_icon' />
            </div>
            <h1>{stats.buyerCount}</h1>
          </div>
          <div className='card'>
            <div className='card-inner'>
              <h3>FARMERS</h3>
              <BsFillBellFill className='card_icon' />
            </div>
            <h1>{stats.farmerCount}</h1>
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
  );

  return (
    <div>
      <Nav />
      <div className="admin-page">
        <div className="sidebar">
          <div className="sidebar-item" onClick={() => setActiveTab('stats')}>
            <FaUser /> Stats
          </div>
          <div className="sidebar-item" onClick={() => setActiveTab('users')}>
            <FaUser /> Admins
          </div>
          <div className="sidebar-item" onClick={() => setActiveTab('farmers')}>
            <FaUser /> Farmers
          </div>
          <div className="sidebar-item" onClick={() => setActiveTab('buyers')}>
            <FaShoppingCart /> Buyers
          </div>
          <div className="sidebar-item" onClick={() => setActiveTab('products')}>
            <FaList /> Product List
          </div>
          <div className="sidebar-item" onClick={() => setActiveTab('comments')}>
            <FaComments /> Comments
          </div>
        </div>
        <div className="main-content">
          {activeTab === 'stats' && renderStats()}
          {activeTab === 'users' && renderUsers('admin')}
          {activeTab === 'farmers' && renderUsers('farmer')}
          {activeTab === 'buyers' && renderUsers('buyer')}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'comments' && renderComments()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
