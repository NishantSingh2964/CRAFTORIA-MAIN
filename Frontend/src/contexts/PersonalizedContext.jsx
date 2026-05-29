import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { getAuthToken } from '../services/api';

const PersonalizedContext = createContext();

export const PersonalizedProvider = ({ children }) => {
    const [personalizedProducts, setPersonalizedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = getAuthToken;

    const fetchPersonalizedProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/personalized-products');
            setPersonalizedProducts(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch personalized products');
        } finally {
            setLoading(false);
        }
    };

    const addPersonalizedProduct = async (formData) => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await api.post('/personalized-products', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPersonalizedProducts(prev => [response.data.data, ...prev]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to add personalized product' };
        } finally {
            setLoading(false);
        }
    };

    const deletePersonalizedProduct = async (id) => {
        try {
            const token = await getToken();
            await api.delete(`/personalized-products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPersonalizedProducts(prev => prev.filter(p => p._id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to delete personalized product' };
        }
    };

    const fetchPersonalizedProductById = async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/personalized-products/${id}`);
            return { success: true, data: response.data.data };
        } catch (err) {
            return { success: false, error: 'Failed to fetch personalized product' };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        personalizedProducts,
        loading,
        error,
        fetchPersonalizedProducts,
        fetchPersonalizedProductById,
        addPersonalizedProduct,
        deletePersonalizedProduct
    };

    return <PersonalizedContext.Provider value={value}>{children}</PersonalizedContext.Provider>;
};

export const usePersonalized = () => useContext(PersonalizedContext);
