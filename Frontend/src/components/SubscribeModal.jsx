import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const SubscribeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if the user has already subscribed or dismissed the modal
    const hasSubscribedOrDismissed = localStorage.getItem('craftoria_subscribed_or_dismissed');
    
    if (!hasSubscribedOrDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('craftoria_subscribed_or_dismissed', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      localStorage.setItem('craftoria_subscribed_or_dismissed', 'true');
      toast.success('Thank you for subscribing! ✨', {
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #e2e8f0',
        },
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop blur overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/60 bg-white/95 px-6 py-6 sm:px-10 sm:py-8 shadow-[0_24px_80px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-500 scale-100 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100/50 hover:bg-gray-100 hover:text-gray-600 transition-all duration-300 cursor-pointer"
          aria-label="Close subscription modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Card Content */}
        <div className="text-center">
          {/* Animated decorative envelope icon */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#760000] border border-red-100/40 shadow-sm animate-bounce duration-1000">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </div>

          <h3 className="font-serif text-2xl font-bold leading-snug tracking-tight text-gray-900">
            Join Our Inner Circle
          </h3>
          <p className="mt-1.5 font-sans text-xs sm:text-sm text-gray-500 leading-relaxed px-1">
            Subscribe us for regular updates, exclusive VIP offers, and new custom gift launches!
          </p>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full font-sans bg-gray-50 border border-gray-200/85 rounded-xl px-4 py-3.5 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#760000]/30 focus:border-[#760000] transition-all"
                aria-label="Email address"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="sm:w-[150px] shrink-0 flex items-center justify-center gap-2 rounded-xl bg-[#760000] py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#5e0000] transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>

          <p className="mt-3 font-sans text-[10px] text-gray-400">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;
