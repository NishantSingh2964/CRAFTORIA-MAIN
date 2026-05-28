import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useClerkMount } from '../providers/LazyClerk';

const NavbarClerkAuth = lazy(() => import('./NavbarClerkAuth'));

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
  const { clerkReady, ensureClerk } = useClerkMount();
  const { cartItems } = useCart();
  const [autoSignIn, setAutoSignIn] = useState(false);

  const handleLoginClick = () => {
    setAutoSignIn(true);
    void ensureClerk();
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
              decoding="async"
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
          <div className="hidden lg:flex items-center space-x-5">

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

            {clerkReady ? (
              <Suspense fallback={null}>
                <NavbarClerkAuth
                  loginButtonClass={loginButtonClass}
                  autoSignIn={autoSignIn}
                  onAutoSignInDone={() => setAutoSignIn(false)}
                />
              </Suspense>
            ) : (
              <button type="button" onClick={handleLoginClick} className={loginButtonClass}>
                Login
              </button>
            )}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="lg:hidden flex items-center gap-4">
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
          } ${isMenuOpen ? 'max-h-96 opacity-100 shadow-xl' : 'max-h-0 opacity-0'}`}
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
            className={`flex items-center justify-center gap-4 pt-4 border-t mt-2 ${isScrolled ? 'border-white/20' : 'border-gray-200'
              }`}
          >
            {clerkReady ? (
              <Suspense fallback={null}>
                <NavbarClerkAuth
                  loginButtonClass={loginButtonClass}
                  onMobileLogin={() => setIsMenuOpen(false)}
                  autoSignIn={autoSignIn}
                  onAutoSignInDone={() => setAutoSignIn(false)}
                />
              </Suspense>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleLoginClick();
                  setIsMenuOpen(false);
                }}
                className={loginButtonClass}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
