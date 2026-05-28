import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import hero2Img from '../assets/home/hero2.png?w=1200&format=webp&quality=78';
import hero3Img from '../assets/home/hero3.png?w=1200&format=webp&quality=78';

const LCP_HERO = '/lcp-hero.webp';

const slides = [
  {
    subtitle: 'Make Every Moment Special',
    title1: 'Thoughtful',
    title2: 'Gifts',
    desc: 'Curated premium gifts for every occasion.',
    btn1: 'Shop Now',
    btn2: 'Explore Collection',
    primaryTo: '/collections',
    secondaryTo: '/collections',
    image: LCP_HERO,
  },
  {
    subtitle: 'Luxury Gifting Reimagined',
    title1: 'Elegant',
    title2: 'Hampers',
    desc: 'Unwrap joy with our bespoke gourmet & keepsake collections.',
    btn1: 'Shop Hampers',
    btn2: 'Customize Box',
    primaryTo: '/collections',
    secondaryTo: '/personalized',
    image: hero2Img,
  },
  {
    subtitle: 'Handcrafted Personalization',
    title1: 'Bespoke',
    title2: 'Keepsakes',
    desc: 'Create everlasting memories with our beautifully engraved and customized gifts.',
    btn1: 'Personalize Now',
    btn2: 'View Gallery',
    primaryTo: '/personalized',
    secondaryTo: '/collections',
    image: hero3Img,
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentSlide === 0) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [currentSlide]);

  const activeSlide = slides[currentSlide];
  const isLcpSlide = currentSlide === 0;

  return (
    <div className="relative min-h-[720px] sm:min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 z-0">
        <img
          src={activeSlide.image}
          alt=""
          className="w-full h-full object-cover"
          width={960}
          height={540}
          loading={isLcpSlide ? 'eager' : 'lazy'}
          decoding={isLcpSlide ? 'sync' : 'async'}
          fetchPriority={isLcpSlide ? 'high' : 'low'}
          aria-hidden="true"
        />
      </div>

      <div className="site-container relative z-10 w-full">
        <div className="max-w-2xl lg:max-w-3xl py-10 lg:py-24 relative min-h-[390px] sm:min-h-[420px]">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`transition-all ease-in-out ${
                currentSlide === idx
                  ? 'opacity-100 translate-y-0 relative z-10 delay-300 duration-1000'
                  : 'opacity-0 translate-y-6 absolute top-0 left-0 -z-10 pointer-events-none w-full duration-500'
              }`}
            >
              <p className="page-eyebrow flex items-center gap-4">
                <span className="w-12 h-[2px] bg-red-600" />
                {slide.subtitle}
              </p>

              <h1 className="text-[3.45rem] min-[390px]:text-6xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[1.05] mb-6 tracking-tight drop-shadow-sm flex flex-col">
                <span className="relative inline-block pb-6">
                  <span className="font-script text-red-700 font-normal block transform -rotate-1 text-[1.25em] leading-none">
                    {slide.title1}
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full max-w-[220px] h-6 text-red-700/80"
                    viewBox="0 0 200 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M 20,15 C 45,11 75,13 92,18 C 95,19 97,22 96,24 C 95,25 93,24 92,22 C 91,20 93,17 97,17 C 101,17 103,19 104,22 C 105,24 103,25 102,24 C 101,22 103,19 106,18 C 123,13 153,11 178,15" />
                  </svg>
                </span>
                <span className="font-serif font-bold text-gray-900 block">{slide.title2}</span>
              </h1>

              <p className="body-copy text-base sm:text-xl text-gray-800 mb-8 max-w-xl">{slide.desc}</p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to={slide.primaryTo}
                  className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 bg-red-700 text-white action-link overflow-hidden rounded-sm transition-all shadow-[0_4px_20px_rgba(118,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(118,0,0,0.6)] hover:-translate-y-1 cursor-pointer text-center no-underline"
                >
                  <span className="relative z-10">{slide.btn1}</span>
                  <span
                    className="absolute inset-0 h-full w-full bg-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to={slide.secondaryTo}
                  className="group w-full sm:w-auto px-8 sm:px-10 py-4 bg-white/60 backdrop-blur-md border border-gray-900 hover:border-red-600 hover:bg-white text-gray-900 hover:text-red-600 action-link transition-all duration-300 rounded-sm cursor-pointer text-center no-underline"
                >
                  {slide.btn2}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-5 sm:left-10 lg:left-16 xl:left-20 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-[width,background-color] duration-300 cursor-pointer ${
              currentSlide === idx ? 'w-8 bg-red-700' : 'w-2.5 bg-red-700/30 hover:bg-red-700/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
