import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import hero4 from '../assets/home/hero4.webp';
import { useOccasions } from '../contexts/OccasionContext';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatPrice } from '../utils/formatPrice';
import { Heart, ShoppingBag, Pencil, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const GiftsByOccasion = () => {
  const { occasions, loading: occasionsLoading } = useOccasions();
  const { products, fetchProducts, loading: productsLoading } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedFinderOccasion, setSelectedFinderOccasion] = useState('');
  const [selectedFinderRecipient, setSelectedFinderRecipient] = useState('Partner');
  const [revealedMatch, setRevealedMatch] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Set initial occasion when loaded
  React.useEffect(() => {
    if (occasions.length > 0 && !selectedFinderOccasion) {
      setSelectedFinderOccasion(occasions[0].name);
    }
  }, [occasions]);

  React.useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  if (occasionsLoading && occasions.length === 0) {
    return (
      <div className="site-container pt-40 pb-16 text-center">
        <p className="text-gray-500 animate-pulse font-serif text-xl">Curating special moments...</p>
      </div>
    );
  }

  // Gift suggestion mapping for Finder
  const giftMatches = {
    'Birthday-Partner': {
      name: 'Royal Crimson Keepsake Hamper',
      price: '$129.00',
      matchScore: '99% Match',
      desc: 'Our bestselling romantic combo featuring dark chocolate truffles, organic rose nectar, and a beautiful gold-leaf monogrammed notebook.'
    },
    'Birthday-Friend': {
      name: 'Gilded Golden Hazelnut Truffle Vault',
      price: '$75.00',
      matchScore: '95% Match',
      desc: 'A gorgeous brass-detailed chocolate vault containing hand-rolled Belgian pralines. Perfect for a sweet birthday surprise.'
    },
    'Birthday-Family': {
      name: 'Custom Oakwood Photo Horizon Block',
      price: '$65.00',
      matchScore: '97% Match',
      desc: 'High-definition metal photo print mounted on white oakwood with customized back engravings of cherished family memories.'
    },
    'Anniversary-Partner': {
      name: 'Midnight Velvet Rose Cascade & Cake',
      price: '$145.00',
      matchScore: '98% Match',
      desc: 'Premium deep velvet roses arranged in a personalized ceramic vase, accompanied by an artisan chocolate truffle cake.'
    },
    'Anniversary-Friend': {
      name: 'Sovereign Gourmet Tea & Infuser Chalice',
      price: '$120.00',
      matchScore: '94% Match',
      desc: 'Rare premium silver needle white tea paired with an elegant double-walled borosilicate infuser. A class apart.'
    },
    'Anniversary-Family': {
      name: 'Artisan Glass Beverage Decanter Set',
      price: '$160.00',
      matchScore: '96% Match',
      desc: 'Stunning crystal glass decanter with hand-blown gold accents, accompanied by matching personalized rocks glasses.'
    },
    'Corporate Milestone-Partner': {
      name: 'Elite Executive Desk Keepsake Box',
      price: '$145.00',
      matchScore: '95% Match',
      desc: 'Handcrafted walnut wood desk organizer featuring integrated fast wireless charging and gorgeous matte black highlights.'
    },
    'Corporate Milestone-Friend': {
      name: 'Engraved Artisan Leather Portfolio',
      price: '$95.00',
      matchScore: '93% Match',
      desc: 'Premium full-grain tan leather portfolio sleeve, embossed with personalized initials to celebrate their professional milestone.'
    },
    'Corporate Milestone-Family': {
      name: 'Aura Premium Orchid & Tea Set',
      price: '$110.00',
      matchScore: '92% Match',
      desc: 'Sophisticated purple orchids combined beautifully with an exquisite selection of blooming tea pods and a glass teapot.'
    }
  };

  const handleFinderSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setRevealedMatch(null);

    setTimeout(() => {
      if (products.length === 0) {
        toast.error("Still loading products... try again in a second!");
        setIsSearching(false);
        return;
      }

      const searchOccasion = selectedFinderOccasion.trim().toLowerCase();

      // Find a real product that matches the permutation
      const matchedProduct = products.find(prod => {
        const hasOccasion = prod.occasions?.some(occ => {
          // Check name if it's an object, or compare directly if it's a string ID/Name
          const nameToCompare = (occ && typeof occ === 'object' ? occ.name : String(occ)).trim().toLowerCase();
          return nameToCompare === searchOccasion;
        });

        // Treat products with no recipients as universal
        const hasRecipient = !prod.recipients || prod.recipients.length === 0 || prod.recipients.includes(selectedFinderRecipient);
        
        return hasOccasion && hasRecipient;
      });

      // If no perfect match, find any product for that occasion (fallback)
      const fallbackMatch = matchedProduct || products.find(prod => {
        return prod.occasions?.some(occ => {
          const nameToCompare = (occ && typeof occ === 'object' ? occ.name : String(occ)).trim().toLowerCase();
          return nameToCompare === searchOccasion;
        });
      });

      if (fallbackMatch) {
         setRevealedMatch(fallbackMatch);
      } else {
         // Ultimate fallback: just show a random best-seller if even the occasion match fails
         setRevealedMatch(products[0]);
         toast.success("We found something you'll love!");
      }
      setIsSearching(false);
    }, 1200);
  };

  return (
    <div className="relative bg-[#fcfbf9] min-h-screen pb-24 overflow-hidden">
      {/* Decorative Blur Background elements */}
      <div className="absolute top-10 left-[-5%] w-[40%] h-[35%] bg-amber-50/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-[-5%] w-[35%] h-[40%] bg-red-50/30 rounded-full blur-[140px] pointer-events-none" />

      <section className="relative min-h-[760px] pt-28 sm:pt-32 pb-14 sm:pb-20 flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img
            src={hero4}
            alt="Occasion gifting hero"
            className="w-full h-full object-cover object-left lg:object-center"
          />
          <div className="absolute inset-0 bg-white/70 md:hidden" />
        </div>

        <div className="site-container relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="page-eyebrow flex items-center justify-center gap-3">
              <span className="w-8 h-[2px] bg-red-600"></span>
              Tailored Celebrations
              <span className="w-8 h-[2px] bg-red-600"></span>
            </h3>
            <h1 className="page-title text-4xl sm:text-6xl lg:text-8xl mb-6">
              Gifts by <span className="font-script text-red-700 font-normal capitalize">Occasion</span>
            </h1>
            <p className="body-copy text-lg max-w-2xl mx-auto">
              Every celebration holds a distinct aura. Discover gifts meticulously structured to suit the sentiment and magic of your special milestones.
            </p>
          </div>

          {/* Interactive Occasion Gift Finder Widget */}
          <div className="bg-white/92 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/70 shadow-[0_24px_70px_rgba(0,0,0,0.08)] p-5 sm:p-8 lg:p-10 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full pointer-events-none" />
            
            <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight mb-2 text-center sm:text-left">
              Interactive Gift Finder
            </h2>
            <p className="body-copy-sm mb-8 text-center sm:text-left">
              Let our curations engine match you with the absolute perfect gift option in real-time.
            </p>

            <form onSubmit={handleFinderSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-end">
              {/* Occasion Selection */}
              <div>
                <label className="block micro-label text-gray-500 mb-2">
                  1. Select Occasion
                </label>
                <select
                  value={selectedFinderOccasion}
                  onChange={(e) => setSelectedFinderOccasion(e.target.value)}
                  className="w-full font-heading bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-[12.5px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#760000]"
                >
                  <option value="">Select Occasion</option>
                  {occasions.map(occ => (
                    <option key={occ._id} value={occ.name}>{occ.name}</option>
                  ))}
                </select>
              </div>

            {/* Recipient Selection */}
            <div>
              <label className="block micro-label text-gray-500 mb-2">
                2. Gifting To
              </label>
              <select
                value={selectedFinderRecipient}
                onChange={(e) => setSelectedFinderRecipient(e.target.value)}
                className="w-full font-heading bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-[12.5px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#760000]"
              >
                <option value="Partner">My Partner</option>
                <option value="Friend">A Friend</option>
                <option value="Family">Family Member</option>
              </select>
            </div>

            {/* Submit CTA */}
            <div>
              <button 
                type="submit"
                disabled={isSearching}
                className="w-full py-3.5 bg-gray-900 text-white hover:bg-[#760000] action-link rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer text-center"
              >
                {isSearching ? 'Analyzing...' : 'Find Matches'}
              </button>
            </div>
            </form>

            {/* Results Area */}
            {revealedMatch && (
              <div className="mt-8 pt-8 border-t border-gray-100 animate-slide-up">
                <div className="bg-white border border-red-100 rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-red-900/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                     <span className="bg-[#760000] text-white font-heading text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                        98% Match
                      </span>
                  </div>
                  
                  {/* Product Image */}
                  <div className="w-full md:w-56 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img 
                      src={revealedMatch.image} 
                      alt={revealedMatch.name} 
                      className="w-full h-full object-cover"
                    />

                    {/* Personalization Badge Overlay */}
                    {revealedMatch.personalizationType && revealedMatch.personalizationType !== 'None' && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-red-100/50 text-[9px] font-bold uppercase tracking-wider text-[#760000] shadow-sm">
                          {revealedMatch.personalizationType === 'Both' ? '✨ Personalizable' : 
                          revealedMatch.personalizationType === 'Text' ? (
                            <><Pencil className="h-2.5 w-2.5" /> Text Only</>
                          ) : (
                            <><ImageIcon className="h-2.5 w-2.5" /> Photo Only</>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-2">
                      <span className="font-heading text-[10px] font-semibold text-red-700 uppercase tracking-[0.2em]">
                        Your Perfect Match
                      </span>
                    </div>
                    <h4 className="font-serif text-2xl font-bold text-gray-900 mb-3">
                      {revealedMatch.name}
                    </h4>
                    
                    <p className="body-copy-sm mb-6 line-clamp-2">
                      {revealedMatch.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <span className="font-sans text-3xl font-black text-[#760000]">
                        {formatPrice(revealedMatch.currentPrice)}
                      </span>
                      <div className="flex items-center gap-3">
                        <Link 
                          to={`/product/${revealedMatch._id}`}
                          className="px-8 py-3 bg-[#760000] text-white font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-red-800 transition-all shadow-lg shadow-red-700/20"
                        >
                          See More
                        </Link>
                        <button 
                          onClick={() => toggleWishlist(revealedMatch)}
                          className={`p-3 rounded-xl border transition-all ${
                            isInWishlist(revealedMatch._id) ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-400 hover:text-red-600'
                          }`}
                        >
                          <Heart size={20} fill={isInWishlist(revealedMatch._id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="site-container relative z-10 pt-14 sm:pt-20">

        {/* Occasions Luxury Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {occasions.map((occ) => (
            <div 
              key={occ._id} 
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                <span className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm text-gray-800 font-heading text-[8px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full shadow-sm">
                  {occ.tag}
                </span>
                <img 
                  src={occ.image} 
                  alt={occ.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              </div>

              {/* Occasion details */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="card-title-lg text-2xl mb-3 group-hover:text-[#760000] transition-colors">
                  {occ.name}
                </h3>
                <p className="body-copy-sm mb-6 flex-grow">
                  {occ.desc}
                </p>
                <div className="pt-4 border-t border-gray-50 mt-auto">
                  <Link to={`/collections?occasion=${encodeURIComponent(occ.filter)}`} className="inline-flex items-center gap-2 action-link text-[#760000] hover:text-red-800 transition-all hover:translate-x-1">
                    Explore Curations
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GiftsByOccasion;
