import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to get ID consistently
  const getCartItemId = (item) => item?._id || item?.id;

  // Sync with backend on login
  useEffect(() => {
    const fetchCart = async () => {
      if (authLoading || !isAuthenticated) {
        setCartItems([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/cart');
        if (response.data.success) {
          setCartItems(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, authLoading]);

  const addToCart = useCallback(async (product, quantity = 1, metadata = null) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your cart', {
        icon: '🔒',
        duration: 3000
      });
      return;
    }

    const productId = product._id || product.id;
    const productModel = product.productModel ||
      (product.customizationSteps ? 'PersonalizedProduct' : 'Product');

    // Check if product is already in the cart before API call
    const alreadyInCart = cartItems.some(item => (item._id || item.id) === productId);

    try {
      const response = await api.post('/cart/add', {
        productId,
        productModel,
        quantity,
        metadata,
        name: product.name,
        price: product.price
      });

      if (response.data.success) {
        setCartItems(response.data.data);

        if (alreadyInCart) {
          toast(`${product.name} is already in cart — quantity updated!`, {
            icon: '🛒',
            duration: 3000,
            style: {
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              color: '#9a3412'
            }
          });
        } else {
          toast.success(`${product.name} added to cart`, { icon: '🛒' });
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(errorMsg);
      console.error('Add to Cart Error:', error.response?.data || error);
    }
  }, [isAuthenticated, cartItems]);

  const removeFromCart = useCallback(async (productId) => {
    if (!isAuthenticated) return;

    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      if (response.data.success) {
        setCartItems(response.data.data);
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item');
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (!isAuthenticated) return;
    if (newQuantity < 1) return;

    try {
      const response = await api.put('/cart/update', {
        productId,
        quantity: newQuantity
      });

      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.delete('/cart/clear');
      if (response.data.success) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, [isAuthenticated]);

  const value = useMemo(() => ({
    cartItems,
    cart: cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemId
  }), [cartItems, loading, addToCart, removeFromCart, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
