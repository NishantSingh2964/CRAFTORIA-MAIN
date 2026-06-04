import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stories, products } from '../assets.js';
import { ArrowLeft, Quote, Heart, Share2, Bookmark } from 'lucide-react';

const StoryDetail = () => {
  const { id } = useParams();
  const story = stories.find((s) => s.id === id);
  const relatedProduct = products.find(p => p.id === story?.relatedProductId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!story) {
    return (
      <div className="site-container pt-40 pb-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-gray-900">Story Not Found</h2>
        <p className="mt-4 text-gray-600">The story you are looking for doesn't exist.</p>
        <Link to="/personalized" className="mt-8 inline-block px-8 py-3 bg-[#760000] text-white rounded-xl font-bold">
          Back to Personalized
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfbf9] min-h-screen relative">
      {/* Hero Section */}
      <section className="relative h-[75vh] w-full overflow-hidden">
        <img 
          src={story.image} 
          alt={story.name}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171111]/40 via-transparent to-[#171111]/90" />
        
        <div className="absolute inset-0 flex items-end pb-28 sm:pb-24">
          <div className="site-container w-full">
            <div className="flex flex-col gap-6">
              <div className="hidden sm:flex justify-end w-full">
                <Link 
                  to="/personalized" 
                  className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-sm hover:bg-[#760000] hover:border-[#760000] transition-all whitespace-nowrap inline-flex items-center gap-2 text-center no-underline font-black text-xs uppercase tracking-widest shadow-lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to Catalog
                </Link>
              </div>
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-12 bg-red-600" />
                  <span className="text-white text-[11px] font-black uppercase tracking-[0.4em]">
                    {story.tag}
                  </span>
                </div>
                <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6">
                  {story.name}
                </h1>
                <p className="text-white/80 text-xl font-medium max-w-2xl leading-relaxed italic border-l-4 border-red-600 pl-6">
                  {story.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <section className="site-container py-20 sm:py-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Detailed Content */}
          <div className="lg:w-2/3">
            <div className="space-y-20">
              {story.sections.map((section, sIndex) => (
                <div key={sIndex} className="group">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[#cfaaa1] font-serif italic text-4xl opacity-50">0{sIndex + 1}</span>
                    <h2 className="font-serif text-3xl font-black text-[#171111] group-hover:text-[#760000] transition-colors duration-500">
                      {section.title}
                    </h2>
                  </div>
                  <div className="prose prose-lg max-w-none text-[#4a3f3c] leading-[2] font-sans text-xl">
                    {section.paragraphs.map((para, pIndex) => (
                      <p 
                        key={pIndex} 
                        className={`mb-10 ${sIndex === 0 && pIndex === 0 ? 'first-letter:text-8xl first-letter:font-serif first-letter:font-bold first-letter:text-[#760000] first-letter:mr-5 first-letter:float-left first-letter:leading-[1]' : ''}`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* End of Story Divider */}
            <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-center gap-8">
               <button className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Share the Love</span>
               </button>
               <button className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Post Story</span>
               </button>
               <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <Bookmark className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Save Memory</span>
               </button>
            </div>
          </div>

          {/* Dynamic Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-10">
              {/* Relationship Quote */}
              <div className="bg-[#fffcf7] rounded-3xl p-10 border border-[#f0e6e0] relative overflow-hidden">
                <Quote size={80} className="absolute -top-4 -right-4 text-[#760000] opacity-5 rotate-12" />
                <div className="relative z-10">
                  <div className="h-12 w-12 bg-[#760000] rounded-2xl flex items-center justify-center text-white mb-8">
                    <Quote size={24} />
                  </div>
                  <p className="font-serif text-2xl font-bold italic text-[#171111] leading-relaxed mb-8">
                    "{story.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-[#760000] to-red-400 flex items-center justify-center text-white text-xl font-bold font-serif">
                      {story.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[#171111]">{story.author}</p>
                      <div className="flex items-center gap-1 text-[#760000]">
                         {[...Array(5)].map((_, i) => (
                           <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Hero Product - Discovery Card */}
              {relatedProduct && (
                <div className="bg-white rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 group overflow-hidden">
                   <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                         <p className="text-[10px] font-black uppercase text-[#760000] tracking-[0.2em]">Crafted For This Story</p>
                      </div>
                   </div>
                   <div className="px-6 pb-6 text-center">
                      <h4 className="font-serif text-2xl font-bold text-gray-900 mb-2">{relatedProduct.name}</h4>
                      <p className="text-gray-500 text-sm mb-6 px-4">Begin your own story with our signature keepsake.</p>
                      <Link 
                        to={`/product/${relatedProduct.id}`}
                        className="block w-full py-5 bg-[#171111] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#760000] transition-colors shadow-xl shadow-gray-200"
                      >
                        Explore This Piece
                      </Link>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final Discovery Grid */}
      <section className="bg-white pb-24 pt-12 sm:pb-32 sm:pt-16 border-t border-gray-100">
        <div className="site-container">
          <div className="flex flex-col items-start mb-16 gap-8">
            <div className="max-w-xl">
              <span className="text-red-600 font-bold text-[11px] uppercase tracking-[0.4em] mb-4 block">Recommended Reads</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#171111]">Other Stories of Love and Legacy</h2>
            </div>
            <Link 
              to="/personalized" 
              className="px-6 py-2.5 border border-red-200 text-red-600 action-link hover:bg-red-50 hover:border-red-600 transition-all rounded-sm whitespace-nowrap inline-block text-center no-underline font-black text-sm uppercase"
            >
              View All Memoirs
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.filter(s => s.id !== id).slice(0, 3).map((s) => (
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
      </section>
    </div>
  );
};

export default StoryDetail;
