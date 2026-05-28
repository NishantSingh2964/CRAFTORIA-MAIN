import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { getAuthToken } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = getAuthToken;

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (formData) => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await api.post('/products/admin', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setProducts(prev => [response.data.data, ...prev]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to add product' };
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const token = await getToken();
            await api.delete(`/products/admin/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(prev => prev.filter(p => p._id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to delete product' };
        }
    };

    const fetchProductById = async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            return { success: true, data: response.data.data };
        } catch (err) {
            return { success: false, error: 'Failed to fetch product' };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        products,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        addProduct,
        deleteProduct
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => useContext(ProductContext);
