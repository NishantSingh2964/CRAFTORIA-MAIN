import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { getAuthToken } from '../services/api';
import toast from 'react-hot-toast';

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const getToken = getAuthToken;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReviewsByProduct = async (productId) => {
        try {
            setLoading(true);
            const response = await api.get(`/reviews/product/${productId}`);
            setReviews(response.data.data);
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return { success: false, error: error.response?.data?.message || 'Failed to fetch reviews' };
        } finally {
            setLoading(false);
        }
    };

    const submitReview = async (reviewData) => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await api.post('/reviews', reviewData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(prev => [response.data.data, ...prev]);
            toast.success('Review submitted successfully!');
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
            return { success: false, error: error.response?.data?.message || 'Failed to submit review' };
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            setLoading(true);
            const token = await getToken();
            await api.delete(`/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(prev => prev.filter(r => r._id !== reviewId));
            toast.success('Review deleted successfully');
            return { success: true };
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return (
        <ReviewContext.Provider value={{ reviews, loading, fetchReviewsByProduct, submitReview, deleteReview }}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReviews = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
};
