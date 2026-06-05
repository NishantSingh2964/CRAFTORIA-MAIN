import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import hero2 from '../assets/home/hero2.png?w=1400&format=webp&quality=82';
import { formatPrice } from '../utils/formatPrice';
import OrderSummary from '../components/OrderSummary';
import toast from 'react-hot-toast';

const Icon = ({ children, className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const parsePrice = (price) => parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0;

const trustItems = [
  {
    title: 'Premium Quality',
    text: 'Handpicked with care',
    icon: (
      <path d="M20 12V8H4v4" />
    ),
  },
  {
    title: 'Secure Payments',
    text: 'Safe & encrypted checkout',
    icon: <><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></>,
  },
  {
    title: 'Express Delivery',
    text: 'On-time, every time',
    icon: <><rect width="16" height="13" x="2" y="6" rx="2" /><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>,
  },
  {
    title: 'Easy Returns',
    text: 'Hassle-free returns',
    icon: <><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></>,
  },
  {
    title: 'Customer Support',
    text: "We're here to help",
    icon: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>,
  },
];

const Cart = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { cartItems, removeFromCart, updateQuantity, clearCart, addToCart } = useCart();
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  const recommendedProducts = useMemo(() => {
    const cartIds = new Set(cartItems.map((item) => item._id || item.id));
    return products.filter((p) => !cartIds.has(p._id || p.id)).slice(0, 4);
  }, [cartItems, products]);

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#fafafa]">
        <p className="font-sans text-gray-500 text-sm">Loading your cart...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="bg-[#fafafa] min-h-screen pb-4">
      {/* Hero */}
      <section className="relative h-[480px] sm:h-[520px] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img
            src={hero2}
            alt="Your Cart"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/5 to-transparent pointer-events-none" />
        </div>
        <div className="site-container relative z-10 w-full">
          <div className="max-w-2xl lg:max-w-3xl py-8 relative">
            <h1 className="mb-5 flex flex-col tracking-tight drop-shadow-sm">
              <span className="relative inline-block pb-4">
                <span
                  className="font-script text-red-700 block transform -rotate-1 leading-none"
                  style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}
                >
                  Shopping
                </span>
                <svg
                  className="absolute -bottom-1 left-0 w-full max-w-[200px] h-5 text-red-700/80"
                  viewBox="0 0 200 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 20,15 C 45,11 75,13 92,18 C 95,19 97,22 96,24 C 95,25 93,24 92,22 C 91,20 93,17 97,17 C 101,17 103,19 104,22 C 105,24 103,25 102,24 C 101,22 103,19 106,18 C 123,13 153,11 178,15" />
                </svg>
              </span>
              <span
                className="font-serif font-bold text-gray-900 block leading-tight"
                style={{ fontSize: 'clamp(3rem, 6.5vw, 5.25rem)' }}
              >
                Your Cart
              </span>
            </h1>
            <p className="font-sans text-base sm:text-[1.05rem] text-gray-700 max-w-lg leading-[1.75] font-normal tracking-wide">
              Review your items and proceed to checkout
            </p>
          </div>
        </div>
      </section>

      {/* Main cart */}
      <section className="site-container py-10 sm:py-14">
        {cartItems.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 sm:p-14 lg:p-20 min-h-[320px] flex flex-col items-center justify-center text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#760000]">
              <Icon className="h-8 w-8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </Icon>
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="body-copy-sm mb-8 max-w-md mx-auto">
              Discover thoughtful gifts and add something special to your cart.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#760000] text-[#760000] action-link rounded hover:bg-red-50 transition"
            >
              <Icon className="h-4 w-4">
                <path d="m15 18-6-6 6-6" />
              </Icon>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 xl:gap-10 items-start">
            {/* Product list */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-[1fr_100px_120px_90px_40px] gap-4 px-6 py-4 border-b border-gray-100 bg-[#fafafa]">
                {['PRODUCT', 'PRICE', 'QUANTITY', 'TOTAL'].map((label) => (
                  <span
                    key={label}
                    className={`micro-label text-gray-400 ${label === 'TOTAL' ? 'text-right' : ''} ${label === 'PRICE' || label === 'QUANTITY' ? 'text-center' : ''}`}
                  >
                    {label}
                  </span>
                ))}
                <span />
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const itemId = item.id || item._id;
                  const lineTotal = parsePrice(item.currentPrice) * item.quantity;
                  return (
                    <div
                      key={itemId}
                      className="grid grid-cols-1 md:grid-cols-[1fr_100px_120px_90px_40px] gap-4 md:gap-4 items-center px-5 sm:px-6 py-8"
                    >
                      <div className="flex gap-5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-md border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif font-semibold text-[15px] text-gray-900 leading-snug mb-1.5 line-clamp-2">
                            {item.name}
                          </h3>
                          <span className="inline-block text-[11px] font-semibold text-emerald-600 mb-2">
                            In Stock
                          </span>
                          <button
                            type="button"
                            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#760000] hover:underline mb-2"
                          >
                            <Icon className="h-3.5 w-3.5">
                              <path d="M20 12V8H4v4" />
                              <path d="M12 22V7" />
                              <path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5c0 1.4 2 2.5 2 2.5Z" />
                              <path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5c0 1.4-2 2.5-2 2.5Z" />
                            </Icon>
                            Add Gift Note
                          </button>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                            <button
                              type="button"
                              onClick={() => removeFromCart(itemId)}
                              className="hover:text-[#760000] transition"
                            >
                              Remove
                            </button>
                            <span>|</span>
                            <button type="button" className="hover:text-[#760000] transition">
                              Move to Wishlist
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="md:text-center flex md:block items-center justify-between">
                        <span className="md:hidden micro-label text-gray-400">Price</span>
                        <div>
                          <p className="font-sans text-[#760000] font-bold text-sm">
                            {formatPrice(item.currentPrice)}
                          </p>
                          <p className="font-sans text-gray-400 text-xs line-through">
                            {formatPrice(item.originalPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="flex md:justify-center items-center justify-between">
                        <span className="md:hidden micro-label text-gray-400">Quantity</span>
                        <div className="inline-grid grid-cols-3 h-10 w-[110px] rounded border border-gray-200 overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, Math.max(1, item.quantity - 1))}
                            className="text-[#760000] font-bold hover:bg-red-50 text-lg"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="flex items-center justify-center text-sm font-bold border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="text-[#760000] font-bold hover:bg-red-50 text-lg"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end md:text-right">
                        <span className="md:hidden micro-label text-gray-400">Total</span>
                        <p className="font-sans font-bold text-gray-900">{formatPrice(lineTotal)}</p>
                      </div>

                      <div className="flex md:justify-center -mt-2 md:mt-0">
                        <button
                          type="button"
                          onClick={() => removeFromCart(itemId)}
                          className="text-gray-300 hover:text-[#760000] transition ml-auto md:ml-0"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Icon className="h-5 w-5">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </Icon>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 sm:px-6 py-5 border-t border-gray-100 bg-[#fafafa]">
                <Link
                  to="/collections"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#760000] text-[#760000] action-link rounded hover:bg-white transition bg-white"
                >
                  <Icon className="h-4 w-4">
                    <path d="m15 18-6-6 6-6" />
                  </Icon>
                  Continue Shopping
                </Link>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-600 action-link rounded hover:border-[#760000] hover:text-[#760000] transition bg-white"
                >
                  <Icon className="h-4 w-4">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </Icon>
                  Clear Cart
                </button>
              </div>
            </div>

            <OrderSummary
              cartItems={cartItems}
              primaryLabel="Proceed to Checkout"
              primaryTo="/checkout"
            />
          </div>
        )}
      </section>

      {/* You May Also Like */}
      <section className="site-container pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            You May Also Like
          </h2>
          <Link
            to="/collections"
            className="action-link text-[#760000] hover:underline whitespace-nowrap flex items-center gap-1"
          >
            View All
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {recommendedProducts.map((item) => (
            <div key={item._id || item.id} className="group">
              <Link to={`/product/${item._id || item.id}`} className="block">
                <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-md overflow-hidden bg-red-50 mb-3 sm:mb-5 border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white text-[#760000] flex items-center justify-center shadow-md hover:scale-105 transition"
                    aria-label="Add to wishlist"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </Icon>
                  </button>
                </div>
                <h3 className="card-title text-[13px] sm:text-base mb-1.5 line-clamp-2">{item.name}</h3>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                  <span className="font-sans text-[#760000] font-extrabold text-xs sm:text-sm">
                    {formatPrice(item.currentPrice)}
                  </span>
                  <span className="font-sans text-gray-400 line-through text-[10px] sm:text-xs">
                    {formatPrice(item.originalPrice)}
                  </span>
                </div>
              </Link>
              {(() => {
                const isInCart = cartItems.some(cItem => (cItem._id || cItem.id) === (item._id || item.id));
                return (
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className={`w-full rounded-md py-2.5 sm:py-3 text-center font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      isInCart
                        ? "bg-[#fff5f5] text-[#760000] border border-[#760000]/30"
                        : "bg-white border border-[#760000] text-[#760000] hover:bg-[#760000] hover:text-white"
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        In Cart
                      </>
                    ) : (
                      "Add To Cart"
                    )}
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="site-container pb-16">
        <div className="bg-[#fcfbf9] border border-gray-100 rounded-[24px] py-8 px-4 sm:px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-8 lg:gap-y-0">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center px-2 relative ${
                index === 4 ? 'col-span-2 md:col-span-1' : ''
              } ${
                index < trustItems.length - 1
                  ? "lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:w-px lg:after:h-10 lg:after:bg-gray-200"
                  : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#fdfcfb] border border-gray-100 flex items-center justify-center text-[#760000] mb-3.5 shadow-sm">
                <Icon className="h-[18px] w-[18px]">{item.icon}</Icon>
              </div>
              <h4 className="text-gray-900 font-bold text-[11px] sm:text-xs tracking-wide mb-1 font-sans">
                {item.title}
              </h4>
              <p className="text-gray-400 text-[10px] font-light leading-relaxed max-w-[140px] mx-auto">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Cart;
