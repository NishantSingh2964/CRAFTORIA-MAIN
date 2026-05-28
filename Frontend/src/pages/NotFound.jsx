import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6 py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-[#760000]/5 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-[#760000]/5 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-xl w-full text-center relative z-10">
        {/* Large 404 Accent */}
        <h1 className="font-serif text-[10rem] sm:text-[14rem] font-bold text-[#760000]/5 leading-none absolute inset-0 flex items-center justify-center -z-10 select-none">
          404
        </h1>

        {/* Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-[#fff5f4] border border-red-50 mb-4 shadow-sm">
            <div className="h-8 w-8 bg-[#760000] rounded-sm transform rotate-45 flex items-center justify-center">
              <span className="text-white text-xs font-bold -rotate-45">!</span>
            </div>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Oops! This GIFT was <br /> 
            <span className="text-[#760000]">never wrapped.</span>
          </h2>

          <p className="font-sans text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            It looks like the page you are searching for has been misplaced or never existed. 
            Let's get you back to our curated collections.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              to="/" 
              className="w-full sm:w-auto px-8 py-4 bg-[#760000] text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#8d0000] transition shadow-lg shadow-red-100"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer text */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="font-serif italic text-gray-400 text-sm tracking-wide">
          Craftorio &copy; {new Date().getFullYear()} — Curated with Love
        </p>
      </div>
    </div>
  );
};

export default NotFound;
