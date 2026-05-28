import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getAuthToken } from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = await getAuthToken();
            const response = await api.get('/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('--- NOTIFICATIONS FETCHED ---', {
              count: response.data.unreadCount,
              total: response.data.data.length
            });
            setNotifications(response.data.data);
            setUnreadCount(response.data.unreadCount);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = await getAuthToken();
            await api.patch('/notifications/read', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark notifications as read:', err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = await getAuthToken();
            await api.delete(`/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.filter(n => n._id !== id));
            // Recalculate unread if the deleted one was unread
            const deletedWasUnread = notifications.find(n => n._id === id)?.isRead === false;
            if (deletedWasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchNotifications();
        
        // Polling every 1 minute for new notifications
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            loading, 
            fetchNotifications, 
            markAllAsRead,
            deleteNotification 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
