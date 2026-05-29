import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useWishlist } from '../contexts/WishlistContext';
import OptimizedImage from './OptimizedImage';

const CustomerFavorites = () => {
  const { products, fetchProducts, loading } = useProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();

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
          <article key={product._id} className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full">
            {/* Square Image container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 p-3.5">
              <OptimizedImage
                src={product.image}
                alt={product.name}
                width={480}
                height={360}
                className="w-full h-full object-cover rounded-[22px] transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Wishlist Icon */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                className={`absolute top-5 right-5 p-2.5 rounded-full shadow-md transition-all duration-300 z-20 hover:scale-110 active:scale-95 ${
                  isInWishlist(product._id) ? 'bg-white text-red-600' : 'bg-white/95 backdrop-blur-sm text-gray-400 hover:text-red-700 hover:bg-white'
                }`}
                aria-label={`${isInWishlist(product._id) ? 'Remove' : 'Add'} ${product.name} to wishlist`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill={isInWishlist(product._id) ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </button>
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-serif font-semibold text-[15px] sm:text-base text-gray-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-[#760000] transition-colors duration-300 text-left">
                {product.name}
              </h3>
              
              {/* Price details */}
              <div className="flex items-center gap-2.5 mb-5 mt-auto">
                <span className="font-sans text-[#760000] font-extrabold text-[15px] sm:text-base">₹{product.currentPrice}</span>
                {Number(product.originalPrice) > Number(product.currentPrice) && (
                  <>
                    <span className="font-sans text-gray-400 line-through text-[12px] sm:text-[13px] font-normal whitespace-nowrap">₹{product.originalPrice}</span>
                    <span className="font-sans text-red-600 font-bold text-[10px] sm:text-[11px] bg-red-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                      {Math.round(((Number(product.originalPrice) - Number(product.currentPrice)) / Number(product.originalPrice)) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* CTA Button */}
              <Link to={`/product/${product._id}`} className="w-full py-3 border border-red-500/25 text-[#760000] font-sans font-bold text-[11px] uppercase tracking-[0.15em] rounded-xl hover:bg-[#760000] hover:text-white hover:border-[#760000] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md text-center block no-underline">
                View More
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CustomerFavorites;
