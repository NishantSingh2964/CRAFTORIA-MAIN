import React, { useRef } from 'react';
import testimonialBg from '../assets/home/testimonial.png?w=960&format=webp&quality=76';

const Testimonials = () => {
  const scrollContainerRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: 'Priya S.',
      review: '"The quality and packaging were absolutely premium. Made my anniversary extra special!I ordered a personalized gift and it was beyond my expectations. Highly recommended! "',
      avatar: 'https://i.pravatar.cc/150?u=priya'
    },
    {
      id: 2,
      name: 'Rahul M.',
      review: '"I ordered a personalized gift and it was beyond my expectations. Highly recommended! The quality and packaging were absolutely premium. Made my anniversary extra special! "',
      avatar: 'https://i.pravatar.cc/150?u=rahul'
    },
    {
      id: 3,
      name: 'Ananya K.',
      review: '"Fast delivery and such a beautiful collection! CRAFTORIA is now my go-to gift store. I ordered a personalized gift and it was beyond my expectations. Highly recommended!"',
      avatar: 'https://i.pravatar.cc/150?u=ananya'
    },
    {
      id: 4,
      name: 'Vikram R.',
      review: '"The corporate bulk orders were customized perfectly and delivered right on time. Great service! I ordered a personalized gift and it was beyond my expectations. Highly recommended!"',
      avatar: 'https://i.pravatar.cc/150?u=vikram'
    },
    {
      id: 5,
      name: 'Sneha P.',
      review: '"Loved the luxury hamper I got for Mother\'s Day. The attention to detail is remarkable. I ordered a personalized gift and it was beyond my expectations. Highly recommended!"',
      avatar: 'https://i.pravatar.cc/150?u=sneha'
    },
    {
      id: 6,
      name: 'Amit K.',
      review: '"Extremely easy to order, and the customer support was very helpful with my personalization requests.I ordered a personalized gift and it was beyond my expectations. Highly recommended!"',
      avatar: 'https://i.pravatar.cc/150?u=amit'
    },
    {
      id: 7,
      name: 'Neha J.',
      review: '"Beautiful collection and high-end packaging. It really makes gifting an unforgettable experience. I ordered a personalized gift and it was beyond my expectations. Highly recommended!"',
      avatar: 'https://i.pravatar.cc/150?u=neha'
    }
  ];

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const step = 320;
    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative w-full pt-16 pb-28 overflow-hidden">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={testimonialBg} 
          alt="" 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        {/* Subtle Overlay to blend background */}
        <div className="absolute inset-0 bg-white/5" />
      </div>

      <div className="site-container relative z-10 w-full">
        {/* Content Area */}
        <div className="w-full lg:w-[75%]">
          <span className="section-eyebrow">
            Customer Love
          </span>
          <h2 className="section-title mb-6">
            What Our Customers Say
          </h2>

          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-600 shadow-md hover:scale-110 active:scale-95 transition-all hidden sm:flex shrink-0 z-10 cursor-pointer"
              aria-label="Scroll testimonials left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 lg:gap-6 flex-1 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((t) => (
                <div 
                  key={t.id} 
                  className="flex-none w-full sm:w-[calc((100%-16px)/2)] snap-start bg-white p-5 sm:p-8 rounded-2xl shadow-md border border-gray-100 hover:border-red-100 transition-all duration-300 flex flex-col justify-between min-h-[230px] sm:h-[240px]"
                >
                  <div>
                    <div className="flex text-red-600 mb-3 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ))}
                    </div>
                    <p className="body-copy-sm text-gray-700 mb-4 h-20 sm:h-24 overflow-y-auto scrollbar-none">
                      {t.review}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-red-100"
                      loading="lazy"
                      decoding="async"
                      aria-hidden="true"
                    />
                    <span className="font-heading text-[11px] font-semibold text-gray-900 uppercase tracking-[0.14em]">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-600 shadow-md hover:scale-110 active:scale-95 transition-all hidden sm:flex shrink-0 z-10 cursor-pointer"
              aria-label="Scroll testimonials right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          
          <div className="flex justify-center mt-6 gap-2">
            <span className="w-6 h-1.5 rounded-full bg-red-600"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-200"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-200"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
