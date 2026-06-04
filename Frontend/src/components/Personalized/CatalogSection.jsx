import React from 'react';
import { Link } from 'react-router-dom';

const CatalogSection = ({ stories = [] }) => {
  return (
    <div className="mt-24">
      <h2 className="section-title mb-12 text-center">
        Personalized Stories, Lasting Memories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stories.map((s) => (
          <Link
            key={s.id}
            to={`/story/${s.id}`}
            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
              <span className="absolute top-4 left-4 z-20 bg-[#760000] text-white font-heading text-[8px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
                {s.tag}
              </span>
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="card-title-lg text-lg mb-2 group-hover:text-[#760000] transition-colors">
                {s.name}
              </h3>
              <p className="body-copy-sm mb-6 flex-grow line-clamp-3 italic">
                "{s.description}"
              </p>
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-[#760000] transition-colors">Read Full Story</span>
                <span className="px-4 py-2 bg-gray-900 text-white hover:bg-[#760000] action-link text-[9px] rounded-lg transition-all duration-300 group-hover:scale-[1.03]">
                  View Story
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CatalogSection;
