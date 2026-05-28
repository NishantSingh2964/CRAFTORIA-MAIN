import React from 'react';

const PersonalizedHero = ({ image }) => {
  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] pt-32 pb-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt="Personalized Custom Gifts"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="site-container relative z-10 text-center max-w-3xl mx-auto mt-8 sm:mt-12">
          <h3 className="page-eyebrow flex items-center justify-center gap-3">
            <span className="w-8 h-[2px] bg-red-600"></span>
            Uniquely Yours
            <span className="w-8 h-[2px] bg-red-600"></span>
          </h3>
          <h1 className="page-title text-4xl sm:text-6xl lg:text-8xl mb-6">
            <span className="font-script text-red-700 font-normal capitalize">Personalized</span> Artistry
          </h1>
          <p className="body-copy text-lg font-medium text-gray-800">
            Crafting deep emotional linkages by transforming gorgeous premium pieces into timeless custom heirlooms with customized names, quotes, and memories.
          </p>
        </div>
      </section>
  );
};

export default PersonalizedHero;
