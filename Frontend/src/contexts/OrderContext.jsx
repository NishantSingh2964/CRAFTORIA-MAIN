import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [adminOrders, setAdminOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // User: Fetch personal orders
    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/my-orders');
            setOrders(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch your orders');
        } finally {
            setLoading(false);
        }
    };

    // Admin: Fetch all orders
    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/admin');
            setAdminOrders(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch admin orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await api.patch(`/orders/admin/${orderId}`, { status });
            setAdminOrders(prev => prev.map(o => o._id === orderId ? response.data.data : o));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to update status' };
        }
    };

    const createOrder = async (orderData) => {
        try {
            setLoading(true);
            const response = await api.post('/orders', orderData);
            setOrders(prev => [response.data.data, ...prev]);
            return { success: true, data: response.data.data };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create order' };
        } finally {
            setLoading(false);
        }
    };

    const createStripeSession = async (items, deliveryInfo, customerEmail) => {
        try {
            setLoading(true);
            const response = await api.post('/orders/create-checkout-session', { items, deliveryInfo, customerEmail });
            return { success: true, url: response.data.url, orderId: response.data.orderId };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to start payment' };
        } finally {
            setLoading(false);
        }
    };

    // Alias for compatibility with existing code
    const addOrder = (orderData) => createOrder(orderData);

    const deleteOrder = async (orderId) => {
        try {
            await api.delete(`/orders/admin/${orderId}`);
            setAdminOrders(prev => prev.filter(o => o._id !== orderId));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to delete order' };
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const response = await api.post(`/orders/${orderId}/cancel`);
            // Refresh personal orders to reflect cancellation
            await fetchMyOrders();
            return { success: true, message: response.data.message };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to cancel order' };
        }
    };

    const value = {
        orders,
        adminOrders,
        loading,
        error,
        fetchMyOrders,
        fetchAllOrders,
        updateOrderStatus,
        createOrder,
        addOrder,
        createStripeSession,
        deleteOrder,
        cancelOrder
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrders must be used within OrderProvider');
    return context;
};
