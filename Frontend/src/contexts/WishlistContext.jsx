import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch wishlist from backend when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (authLoading || !isAuthenticated) {
        setWishlist([]); 
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/wishlist');
        if (response.data.success) {
          const flattenedWishlist = response.data.data
            .filter(item => item && item.product) 
            .map(item => ({
              ...item.product,
              productModel: item.productModel
            }));
          setWishlist(flattenedWishlist);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, authLoading]);

  const toggleWishlist = async (product, explicitModel = null) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your wishlist', {
        icon: '🔒',
        duration: 3000
      });
      return;
    }

    const productModel = explicitModel || 
                        product.productModel || 
                        (product.customizationSteps ? 'PersonalizedProduct' : 'Product');
    
    try {
      const response = await api.post('/wishlist/toggle', {
        productId: product._id || product.id,
        productModel
      });

      if (response.data.success) {
        if (response.data.isAdded) {
          setWishlist(prev => [...prev, { ...product, productModel }]);
          toast.success(`${product.name} added to wishlist`, { icon: '❤️' });
        } else {
          setWishlist(prev => prev.filter(item => (item._id || item.id) !== (product._id || product.id)));
          toast.success(`${product.name} removed from wishlist`);
        }
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
      console.error(error);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const product = wishlist.find(item => (item._id || item.id) === productId);
      if (product) await toggleWishlist(product);
    } catch (error) {
      console.error(error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.id) === productId);
  };

  const value = {
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
    loading,
    isAuthenticated,
    isLoaded: !authLoading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
