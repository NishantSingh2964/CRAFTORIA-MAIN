import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useOccasions } from '../contexts/OccasionContext';
import hero3 from '../assets/home/hero3.png?w=1400&format=webp&quality=82';

const categoriesList = [
  'All Gifts',
  'Personalized Gifts',
  'Flowers & Bouquets',
  'Combos & Hampers',
  'Cakes',
  'Chocolates',
  'Home & Living',
  'Soft Toys',
  'Gift Cards',
  'Corporate Gifts'
];

const FilterSelect = ({ id, value, onChange, options, ariaLabel }) => (
  <div className="filter-select-wrap">
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="filter-select"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <svg
      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </div>
);

const Collections = () => {
  const { products, fetchProducts, loading: productsLoading } = useProducts();
  const { occasions, loading: occasionsLoading } = useOccasions();
  
  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  
  const occasionsOptions = useMemo(() => {
    return ['All Occasions', ...occasions.map(o => o.name)];
  }, [occasions]);

  const initialOccasion = occasionsOptions.find(
    (occ) => occ.toLowerCase() === (searchParams.get('occasion') || '').toLowerCase()
  );
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All Gifts');
  const [selectedOccasions, setSelectedOccasions] = useState(
    initialOccasion && initialOccasion !== 'All Occasions' ? [initialOccasion] : []
  );
  const [priceRange, setPriceRange] = useState(4999);
  const [sortBy, setSortBy] = useState('Popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Toggle Favorite Status
  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const getNumericPrice = (price) => parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };

  // Clear All Filters
  const clearAllFilters = () => {
    setSelectedCategory('All Gifts');
    setSelectedOccasions([]);
    setPriceRange(4999);
    setSortBy('Popularity');
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Advanced Filtration Logic matching product features to category mappings
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        if (!searchQuery) return true;
        return prod.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .filter((prod) => {
        // 1. Category filtration
        if (selectedCategory === 'All Gifts') return true;
        const catLower = (prod.category || '').toLowerCase();
        const selectedCatLower = selectedCategory.toLowerCase();
        
        // Match if category includes the selected one (e.g. "Personalised Gifts" matches "Personalized")
        if (selectedCatLower.includes('personalised') || selectedCatLower.includes('personalized')) {
          return catLower.includes('personalized') || catLower.includes('personalised');
        }
        
        return catLower.includes(selectedCatLower.replace(' gifts', '').replace(' & hampers', '').replace(' & bouquets', ''));
      })
      .filter((prod) => {
        // 2. Price Filtration
        const numericPrice = Number(prod.currentPrice) || 0;
        return numericPrice <= priceRange;
      })
      .filter((prod) => {
        // 3. Occasions Filtration
        if (selectedOccasions.length === 0) return true;
        const prodOccasions = prod.occasions || []; 
        const prodOccasionName = String(prod.occasion || '').toLowerCase(); 

        return selectedOccasions.some(occ => {
          const occLower = String(occ || '').toLowerCase();
          
          // Check in array (could be strings or populated objects)
          const matchesInArray = prodOccasions.some(o => {
            const name = typeof o === 'object' ? o?.name : o;
            return String(name || '').toLowerCase() === occLower;
          });

          return matchesInArray || prodOccasionName === occLower;
        });
      });
  }, [products, selectedCategory, selectedOccasions, priceRange, searchQuery]);

  // Sort Logic
  const sortedProducts = useMemo(() => {
    const prods = [...filteredProducts];
    if (sortBy === 'Popularity') {
      return prods.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'Price: Low to High') {
      return prods.sort((a, b) => {
        const priceA = getNumericPrice(a.currentPrice);
        const priceB = getNumericPrice(b.currentPrice);
        return priceA - priceB;
      });
    }
    if (sortBy === 'Price: High to Low') {
      return prods.sort((a, b) => {
        const priceA = getNumericPrice(a.currentPrice);
        const priceB = getNumericPrice(b.currentPrice);
        return priceB - priceA;
      });
    }
    return prods;
  }, [filteredProducts, sortBy]);

  // Pagination Logic
  const itemsPerPage = 12;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;

  const selectedOccasionValue =
    selectedOccasions.length === 0 ? 'All Occasions' : selectedOccasions[0];

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16">
      
      {/* Top Luxury Static Present Banner — EXACT UI style but more compact */}
      <div className="relative min-h-[500px] sm:min-h-[520px] flex items-center overflow-hidden bg-white">
        {/* Full-bleed Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={hero3} 
            alt=""
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/5 to-transparent pointer-events-none" />
        </div>
        
        {/* Main Content Area */}
        <div className="site-container relative z-10 w-full">
          <div className="max-w-2xl lg:max-w-3xl py-8 relative">
            {/* Responsive Luxury Title with Loop-de-loop Swash */}
            <h1 className="mb-5 flex flex-col tracking-tight drop-shadow-sm">
              <span className="relative inline-block pb-4">
                <span className="font-script text-red-700 block transform -rotate-1 leading-none" style={{fontSize: 'clamp(2.8rem, 6vw, 5rem)'}}>
                  Exquisite
                </span>
                {/* Elegant Vector Scroll Flourish underneath */}
                <svg className="absolute -bottom-1 left-0 w-full max-w-[200px] h-5 text-red-700/80" viewBox="0 0 200 30" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 20,15 C 45,11 75,13 92,18 C 95,19 97,22 96,24 C 95,25 93,24 92,22 C 91,20 93,17 97,17 C 101,17 103,19 104,22 C 105,24 103,25 102,24 C 101,22 103,19 106,18 C 123,13 153,11 178,15" />
                </svg>
              </span>
              <span className="font-serif font-bold text-gray-900 block leading-tight" style={{fontSize: 'clamp(3rem, 6.5vw, 5.25rem)'}}>
                Collections
              </span>
            </h1>
            
            {/* Description Text */}
            <p className="font-sans text-base sm:text-[1.05rem] text-gray-700 mb-7 max-w-lg leading-[1.75] font-normal tracking-wide">
              Browse our signature selection of masterfully curated gifts, artisan treats, and bespoke keepsakes.
            </p>
            
            {/* Call-to-action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#catalog" className="group relative w-full sm:w-auto px-8 py-3.5 bg-red-700 text-white text-xs font-bold tracking-widest uppercase overflow-hidden rounded-sm transition-all shadow-[0_4px_15px_rgba(118,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(118,0,0,0.5)] hover:-translate-y-0.5 cursor-pointer flex items-center justify-center">
                <span className="relative z-10">View Catalog</span>
                <div className="absolute inset-0 h-full w-full bg-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </a>
              <a href="#catalog" className="group w-full sm:w-auto px-8 py-3.5 bg-white/60 backdrop-blur-md border border-gray-900 hover:border-red-600 hover:bg-white text-gray-900 hover:text-red-600 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer text-center no-underline">
                Best Sellers
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog View Container */}
      <div id="catalog" className="site-container pt-12 sm:pt-16 z-10 relative overflow-visible">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-10">
          
          {/* LEFT: sticky filter column — fixed width so it never shrinks */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-24 lg:self-start z-30">
            {/* Mobile accordion toggle button */}
            <button
              type="button"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-100 rounded-[20px] px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] font-sans font-bold text-[13px] text-gray-800 uppercase tracking-wider mb-0 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <svg className="text-[#760000]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="21" y2="21"/>
                  <line x1="4" x2="14" y1="14" y2="14"/>
                  <line x1="4" x2="18" y1="7" y2="7"/>
                  <circle cx="14" cy="7" r="2"/>
                  <circle cx="18" cy="14" r="2"/>
                  <circle cx="10" cy="21" r="2"/>
                </svg>
                {isFiltersOpen ? 'Hide Filters' : 'Filter Products'}
              </span>
              <div className="flex items-center gap-2">
                {((selectedCategory !== 'All Gifts' ? 1 : 0) + (selectedOccasions.length > 0 ? 1 : 0) + (priceRange < 4999 ? 1 : 0)) > 0 && (
                  <span className="bg-[#760000] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {(selectedCategory !== 'All Gifts' ? 1 : 0) + (selectedOccasions.length > 0 ? 1 : 0) + (priceRange < 4999 ? 1 : 0)}
                  </span>
                )}
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </button>

            <aside className={`filter-panel mt-3 lg:mt-0 ${isFiltersOpen ? 'block' : 'hidden'} lg:block transition-all duration-300`}>
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-5 mb-6">
                <div>
                  <h2 className="filter-panel-title">Filters</h2>
                  <p className="filter-panel-subtitle">Refine your gift search</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setIsFiltersOpen(false);
                  }}
                  className="filter-clear-btn mt-1"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="filter-section-label" htmlFor="filter-category">
                    Category
                  </label>
                  <FilterSelect
                    id="filter-category"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    options={categoriesList.map((cat) => ({ value: cat, label: cat }))}
                    ariaLabel="Filter by category"
                  />
                </div>

                <div>
                  <label className="filter-section-label" htmlFor="filter-occasion">
                    Occasion
                  </label>
                  <FilterSelect
                    id="filter-occasion"
                    value={selectedOccasionValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedOccasions(value === 'All Occasions' ? [] : [value]);
                      setCurrentPage(1);
                    }}
                    options={occasionsOptions.map((occ) => ({ value: occ, label: occ }))}
                    ariaLabel="Filter by occasion"
                  />
                </div>

                <div className="pt-1">
                  <label className="filter-section-label">Price range</label>
                  <div className="space-y-3 px-0.5">
                    <input
                      type="range"
                      min={199}
                      max={4999}
                      value={priceRange}
                      onChange={(e) => {
                        setPriceRange(parseInt(e.target.value, 10));
                        setCurrentPage(1);
                      }}
                      className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#760000]"
                      aria-label="Maximum price"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className="filter-price-bound">₹199</span>
                      <span className="filter-price-badge">Up to ₹{priceRange.toLocaleString('en-IN')}</span>
                      <span className="filter-price-bound">₹4,999+</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="filter-section-label" htmlFor="filter-sort">
                    Sort by
                  </label>
                  <FilterSelect
                    id="filter-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    options={[
                      { value: 'Popularity', label: 'Popularity' },
                      { value: 'Price: Low to High', label: 'Price: Low to High' },
                      { value: 'Price: High to Low', label: 'Price: High to Low' },
                    ]}
                    ariaLabel="Sort products"
                  />
                </div>
              </div>
            </aside>
          </div>

          {/* RIGHT: products */}
          <div className="flex-1 min-w-0 w-full">
            
            {/* Search & sort bar */}
            <div className="bg-white border border-gray-100/80 rounded-[20px] sm:rounded-[24px] px-4 sm:px-6 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row flex-1 gap-2.5 min-w-0">
                <div className="relative flex-1 min-w-0">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    id="catalog-search"
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search gifts by name..."
                    className="w-full font-sans bg-gray-50 border border-gray-200/85 rounded-xl pl-11 pr-4 py-3 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#760000]/30 focus:border-[#760000] transition-all"
                    aria-label="Search gifts by name"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 px-6 py-3 bg-[#760000] text-white font-sans font-bold text-[11px] uppercase tracking-[0.14em] rounded-xl hover:bg-[#5e0000] transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  Search
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto lg:shrink-0">
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-red-50 border border-red-100/60 text-[#760000] font-sans font-semibold text-[11px] rounded-full tracking-wide">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
                {selectedCategory !== 'All Gifts' && (
                  <span className="inline-flex items-center px-3 py-1 bg-red-50 border border-red-100/60 text-[#760000] font-sans font-semibold text-[11px] rounded-full tracking-wide shadow-sm">
                    {selectedCategory}
                  </span>
                )}
                <div className="flex items-center gap-2.5 w-full lg:w-auto ml-auto lg:ml-0">
                  {/* <span className="font-sans text-gray-400 font-medium text-[12px] uppercase tracking-widest">Sort</span> */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full lg:w-auto font-sans bg-gray-50 hover:bg-gray-100/80 border border-gray-200/85 rounded-xl px-4 py-3 text-[13px] text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#760000]/30 focus:border-[#760000] transition-all shadow-sm cursor-pointer"
                    aria-label="Sort products"
                  >
                    <option value="Popularity">Popularity</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {paginatedProducts.map((prod) => (
                <article key={prod._id} className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full">
                  {/* Square Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 p-3.5">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover rounded-[22px] transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Heart/Wishlist Button toggling with state */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(prod._id); }}
                      className="absolute top-5 right-5 p-2.5 bg-white rounded-full shadow-md hover:scale-110 active:scale-95 transition-all duration-300 z-20 cursor-pointer"
                      type="button"
                      aria-label={`${favorites[prod._id] ? 'Remove' : 'Add'} ${prod.name} ${favorites[prod._id] ? 'from' : 'to'} wishlist`}
                      aria-pressed={Boolean(favorites[prod._id])}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill={favorites[prod._id] ? "#760000" : "none"} 
                        stroke={favorites[prod._id] ? "#760000" : "#9ca3af"} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="transition-colors duration-300"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-serif font-semibold text-[15px] sm:text-base text-gray-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-[#760000] transition-colors duration-300">
                      {prod.name}
                    </h3>
                    
                    {/* Price details */}
                    <div className="flex items-center gap-2.5 mb-5 mt-auto">
                      <span className="font-sans text-[#760000] font-extrabold text-[15px] sm:text-base">₹{prod.currentPrice}</span>
                      {Number(prod.originalPrice) > Number(prod.currentPrice) && (
                        <>
                          <span className="font-sans text-gray-400 line-through text-[12px] sm:text-[13px] font-normal whitespace-nowrap">₹{prod.originalPrice}</span>
                          <span className="font-sans text-red-600 font-bold text-[10px] sm:text-[11px] bg-red-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                            {Math.round(((Number(prod.originalPrice) - Number(prod.currentPrice)) / Number(prod.originalPrice)) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link to={`/product/${prod._id}`} className="w-full py-3 border border-red-500/25 text-[#760000] font-sans font-bold text-[11px] uppercase tracking-[0.15em] rounded-xl hover:bg-[#760000] hover:text-white hover:border-[#760000] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md text-center block no-underline">
                      View More
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {paginatedProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h3 className="text-lg font-serif font-bold text-gray-800 mb-1">No Products Found</h3>
                <p className="text-gray-400 text-xs font-light">Try adjusting your filters or search criteria to reveal choices.</p>
              </div>
            )}

            {/* Figma-Matched Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2.5 mt-16 pt-6 border-t border-gray-100">
                
                {/* Prev */}
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  type="button"
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pNum = index + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-[#760000] text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      type="button"
                      aria-label={`Go to page ${pNum}`}
                      aria-current={currentPage === pNum ? 'page' : undefined}
                    >
                      {pNum}
                    </button>
                  );
                })}

                {/* Next */}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  type="button"
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Trust Indicators Features Banner exactly replicating Figma */}
      <div className="site-container mt-16 sm:mt-20 z-10 relative">
        <div className="bg-[#fcfbf9] border border-gray-100 rounded-[24px] py-8 px-4 sm:px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-8 lg:gap-y-0">
          
          {/* Item 1 */}
          <div className="flex flex-col items-center text-center px-2 relative lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:w-[1px] lg:after:h-10 lg:after:bg-gray-200 lg:last:after:hidden">
            <div className="w-10 h-10 rounded-full bg-[#fdfcfb] border border-gray-100 flex items-center justify-center text-[#760000] mb-3.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H4v4"/><rect width="18" height="12" x="3" y="8" rx="2"/><path d="M12 2v20"/><path d="M12 8H8a2 2 0 0 1-2-2 2 2 0 0 1 2-2h4"/><path d="M12 8h4a2 2 0 0 0 2-2 2 2 0 0 0-2-2h-4"/></svg>
            </div>
            <h4 className="text-gray-900 font-bold text-[11px] sm:text-xs tracking-wide mb-1 font-sans">
              Premium Quality
            </h4>
            <p className="text-gray-400 text-[10px] font-light leading-relaxed max-w-[140px] mx-auto">
              Handpicked with care
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center text-center px-2 relative lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:w-[1px] lg:after:h-10 lg:after:bg-gray-200 lg:last:after:hidden">
            <div className="w-10 h-10 rounded-full bg-[#fdfcfb] border border-gray-100 flex items-center justify-center text-[#760000] mb-3.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <h4 className="text-gray-900 font-bold text-[11px] sm:text-xs tracking-wide mb-1 font-sans">
              Secure Payments
            </h4>
            <p className="text-gray-400 text-[10px] font-light leading-relaxed max-w-[140px] mx-auto">
              Safe & encrypted checkout
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center text-center px-2 relative lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:w-[1px] lg:after:h-10 lg:after:bg-gray-200 lg:last:after:hidden">
            <div className="w-10 h-10 rounded-full bg-[#fdfcfb] border border-gray-100 flex items-center justify-center text-[#760000] mb-3.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            </div>
            <h4 className="text-gray-900 font-bold text-[11px] sm:text-xs tracking-wide mb-1 font-sans">
              Express Delivery
            </h4>
            <p className="text-gray-400 text-[10px] font-light leading-relaxed max-w-[140px] mx-auto">
              On-time, every time
            </p>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center text-center px-2 relative lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:w-[1px] lg:after:h-10 lg:after:bg-gray-200 lg:last:after:hidden">
            <div className="w-10 h-10 rounded-full bg-[#fdfcfb] border border-gray-100 flex items-center justify-center text-[#760000] mb-3.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </div>
            <h4 className="text-gray-900 font-bold text-[11px] sm:text-xs tracking-wide mb-1 font-sans">
              Easy Returns
            </h4>
            <p className="text-gray-400 text-[10px] font-light leading-relaxed max-w-[140px] mx-auto">
              Hassle-free returns
            </p>
          </div>

          {/* Item 5 */}
          <div className="flex flex-col items-center text-center px-2 relative col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-full bg-[#fdfcfb] border border-gray-100 flex items-center justify-center text-[#760000] mb-3.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h4 className="text-gray-900 font-bold text-[11px] sm:text-xs tracking-wide mb-1 font-sans">
              Customer Support
            </h4>
            <p className="text-gray-400 text-[10px] font-light leading-relaxed max-w-[140px] mx-auto">
              We're here to help
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Collections;
