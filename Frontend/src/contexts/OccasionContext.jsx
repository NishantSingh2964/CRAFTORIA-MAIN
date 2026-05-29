import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getAuthToken } from '../services/api';

const OccasionContext = createContext();

export const OccasionProvider = ({ children }) => {
    const [occasions, setOccasions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOccasions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/occasions');
            setOccasions(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch occasions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOccasions();
    }, []);

    const addOccasion = async (formData) => {
        try {
            setLoading(true);
            const token = await getAuthToken();
            const response = await api.post('/occasions/admin', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setOccasions(prev => [...prev, response.data.data]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to add occasion' };
        } finally {
            setLoading(false);
        }
    };

    const updateOccasion = async (id, formData) => {
        try {
            setLoading(true);
            const token = await getAuthToken();
            const response = await api.patch(`/occasions/admin/${id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setOccasions(prev => prev.map(o => o._id === id ? response.data.data : o));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to update occasion' };
        } finally {
            setLoading(false);
        }
    };

    const deleteOccasion = async (id) => {
        try {
            const token = await getAuthToken();
            await api.delete(`/occasions/admin/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOccasions(prev => prev.filter(o => o._id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to delete occasion' };
        }
    };

    const value = {
        occasions,
        loading,
        error,
        fetchOccasions,
        addOccasion,
        updateOccasion,
        deleteOccasion
    };

    return <OccasionContext.Provider value={value}>{children}</OccasionContext.Provider>;
};

export const useOccasions = () => {
    const context = useContext(OccasionContext);
    if (!context) throw new Error('useOccasions must be used within OccasionProvider');
    return context;
};
