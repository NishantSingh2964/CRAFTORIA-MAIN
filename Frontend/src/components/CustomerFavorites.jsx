import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import OptimizedImage from './OptimizedImage';

const CustomerFavorites = () => {
  const { products, fetchProducts, loading } = useProducts();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  // Take the first 4 products as representative best sellers
  const displayProducts = products.slice(0, 4);

  if (loading && products.length === 0) {
    return (
      <div className="site-container py-12 text-center">
        <p className="text-gray-500 animate-pulse">Loading favorites...</p>
      </div>
    );
  }

  return (
    <section className="site-container py-12 sm:py-16 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <span className="section-eyebrow">
            Best Selling Gifts
          </span>
          <h2 className="section-title">
            Customer Favorites
          </h2>
        </div>
        <Link 
          to="/collections" 
          className="px-6 py-2.5 border border-red-200 text-red-600 action-link hover:bg-red-50 hover:border-red-600 transition-all rounded-sm whitespace-nowrap inline-block text-center no-underline"
        >
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {displayProducts.map((product) => (
          <div key={product._id} className="group cursor-pointer">
            {/* Aspect Card wrapper with hover scaling */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-gray-50 border border-gray-100 shadow-sm transition-all duration-300">
              <OptimizedImage
                src={product.image}
                alt={product.name}
                width={480}
                height={600}
                sizes="(max-width: 640px) 92vw, 280px"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
              />
              
              {/* Glassmorphic Blur Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 z-10">
                <h4 className="font-serif text-white font-semibold text-base mb-2 line-clamp-2 leading-snug">
                  {product.name}
                </h4>
                
                {/* Product Price display inside hover */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-sans text-red-400 font-extrabold text-base">₹{product.currentPrice}</span>
                  <span className="font-sans text-gray-400 line-through text-xs font-normal">₹{product.originalPrice}</span>
                </div>
                
                {/* View More Button on Card */}
                <Link 
                  to={`/product/${product._id}`} 
                  className="w-full py-2.5 px-4 bg-white text-gray-900 hover:bg-red-700 hover:text-white action-link rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm transform translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 no-underline"
                >
                  <span>View More</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>

              {/* Wishlist Icon */}
              <button
                type="button"
                className="absolute top-3.5 right-3.5 p-2 bg-white/95 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-600 hover:bg-white shadow-sm transition-all duration-300 z-20 hover:scale-105 active:scale-95"
                aria-label={`Add ${product.name} to wishlist`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
            </div>
            

          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerFavorites;
