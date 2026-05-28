import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    { 
      name: 'For Her', 
      desc: 'Express your love',
      to: '/collections?occasion=Anniversary',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="4" rx="1"/>
          <path d="M12 8v13"/>
          <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
        </svg>
      )
    },
    { 
      name: 'For Him', 
      desc: 'Unique & thoughtful',
      to: '/collections?occasion=Father%27s%20Day',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
        </svg>
      )
    },
    { 
      name: 'Birthdays', 
      desc: 'Make it special',
      to: '/collections?occasion=Birthday',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/>
          <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/>
          <path d="M2 21h20"/>
          <path d="M7 8v3"/>
          <path d="M12 8v3"/>
          <path d="M17 8v3"/>
          <path d="M7 4h.01"/>
          <path d="M12 4h.01"/>
          <path d="M17 4h.01"/>
        </svg>
      )
    },
    { 
      name: 'Anniversary', 
      desc: 'Celebrate love',
      to: '/collections?occasion=Anniversary',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="15" r="4"/>
          <circle cx="16" cy="15" r="4"/>
          <path d="M10.8 12.1a5 5 0 0 0-4.7-6.2c-2.4-.2-4.5 1.5-4.9 3.9-.2 1.4.3 2.7 1.3 3.6"/>
          <path d="M13.2 12.1a5 5 0 0 1 4.7-6.2c2.4-.2 4.5 1.5 4.9 3.9.2 1.4-.3 2.7-1.3 3.6"/>
        </svg>
      )
    },
    { 
      name: 'Corporate Gifts', 
      desc: 'Strengthen bonds',
      to: '/collections',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
          <path d="M9 22v-4h6v4"/>
          <path d="M8 6h.01"/>
          <path d="M16 6h.01"/>
          <path d="M12 6h.01"/>
          <path d="M12 10h.01"/>
          <path d="M12 14h.01"/>
          <path d="M16 10h.01"/>
          <path d="M16 14h.01"/>
          <path d="M8 10h.01"/>
          <path d="M8 14h.01"/>
        </svg>
      )
    },
    { 
      name: 'View All', 
      desc: 'Explore more',
      to: '/collections',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m12 8 4 4-4 4"/>
          <path d="M8 12h8"/>
        </svg>
      )
    },
  ];

  return (
    <section className="relative z-20 site-container -mt-20 mb-20 hidden md:block">
      <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.01)] border border-white/60 p-6 lg:p-8 hover:shadow-[0_30px_70px_rgba(118,0,0,0.07)] hover:border-red-200/40 transition-all duration-500">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 lg:gap-y-0">
          {categories.map((cat, index) => (
            <Link 
              key={cat.name} 
              to={cat.to}
              className={`relative flex items-center gap-4 group cursor-pointer transition-all duration-300 px-2 sm:px-4 ${
                index !== 0 ? 'lg:pl-6' : ''
              }`}
            >
              {/* Icon Container with Custom Interactions */}
              <div className={`text-[#760000] p-3.5 bg-red-50/50 rounded-2xl group-hover:bg-[#760000] group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-[0_10px_25px_rgba(118,0,0,0.25)] transform group-hover:-translate-y-1.5 duration-500 ease-out shrink-0 ${
                cat.name === 'View All' ? 'group-hover:rotate-45' : ''
              }`}>
                {cat.icon}
              </div>
              
              {/* Text Container with Slide-Right Transition */}
              <div className="transform group-hover:translate-x-1 transition-transform duration-500 ease-out">
                <h4 className="font-heading text-gray-900 font-semibold text-[13px] tracking-[0.04em] mb-0.5 group-hover:text-[#760000] transition-colors duration-300">
                  {cat.name}
                </h4>
                <p className="font-sans text-gray-500 text-xs font-normal group-hover:text-gray-700 transition-colors duration-300">
                  {cat.desc}
                </p>
              </div>
 
              {/* Elegant Vertical Divider (Capsule Gradient-Fade) */}
              {index < categories.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1.5px] h-10 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
