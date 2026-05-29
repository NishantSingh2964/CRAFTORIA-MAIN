import React from 'react';
import { Link } from 'react-router-dom';
const FOOTER_LOGO = '/logo2.png';

const Footer = () => {
  return (
    <footer className="w-full overflow-hidden">
      {/* Newsletter Section */}
      <div className="site-container mt-16 mb-10 relative z-10">
        <div className="bg-[#760000] rounded-2xl p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-7 shadow-xl overflow-hidden">
          <div className="flex items-center gap-6 w-full lg:max-w-2xl min-w-0">
            <div className="hidden lg:flex w-20 h-20 rounded-full bg-white/10 items-center justify-center text-white shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="M10.5 14 6 18" /><path d="m13.5 14 4.5 4" /><path d="m10.5 11 1.5 1.5" /><path d="m12 12.5 1.5-1.5" /></svg>
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-white text-3xl font-bold tracking-tight mb-2">Stay Connected</h2>
              <p className="font-sans text-red-100 text-base font-normal leading-relaxed">Subscribe to get exclusive offers, new arrivals and gifting inspiration straight to your inbox.</p>
            </div>
          </div>
          <form className="flex flex-col sm:flex-row w-full lg:w-[470px] gap-3 shrink min-w-0">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              className="px-5 py-4 w-full min-w-0 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none text-base"
              autoComplete="email"
              required
            />
            <button type="submit" className="px-8 py-4 bg-gray-900 text-white action-link rounded hover:bg-black transition-colors shrink-0 cursor-pointer">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-[#252830] pt-16 pb-6 border-t border-white/[0.08]">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Link to="/" className="inline-block no-underline">
                  <img
                    src={FOOTER_LOGO}
                    alt="CRAFTORIA"
                    width={320}
                    height={130}
                    className="w-48 sm:w-64 lg:w-80 h-auto max-h-36 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              </div>
              <p className="body-copy-sm text-gray-400 mb-6 max-w-sm">
                Forever wrapped in care — thoughtful gifts for every occasion, made with love and delivered with care.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-white transition-all" aria-label="CRAFTORIA on Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-white transition-all" aria-label="CRAFTORIA on Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-white transition-all" aria-label="CRAFTORIA on Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-white mb-5 text-[11px] uppercase tracking-[0.18em]">Shop</h3>
              <ul className="space-y-3 font-sans font-normal">
                {[
                  { name: 'All Products', to: '/collections' },
                  { name: 'Best Sellers', to: '/collections' },
                  { name: 'New Arrivals', to: '/collections' },
                  { name: 'Gift Hampers', to: '/collections' },
                  { name: 'Personalized Gifts', to: '/personalized' }
                ].map(link => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-white mb-5 text-[11px] uppercase tracking-[0.18em]">Occasions</h3>
              <ul className="space-y-3 font-sans font-normal">
                {[
                  { name: 'Birthday', to: '/gifts-by-occasion' },
                  { name: 'Anniversary', to: '/gifts-by-occasion' },
                  { name: "Valentine's Day", to: '/gifts-by-occasion' },
                  { name: 'Congratulations', to: '/gifts-by-occasion' },
                  { name: 'Festivals', to: '/gifts-by-occasion' },
                  { name: 'Thank You', to: '/gifts-by-occasion' }
                ].map(link => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-white mb-5 text-[11px] uppercase tracking-[0.18em]">Information</h3>
              <ul className="space-y-3 font-sans font-normal">
                {[
                  { name: 'About Us', to: '/our-story' },
                  { name: 'Delivery Information', to: '/our-story' },
                  { name: 'Returns & Refunds', to: '/our-story' },
                  { name: 'FAQ', to: '/our-story' },
                  { name: 'Contact Us', to: '/our-story' }
                ].map(link => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-sans text-gray-400 text-xs text-center md:text-left font-normal">
              © 2024 CRAFTORIA. All Rights Reserved.
            </p>
            <div className="flex gap-4 opacity-30">
              <svg className="w-8 h-5" viewBox="0 0 32 20" fill="currentColor"><rect width="32" height="20" rx="2" fill="#3e414c" /></svg>
              <svg className="w-8 h-5" viewBox="0 0 32 20" fill="currentColor"><rect width="32" height="20" rx="2" fill="#3e414c" /></svg>
              <svg className="w-8 h-5" viewBox="0 0 32 20" fill="currentColor"><rect width="32" height="20" rx="2" fill="#3e414c" /></svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
