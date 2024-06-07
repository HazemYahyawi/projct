import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token); // Store token in localStorage
                setUser({ token: data.token, role: data.role });
                return data.role; // Return role for redirection
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    const register = async (name, email, password, role) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token); // Store token in localStorage
                setUser({ token: data.token, role: data.role });
                return data.role; // Return role for redirection
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout,register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
