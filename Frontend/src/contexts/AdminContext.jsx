import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { useAuth } from '@clerk/clerk-react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const { getToken } = useAuth();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await api.get('/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.data);
        } catch (err) {
            console.error('Stats Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentAdmin = async () => {
        try {
            const token = await getToken();
            const response = await api.get('/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentUser(response.data.data);
        } catch (err) {
            console.error('Profile Error:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await api.get('/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.data);
        } catch (err) {
            console.error('Users Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, role) => {
        try {
            setLoading(true);
            const token = await getToken();
            await api.patch(`/users/${userId}/role`, { role }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
            return { success: true };
        } catch (err) {
            console.error('Role Update Error:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to update user role' };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        stats,
        users,
        currentUser,
        loading,
        fetchDashboardStats,
        fetchUsers,
        fetchCurrentAdmin,
        updateUserRole
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
