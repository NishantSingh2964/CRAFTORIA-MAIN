import React, { useRef } from 'react';
import boyfriendImg from '../assets/home/boyfriend.png?w=400&format=webp&quality=74';
import girlfriendImg from '../assets/home/girlfriend.png?w=400&format=webp&quality=74';
import husbandImg from '../assets/home/Husband.png?w=400&format=webp&quality=74';
import wifeImg from '../assets/home/Wife.png?w=400&format=webp&quality=74';
import fatherImg from '../assets/home/Father.png?w=400&format=webp&quality=74';
import motherImg from '../assets/home/Mother.png?w=400&format=webp&quality=74';
import grandfatherImg from '../assets/home/GranfFather.png?w=400&format=webp&quality=74';

const GiftsForEveryone = () => {
  const scrollContainerRef = useRef(null);

  const recipients = [
    { id: 1, name: 'Boyfriend', image: boyfriendImg, highlighted: false, badge: 'Popular' },
    { id: 2, name: 'Girlfriend', image: girlfriendImg, highlighted: false, badge: 'Trending' },
    { id: 3, name: 'Husband', image: husbandImg, highlighted: true, badge: 'Best Seller' },
    { id: 4, name: 'Wife', image: wifeImg, highlighted: false, badge: 'Most Loved' },
    { id: 5, name: 'Father', image: fatherImg, highlighted: false },
    { id: 6, name: 'Mother', image: motherImg, highlighted: false, badge: 'Warmest' },
    { id: 7, name: 'Grandfather', image: grandfatherImg, highlighted: false },
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative bg-[#fcfbf9] py-20 border-t border-gray-100/60 overflow-hidden">
      {/* Decorative High-End Ambient Glow Orbs */}
      <div className="absolute top-0 left-[-10%] w-[35%] h-[50%] bg-sky-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[35%] h-[50%] bg-red-50/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="site-container relative z-10">
        {/* Section Title */}
        <div className="mb-12 text-left relative">
          <span className="section-eyebrow">
            For Your Loved Ones
          </span>
          <h2 className="section-title">
            Gifts For Everyone
          </h2>
          <div className="absolute left-0 bottom-[-8px] w-12 h-[2px] bg-[#760000]" />
        </div>

        {/* Carousel Wrapper */}
        <div className="relative px-0 sm:px-4 mt-6">
          
          {/* Left Arrow Button */}
          <button 
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute -left-4 sm:-left-6 lg:-left-8 top-[42%] -translate-y-1/2 w-12 h-12 rounded-full border border-gray-100/80 bg-white/95 backdrop-blur-md items-center justify-center text-gray-500 hover:text-[#760000] hover:border-red-300 hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer z-30 shadow-md"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          {/* Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-none pb-6 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recipients.map((rec) => (
              <div 
                key={rec.id} 
                className="flex-none w-[78vw] min-[420px]:w-[260px] sm:w-[240px] lg:w-[calc((100%-96px)/5)] min-w-[0] snap-start group"
              >
                {/* Card with subtle gradient frame */}
                <div className={`relative aspect-[4/5] rounded-[24px] p-2.5 overflow-hidden transition-all duration-500 border ${
                  rec.highlighted 
                    ? 'bg-gradient-to-b from-red-50/60 to-red-100/10 border-red-200/60 shadow-md group-hover:shadow-[0_20px_40px_rgba(118,0,0,0.08)]' 
                    : 'bg-gradient-to-b from-[#edf5ff]/50 to-[#edf5ff]/10 border-sky-100/60 shadow-sm group-hover:shadow-[0_20px_40px_rgba(14,165,233,0.08)] group-hover:border-sky-300/50'
                } group-hover:-translate-y-2`}>
                  
                  {/* Decorative Glass Badge for active/featured cards */}
                  {rec.badge && (
                    <span className={`absolute top-4 left-4 z-20 font-heading text-[9px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full shadow-sm transition-all duration-300 ${
                      rec.highlighted 
                        ? 'bg-[#760000] text-white' 
                        : 'bg-white/95 backdrop-blur-sm text-gray-700 border border-gray-100'
                    }`}>
                      {rec.badge}
                    </span>
                  )}

                  {/* Image with Ken-Burns style hover scale */}
                  <img 
                    src={rec.image} 
                    alt={rec.name}
                    className="w-full h-full object-cover rounded-[18px] transform group-hover:scale-[1.05] transition-transform duration-700 ease-out origin-bottom"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Elegant "Explore" slide-up overlay */}
                  <div className="absolute inset-2.5 rounded-[18px] bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 z-10">
                    <span className="bg-white/95 backdrop-blur-sm text-gray-900 font-heading text-xs font-semibold px-4 py-1.5 rounded-full shadow-md transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      Shop for {rec.name}
                    </span>
                  </div>

                  {/* Elegant always-visible minimalist name pill */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 transition-all duration-300 group-hover:scale-75 group-hover:opacity-0">
                    <span className={`backdrop-blur-md font-heading text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm border ${
                      rec.highlighted 
                        ? 'bg-[#760000]/90 text-white border-red-400/20' 
                        : 'bg-white/90 text-gray-800 border-white/40'
                    }`}>
                      {rec.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-4 sm:-right-6 lg:-right-8 top-[42%] -translate-y-1/2 w-12 h-12 rounded-full border border-gray-100/80 bg-white/95 backdrop-blur-md items-center justify-center text-gray-500 hover:text-[#760000] hover:border-red-300 hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer z-30 shadow-md"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          
        </div>
      </div>
    </section>
  );
};

export default GiftsForEveryone;
