import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import hero4 from '../assets/home/hero4.webp';
import { useOccasions } from '../contexts/OccasionContext';

const GiftsByOccasion = () => {
  const { occasions, loading } = useOccasions();
  const [selectedFinderOccasion, setSelectedFinderOccasion] = useState('Birthday');
  const [selectedFinderRecipient, setSelectedFinderRecipient] = useState('Partner');
  const [revealedMatch, setRevealedMatch] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  if (loading && occasions.length === 0) {
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

    // Simulate luxury finder search delay
    setTimeout(() => {
      const key = `${selectedFinderOccasion}-${selectedFinderRecipient}`;
      // Fallback matching logic
      const result = giftMatches[key] || {
        name: 'Ultimate Custom Bespoke Keepsake Basket',
        price: '$150.00',
        matchScore: '91% Match',
        desc: 'A tailored collection crafted by our master curations team containing luxury keepsakes, customized to your selected criteria.'
      };
      setRevealedMatch(result);
      setIsSearching(false);
    }, 900);
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
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Corporate Milestone">Corporate Milestone</option>
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
                <div className="bg-red-50/40 border border-red-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#760000] text-white font-heading text-[8px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full">
                        {revealedMatch.matchScore}
                      </span>
                      <span className="font-heading text-[10px] font-semibold text-red-700 uppercase tracking-widest">
                        Our Recommendation
                      </span>
                    </div>
                    <h4 className="card-title-lg mb-2">
                      {revealedMatch.name}
                    </h4>
                    <p className="body-copy-sm max-w-xl">
                      {revealedMatch.desc}
                    </p>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <span className="block font-sans text-2xl font-extrabold text-gray-900 mb-3">
                      {revealedMatch.price}
                    </span>
                    <button className="px-6 py-2.5 bg-[#760000] text-white action-link text-[10px] rounded-lg hover:bg-red-800 transition-colors shadow-md shadow-red-700/10 cursor-pointer">
                      Buy Now
                    </button>
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
