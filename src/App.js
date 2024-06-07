import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // Ensure the correct case
import AdminPage from './pages/AdminPage';
import BuyerPage from './pages/BuyerPage';
import AdminRegister from './pages/AdminRegister';
import FarmerPage from './pages/FarmerPage';
import PrivateRoute from './components/PrivateRoute';
import ProductDetail from './components/ProductDetails';
import ProductList from './components/ProductList'; // Ensure the correct path

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/registeradmin" element={<AdminRegister />} />
                        <Route path="/product" element={<ProductList />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/admin" element={<PrivateRoute element={<AdminPage />} allowedRoles={['admin']} />} />
                        <Route path="/buyer" element={<PrivateRoute element={<BuyerPage />} allowedRoles={['buyer']} />} />
                        <Route path="/farmer" element={<PrivateRoute element={<FarmerPage />} allowedRoles={['farmer']} />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;
