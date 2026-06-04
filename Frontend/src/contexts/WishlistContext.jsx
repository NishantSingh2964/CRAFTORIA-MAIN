import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useClerkMount } from '../providers/LazyClerk';

const WishlistContext = createContext();

/**
 * Inner component that is ONLY rendered once Clerk is guaranteed to be loaded.
 * This allows us to safely use useAuth().
 */
const WishlistManager = ({ children, setWishlist, wishlist, setLoading, loading }) => {
  const { isSignedIn, isLoaded } = useAuth();

  // Fetch wishlist from backend when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      // If Clerk is not loaded or user not signed in, reset local wishlist
      if (!isLoaded || !isSignedIn) {
        setWishlist([]); 
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/wishlist');
        if (response.data.success) {
          const flattenedWishlist = response.data.data.map(item => ({
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
  }, [isSignedIn, isLoaded]);

  const toggleWishlist = async (product, explicitModel = null) => {
    if (!isSignedIn) {
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
    if (!isSignedIn) return;
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

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

/**
 * Public Provider that handles the LazyClerk loading state.
 */
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { clerkReady } = useClerkMount();

  // If Clerk isn't ready yet, we provide a placeholder context 
  // that prevents crashes but allows guest UI to render.
  if (!clerkReady) {
    const guestValue = {
      wishlist: [],
      toggleWishlist: () => {
        toast.error('Please login to use wishlist', { icon: '🔒' });
      },
      removeFromWishlist: () => {},
      isInWishlist: () => false,
      loading: false
    };

    return (
      <WishlistContext.Provider value={guestValue}>
        {children}
      </WishlistContext.Provider>
    );
  }

  // Once Clerk is ready, we render the WishlistManager 
  // which can safely use Clerk hooks.
  return (
    <WishlistManager 
      setWishlist={setWishlist} 
      wishlist={wishlist} 
      setLoading={setLoading} 
      loading={loading}
    >
      {children}
    </WishlistManager>
  );
};

export const useWishlist = () => useContext(WishlistContext);
