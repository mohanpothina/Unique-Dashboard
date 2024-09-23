import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext();

// Create a provider component to wrap the app and provide auth context
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');
        return token ? { username, token } : null;
    });

    // Function to handle login
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8086/admin/login', {  // Adjust to your backend URL
                username,
                password,
            });
            const token = response.data.token; // Assuming JWT token is returned from backend
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', username);
            setAuth({ username, token });
        } catch (error) {
            console.error("Login failed:", error);
            throw new Error('Invalid login credentials');
        }
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setAuth(null);
        window.location.href = '/login';  // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
