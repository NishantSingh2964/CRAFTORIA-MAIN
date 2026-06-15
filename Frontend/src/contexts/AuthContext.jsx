import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Configure axios for cookies
    axios.defaults.withCredentials = true;

    const checkUser = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/auth/me`);
            setUser({ ...data.data, stats: data.stats });
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            setUser(data.user);
            toast.success('Logged in successfully');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
            setUser(data.user);
            toast.success('Registration successful');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const googleLogin = async (credential) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/google`, { credential });
            setUser(data.user);
            toast.success('Google Login successful');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Google Login failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${API_URL}/auth/logout`);
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const value = {
        user,
        setUser,
        loading,
        login,
        register,
        googleLogin,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin' || user?.role === 'SuperAdmin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
