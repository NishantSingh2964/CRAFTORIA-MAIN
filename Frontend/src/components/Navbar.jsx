import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, User, LogOut, LayoutDashboard } from 'lucide-react';

const LOGO_TOP = '/logo-nav.webp';
const LOGO_SCROLLED = '/logo-nav-alt.webp';

const BagIcon = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const loginButtonBase =
  'transition-colors duration-300 font-heading text-xs sm:text-sm uppercase font-semibold py-3 px-7 rounded-md shadow-sm hover:shadow-md';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collections', to: '/collections' },
    { name: 'Gifts by Occasion', to: '/gifts-by-occasion' },
    { name: 'Personalized', to: '/personalized' },
    { name: 'Our Story', to: '/our-story' },
  ];

  const cartCount = cartItems ? cartItems.length : 0;
  const wishlistCount = wishlist ? wishlist.length : 0;

  const loginButtonClass = isScrolled
    ? `${loginButtonBase} bg-white text-[#760000] hover:bg-red-50`
    : `${loginButtonBase} bg-red-600 text-white hover:bg-red-700`;

  const navLinkClass = ({ isActive }) =>
    `relative font-heading font-semibold text-[11px] tracking-[0.14em] uppercase transition-all duration-300 group drop-shadow-sm ${isScrolled
      ? isActive
        ? 'text-white'
        : 'text-white/85 hover:text-white'
      : isActive
        ? 'text-red-600'
        : 'text-gray-900 hover:text-red-700'
    }`;

  const navUnderlineClass = isScrolled ? 'bg-white' : 'bg-red-600';

  const iconClass = isScrolled
    ? 'text-white hover:text-red-100 transition-colors duration-300'
    : 'text-gray-900 hover:text-red-600 transition-colors duration-300';

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
          ? 'bg-[#760000] border-[#5e0000] py-3 shadow-md'
          : 'bg-transparent border-transparent pt-4 pb-4'
        }`}
    >
      <div className="site-container">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="inline-block cursor-pointer group no-underline shrink-0 leading-none">
            <img
              src={isScrolled ? LOGO_SCROLLED : LOGO_TOP}
              alt="CRAFTORIA"
              width={128}
              height={52}
              className={`block h-auto object-contain object-left transition-opacity duration-300 ${isScrolled ? 'w-32 sm:w-44 md:w-56 max-h-14' : 'w-24 sm:w-32'
                }`}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.to} className={navLinkClass}>
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-0 h-[2px] ${navUnderlineClass} transition-all duration-300 group-hover:w-full`}></span>
              </NavLink>
            ))}
          </div>

          {/* Right-side icons (desktop) */}
          <div className="hidden lg:flex items-center space-x-6">

            {/* Wishlist icon */}
            <Link to="/wishlist" className={`relative ${iconClass}`} aria-label={`Wishlist with ${wishlistCount} item${wishlistCount === 1 ? '' : 's'}`}>
              <Heart size={21} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow" aria-hidden="true">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart icon */}
            <Link to="/cart" className={`relative ${iconClass}`} aria-label={`Cart with ${cartCount} item${cartCount === 1 ? '' : 's'}`}>
              <BagIcon />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className={`h-6 w-px ${isScrolled ? 'bg-white/30' : 'bg-gray-400'}`}></div>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className={`h-9 w-9 rounded-full border-2 flex items-center justify-center overflow-hidden ${isScrolled ? 'border-white/50' : 'border-[#760000]/20'}`}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className={`h-full w-full flex items-center justify-center font-bold text-sm ${isScrolled ? 'bg-white text-[#760000]' : 'bg-[#760000] text-white'}`}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </Link>
                    
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    
                    <Link
                      to="/my-orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <BagIcon className="w-4 h-4" /> My Orders
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#760000] hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={loginButtonClass}>
                Login
              </Link>
            )}
          </div>

          {/* Mobile: wishlist + cart + hamburger */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Mobile wishlist icon */}
            <Link to="/wishlist" className={`relative ${iconClass}`} aria-label={`Wishlist with ${wishlistCount} item${wishlistCount === 1 ? '' : 's'}`}>
              <Heart size={21} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow" aria-hidden="true">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile cart icon */}
            <Link to="/cart" className={`relative ${iconClass}`} aria-label={`Cart with ${cartCount} item${cartCount === 1 ? '' : 's'}`}>
              <BagIcon />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${iconClass} focus:outline-none p-1`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 border-t ${isScrolled ? 'bg-[#760000] border-[#5e0000]' : 'bg-white/95 backdrop-blur-md border-gray-100'
          } ${isMenuOpen ? 'max-h-[80vh] opacity-100 shadow-xl overflow-y-auto' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 font-heading text-[12px] font-semibold tracking-[0.12em] uppercase rounded-lg transition-colors ${isScrolled
                  ? isActive
                    ? 'text-white bg-white/15 font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  : isActive
                    ? 'text-red-600 bg-red-50/50 font-bold'
                    : 'text-gray-800 hover:text-red-600 hover:bg-red-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div
            className={`flex flex-col items-center gap-4 pt-4 border-t mt-2 ${isScrolled ? 'border-white/20' : 'border-gray-200'
              }`}
          >
            {isAuthenticated ? (
              <div className="w-full space-y-2">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isScrolled ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'}`}>
                  <div className="h-8 w-8 rounded-full bg-[#760000] flex items-center justify-center overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="avatar" /> : <User size={16} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold truncate">{user.name || 'User'}</p>
                    <p className="text-[10px] opacity-70 truncate">{user.email}</p>
                  </div>
                </div>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full text-center py-3 text-xs font-bold uppercase tracking-wider rounded-lg ${isScrolled ? 'bg-white text-[#760000]' : 'bg-[#760000] text-white'}`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <Link
                  to="/my-orders"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-center py-3 text-xs font-bold uppercase tracking-wider rounded-lg border ${isScrolled ? 'border-white text-white' : 'border-[#760000] text-[#760000]'}`}
                >
                  My Orders
                </Link>
                
                <button
                  onClick={handleLogout}
                  className={`block w-full text-center py-3 text-xs font-bold uppercase tracking-wider rounded-lg border border-transparent ${isScrolled ? 'text-red-200 hover:text-red-100' : 'text-[#760000] hover:bg-red-50'}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={loginButtonClass}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
