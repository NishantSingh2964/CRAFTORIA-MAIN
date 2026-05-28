import React from 'react';

const Loader = ({ fullScreen = true, message = "Curating your experience..." }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8 w-full";

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Outer Ring */}
        <div className="h-16 w-16 rounded-full border-4 border-[#760000]/10 border-t-[#760000] animate-spin"></div>
        
        {/* Inner Pulsing Heart/Gift Icon */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="h-6 w-6 bg-[#760000] rounded-sm transform rotate-45 shadow-[0_0_15px_rgba(118,0,0,0.3)]"></div>
        </div>
      </div>
      
      {message && (
        <p className="mt-6 font-serif text-lg italic text-[#760000] animate-pulse tracking-wide">
          {message}
        </p>
      )}
      
      {/* Decorative dots */}
      <div className="mt-2 flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#760000]/20 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-[#760000]/40 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-[#760000]/60 animate-bounce"></span>
      </div>
    </div>
  );
};

export default Loader;
