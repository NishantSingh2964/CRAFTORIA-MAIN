import React from 'react';
import { Link } from 'react-router-dom';
import { useOccasions } from '../contexts/OccasionContext';

const Occasions = () => {
  const { occasions, loading } = useOccasions();

  if (loading && occasions.length === 0) {
    return (
      <div className="site-container py-12 text-center">
        <p className="text-gray-500 animate-pulse">Loading occasions...</p>
      </div>
    );
  }

  return (
    <section className="site-container py-12 sm:py-16 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <span className="section-eyebrow">
            Shop By Occasion
          </span>
          <h2 className="section-title">
            Find the Perfect Gift
          </h2>
        </div>
        <Link to="/gifts-by-occasion" className="w-full sm:w-auto px-6 py-2.5 border border-red-200 text-red-600 action-link hover:bg-red-50 hover:border-red-600 transition-all rounded-sm whitespace-nowrap text-center no-underline">
          View All Occasions
        </Link>
      </div>

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 sm:gap-6">
        {occasions.slice(0, 6).map((occasion) => (
          <Link key={occasion._id} to={`/collections?occasion=${encodeURIComponent(occasion.filter)}`} className="group relative rounded-xl overflow-hidden cursor-pointer aspect-square bg-gray-100 shadow-sm">
            <img 
              src={occasion.image} 
              alt={occasion.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
            {/* Elegant overlay gradient to make text pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="font-serif text-white font-semibold text-base group-hover:text-red-300 transition-colors">
                {occasion.name}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Occasions;
