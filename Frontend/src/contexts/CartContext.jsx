import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const CartContext = createContext();
export { CartContext };

export const useCart = () => useContext(CartContext);

const getCartItemId = (item) => item?.id || item?._id || item?.sku || item?.name;

// Load initial cart from localStorage synchronously (lazy initializer)
const loadCart = () => {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to parse cart from localStorage', e);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  // Use lazy initializer so the initial state is read from localStorage
  // before any render — avoids the race where the sync effect fires with []
  const [cartItems, setCartItems] = useState(loadCart);

  // Persist to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const productId = getCartItemId(product);
      const existing = prev.find(item => getCartItemId(item) === productId);
      const updated = existing
        ? prev.map(item =>
            getCartItemId(item) === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { ...product, id: productId, quantity }];
      return updated;
    });
  }, []);

  const removeFromCart = useCallback(productId => {
    setCartItems(prev => prev.filter(item => getCartItemId(item) !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    setCartItems(prev =>
      prev.map(item =>
        getCartItemId(item) === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  }, []);

  const value = useMemo(() => ({
    cartItems,
    cart: cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
  }), [cartItems, addToCart, removeFromCart, clearCart, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
