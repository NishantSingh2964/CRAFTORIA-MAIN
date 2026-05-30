import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_LOGO = '/logo2.png';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', to: '/collections' },
      { name: 'Best Sellers', to: '/collections' },
      { name: 'New Arrivals', to: '/collections' },
      { name: 'Gift Hampers', to: '/collections' },
      { name: 'Personalized Gifts', to: '/personalized' },
    ],
  },
  {
    title: 'Occasions',
    links: [
      { name: 'Birthday', to: '/gifts-by-occasion' },
      { name: 'Anniversary', to: '/gifts-by-occasion' },
      { name: "Valentine's Day", to: '/gifts-by-occasion' },
      { name: 'Congratulations', to: '/gifts-by-occasion' },
      { name: 'Festivals', to: '/gifts-by-occasion' },
      { name: 'Thank You', to: '/gifts-by-occasion' },
    ],
  },
  {
    title: 'Information',
    links: [
      { name: 'About Us', to: '/our-story' },
      { name: 'Delivery Info', to: '/our-story' },
      { name: 'Returns', to: '/our-story' },
      { name: 'FAQ', to: '/our-story' },
      { name: 'Contact Us', to: '/our-story' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="w-full overflow-hidden">
      <div className="site-container relative z-10 mt-12 mb-8 sm:mt-16 sm:mb-10">
        <div className="flex flex-col items-stretch justify-between gap-6 overflow-hidden rounded-xl bg-[#760000] p-5 shadow-xl sm:gap-7 sm:rounded-2xl sm:p-8 lg:flex-row lg:items-center lg:p-12">
          <div className="flex w-full min-w-0 items-start gap-4 sm:items-center sm:gap-6 lg:max-w-2xl">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white sm:flex lg:h-20 lg:w-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                <path d="M10.5 14 6 18" />
                <path d="m13.5 14 4.5 4" />
                <path d="m10.5 11 1.5 1.5" />
                <path d="m12 12.5 1.5-1.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="mb-2 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Stay Connected
              </h2>
              <p className="font-sans text-sm font-normal leading-relaxed text-red-100 sm:text-base">
                Subscribe to get exclusive offers, new arrivals and gifting inspiration straight to your inbox.
              </p>
            </div>
          </div>

          <form className="flex w-full min-w-0 shrink flex-col gap-3 sm:flex-row lg:w-[470px]">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              className="w-full min-w-0 rounded bg-white px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none sm:px-5 sm:py-4 sm:text-base"
              autoComplete="email"
              required
            />
            <button
              type="submit"
              className="action-link shrink-0 cursor-pointer rounded bg-gray-900 px-8 py-3.5 text-white transition-colors hover:bg-black sm:py-4"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/[0.08] bg-[#252830] pt-10 pb-6 sm:pt-16">
        <div className="site-container">
          <div className="mb-8 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-5 lg:gap-8">
            <div className="col-span-2 lg:col-span-2">
              <div className="mb-4 flex justify-center sm:justify-start">
                <Link to="/" className="inline-block no-underline">
                  <img
                    src={FOOTER_LOGO}
                    alt="CRAFTORIA"
                    width={320}
                    height={130}
                    className="h-auto max-h-36 w-44 object-contain sm:w-64 lg:w-80"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              </div>

              <p className="body-copy-sm mx-auto mb-6 max-w-sm text-center text-gray-400 sm:mx-0 sm:text-left">
                Forever wrapped in care - thoughtful gifts for every occasion, made with love and delivered with care.
              </p>

              <div className="flex justify-center gap-4 sm:justify-start">
                <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-red-500 hover:bg-white hover:text-red-500" aria-label="CRAFTORIA on Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-red-500 hover:bg-white hover:text-red-500" aria-label="CRAFTORIA on Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-red-500 hover:bg-white hover:text-red-500" aria-label="CRAFTORIA on Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                </a>
              </div>
            </div>

            {footerSections.map((section) => (
              <div key={section.title} className={section.title === 'Information' ? 'col-span-2 sm:col-span-1' : ''}>
                <h3 className="mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-white sm:mb-5">
                  {section.title}
                </h3>
                <ul className={section.title === 'Information' ? 'grid grid-cols-2 gap-x-6 gap-y-2.5 font-sans font-normal sm:block sm:space-y-3' : 'space-y-2.5 font-sans font-normal sm:space-y-3'}>
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.to} className="text-sm text-gray-400 transition-colors hover:text-red-500">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-6 sm:pt-8 md:flex-row">
            <p className="text-center font-sans text-xs font-normal text-gray-400 md:text-left">
              &copy; 2024 CRAFTORIA. All Rights Reserved.
            </p>
            <div className="flex gap-4 opacity-30">
              <svg className="h-5 w-8" viewBox="0 0 32 20" fill="currentColor"><rect width="32" height="20" rx="2" fill="#3e414c" /></svg>
              <svg className="h-5 w-8" viewBox="0 0 32 20" fill="currentColor"><rect width="32" height="20" rx="2" fill="#3e414c" /></svg>
              <svg className="h-5 w-8" viewBox="0 0 32 20" fill="currentColor"><rect width="32" height="20" rx="2" fill="#3e414c" /></svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
