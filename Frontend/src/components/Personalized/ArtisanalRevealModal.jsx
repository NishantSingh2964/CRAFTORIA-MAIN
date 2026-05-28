import React, { useState } from 'react';

const Icon = ({ children, className = 'h-5 w-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const ArtisanRevealModal = ({ image, selectedItems, basketTotal, onOrderNow, onWhatsApp, onClose }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 backdrop-blur-3xl animate-in fade-in duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-black/85" onClick={onClose} />

      <div className="relative w-full max-w-6xl h-full max-h-[75vh] bg-white rounded-[40px] overflow-hidden shadow-[0_45px_120px_rgba(0,0,0,0.7)] flex flex-col-reverse lg:flex-row-reverse animate-in zoom-in-95 duration-500">
        {/* Image Column */}
        <div className="relative w-full lg:w-[62%] h-full bg-[#f9f7f4] overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50">
              <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-[#760000] animate-spin mb-4" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">Artisan Developing...</p>
            </div>
          )}
          <img
            src={image}
            className={`w-full h-full object-contain p-8 transition-opacity duration-1000 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoading(false)}
          />
          <div className="absolute top-8 right-8 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-100 shadow-lg z-30">
            <span className="text-red-600 animate-pulse text-xl">✦</span>
            <span className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.25em]">Artisan Masterpiece</span>
          </div>
        </div>

        {/* Content Column */}
        <div className="w-full lg:w-[38%] p-8 sm:p-12 flex flex-col bg-white border-r border-gray-100 overflow-y-auto">
          <div className="flex-1">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-[1.1]">Your Perfect Gift</h2>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Every item has been curated into a single stunning experience.
            </p>

            <div className="mt-8 space-y-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">Hamper Manifest</h3>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-red-50 transition-colors text-lg">{item.emoji}</span>
                      <span className="text-sm text-gray-600 font-medium">{item.quantity}x {item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                <p className="text-3xl font-bold text-[#760000]">₹{basketTotal.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium text-gray-400">Incl. all taxes</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onOrderNow}
                className="w-full flex items-center justify-center gap-3 bg-[#760000] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-red-900/20 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all"
              >
                Order Now & Checkout
              </button>
              <button
                onClick={onWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-green-900/20 hover:bg-green-600 lg:opacity-60 transition-all hover:opacity-100"
              >
                Order on WhatsApp
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-[#760000] transition-colors"
              >
                ← Back to Editor
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 left-6 lg:left-auto lg:right-6 lg:top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-950 backdrop-blur-md border border-black/5 hover:bg-red-600 hover:text-white transition-all shadow-sm"
        >
          <Icon className="h-5 w-5"><path d="M18 6 6 18M6 6l12 12" /></Icon>
        </button>
      </div>
    </div>
  );
};

export default ArtisanRevealModal;
