import React from 'react';
import { Link } from 'react-router-dom';
import image1 from '../assets/home/image1.png?w=480&format=webp&quality=70';
import image2 from '../assets/home/image2.png?w=440&format=webp&quality=52';
import image3 from '../assets/home/image3.png?w=480&format=webp&quality=68';

const collections = [
  {
    id: 1,
    name: 'Luxury Hampers',
    description: 'Thoughtful boxes with snacks, candles, florals, and keepsakes.',
    action: 'Shop hampers',
    to: '/collections',
    image: image1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Personalized Gifts',
    description: 'Mugs, cushions, plaques, frames, and name-based keepsakes.',
    action: 'Customize now',
    to: '/personalized',
    image: image2,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Corporate Gifting',
    description: 'Elegant bulk gifts for teams, clients, launches, and festivals.',
    action: 'Request quote',
    to: '/gifts-by-occasion',
    image: image3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Features = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="site-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-12 sm:mb-14">
          <div className="max-w-2xl">
            <span className="section-eyebrow">🎁 Curated For Gifting</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight mt-3">
              <span className="text-gray-900">Featured </span>
              <span className="text-[#760000]">Collections</span>
            </h2>
            <p className="font-sans text-gray-500 text-base sm:text-[17px] leading-relaxed mt-4 max-w-xl">
              Handpicked gifts for every occasion, curated with love and crafted to make every moment
              special.
            </p>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 shrink-0 self-start lg:mt-12 px-6 py-2.5 rounded-md border border-[#760000] text-[#760000] font-sans text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            View all collections
            <ArrowIcon />
          </Link>
        </div>

        {/* Collection cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {collections.map((col) => (
            <article
              key={col.id}
              className="group relative flex flex-col rounded-2xl bg-white border border-gray-100 p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(118,0,0,0.1)] transition-shadow duration-300"
            >
              <div className="relative mb-2">
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Icon badge — overlaps bottom-left of image */}
                <div
                  className="absolute -bottom-5 left-4 sm:left-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-[#760000] text-[#760000] shadow-sm"
                  aria-hidden="true"
                >
                  {col.icon}
                </div>

              </div>

              <div className="pt-7 px-1 sm:px-2 pb-2 flex flex-col flex-1">
                <h3 className="font-serif text-xl sm:text-[1.35rem] font-bold text-gray-900 leading-snug">
                  {col.name}
                </h3>
                <p className="font-sans text-sm sm:text-[15px] text-gray-500 leading-relaxed mt-2.5 flex-1">
                  {col.description}
                </p>
                <Link
                  to={col.to}
                  className="mt-5 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#760000] hover:text-[#5e0000] transition-colors w-fit"
                >
                  {col.action}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
