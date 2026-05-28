import React from 'react';
import { Link } from 'react-router-dom';
import imagesection from '../assets/home/imagesection.png?w=960&format=webp&quality=76';

const PromoBanner = () => {
  return (
    <section className="site-container py-8">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden text-white shadow-2xl min-h-[330px] md:min-h-[400px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={imagesection} 
            alt="" 
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-red-900/85 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full p-6 sm:p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight text-white tracking-tight drop-shadow-md">
              Make It Personal,<br />
              <span className="text-yellow-300">Make It Special</span> ✨
            </h2>
            <p className="font-sans text-red-100 text-base mb-8 max-w-md font-normal leading-[1.75]">
              Personalized gifts that leave a lasting impression.
            </p>
            <Link to="/personalized" className="w-full sm:w-auto px-8 py-3.5 bg-white text-red-800 action-link hover:bg-gray-50 transition-colors rounded shadow-lg transform hover:-translate-y-1 text-center no-underline">
              Explore Personalized
            </Link>
          </div>
          
          <div className="hidden md:block">
            {/* Elegant "With Love" cursive typography graphic */}
            {/* <div className="text-5xl md:text-7xl font-serif italic text-yellow-300 opacity-90 transform -rotate-6 drop-shadow-lg">
              With Love <br />
              <span className="block text-right mt-2">
                <svg className="inline-block w-12 h-12 text-yellow-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
