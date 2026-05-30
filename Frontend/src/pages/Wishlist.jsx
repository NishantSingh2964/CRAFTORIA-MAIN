import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, CheckCircle2, Gift, Headphones, Heart, Pencil, Share2, Trash2, Truck, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatPrice } from '../utils/formatPrice';
import wishlistHero from '../assets/home/Wishlist.png?w=1800&format=webp&quality=82';
import touchImage from '../assets/home/Touch.png?w=1200&format=webp&quality=82';

const trustItems = [
  {
    title: 'Premium Picks',
    text: 'Curated with care',
    icon: Gift,
  },
  {
    title: 'Secure Packaging',
    text: 'Gift-ready wrapping',
    icon: CheckCircle2,
  },
  {
    title: 'Express Delivery',
    text: 'On-time, every time',
    icon: Truck,
  },
  {
    title: 'Loved Gifts',
    text: 'Saved for later',
    icon: Heart,
  },
];

const normalizeProduct = (product) => ({
  ...product,
  id: product.id || product._id,
});

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState('recent');

  const sortedWishlist = useMemo(() => {
    const items = [...wishlist];
    if (sortBy === 'price-low') {
      return items.sort((a, b) => Number(a.currentPrice || 0) - Number(b.currentPrice || 0));
    }
    if (sortBy === 'price-high') {
      return items.sort((a, b) => Number(b.currentPrice || 0) - Number(a.currentPrice || 0));
    }
    if (sortBy === 'name') {
      return items.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    }
    return items;
  }, [sortBy, wishlist]);

  const handleAddToCart = (product) => {
    addToCart(normalizeProduct(product));
    toast.success('Added to cart');
  };

  return (
    <div className="min-h-screen bg-white pb-0 text-gray-950">
      <section className="relative flex min-h-[320px] items-center overflow-hidden border-b border-gray-100 bg-[#fffafa] pt-24 sm:min-h-[360px] sm:pt-28 lg:pt-28">
        <img
          src={wishlistHero}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-fill"
          aria-hidden="true"
        />

        <div className="site-container relative z-10 w-full py-8 sm:py-10">
          <button
            type="button"
            onClick={() => toast.success('Wishlist link ready to share')}
            className="absolute right-5 top-4 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#760000] bg-white px-5 action-link text-[#760000] shadow-sm transition hover:bg-red-50 sm:right-10 lg:right-16 xl:right-20"
          >
            <Share2 className="h-4 w-4" />
            Share Wishlist
          </button>

          <div className="mx-auto max-w-2xl pt-12 text-center sm:pt-8">
            <h1 className="mb-4 flex flex-col items-center tracking-tight">
              <span className="relative inline-block pb-3">
                <span
                  className="font-script text-red-700 block transform -rotate-1 leading-none"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5.25rem)' }}
                >
                  My
                </span>
                <svg
                  className="absolute -bottom-1 left-1/2 h-5 w-[180px] -translate-x-1/2 text-red-700/80"
                  viewBox="0 0 200 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M 20,15 C 45,11 75,13 92,18 C 95,19 97,22 96,24 C 95,25 93,24 92,22 C 91,20 93,17 97,17 C 101,17 103,19 104,22 C 105,24 103,25 102,24 C 101,22 103,19 106,18 C 123,13 153,11 178,15" />
                </svg>
              </span>
              <span
                className="font-serif font-bold text-gray-950 block leading-tight"
                style={{ fontSize: 'clamp(3.25rem, 7vw, 6rem)' }}
              >
                Wishlist <Heart className="ml-2 inline h-9 w-9 text-[#760000] sm:h-11 sm:w-11" strokeWidth={1.4} />
              </span>
            </h1>
            <p className="mx-auto max-w-xl font-sans text-base text-gray-700 sm:text-[1.05rem]">
              All the gifts you love, in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="site-container py-8 sm:py-10">
        {wishlist.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-100 bg-[#fff9f8] p-8 text-center shadow-sm sm:p-14">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#760000] shadow-sm">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-950">Your wishlist is empty</h2>
            <p className="body-copy-sm mt-3 max-w-md">
              Find a thoughtful hamper, bouquet, or personalized keepsake and save it here for later.
            </p>
            <Link
              to="/collections"
              className="mt-8 inline-flex items-center gap-2 rounded-md border-2 border-[#760000] bg-white px-8 py-3.5 action-link text-[#760000] transition hover:bg-red-50"
            >
              Browse Gifts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-sans text-sm font-bold text-gray-950">{wishlist.length} Items</p>
              <div className="flex items-center gap-3">
                <label htmlFor="wishlist-sort" className="font-sans text-sm font-bold text-gray-950">
                  Sort by:
                </label>
                <select
                  id="wishlist-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-11 min-w-[190px] rounded-md border border-gray-200 bg-[#fafafa] px-4 font-sans text-sm font-medium text-gray-700 outline-none transition focus:border-[#760000] focus:ring-2 focus:ring-red-600/10"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedWishlist.map((product) => {
                const discount = Number(product.originalPrice) > Number(product.currentPrice)
                  ? Math.round(
                    ((Number(product.originalPrice) - Number(product.currentPrice)) /
                      Number(product.originalPrice)) *
                    100
                  )
                  : 0;

                return (
                  <article key={product._id || product.id} className="group">
                    <Link to={`/product/${product._id || product.id}`} className="block">
                      <div className="relative mb-4 aspect-[1.18] overflow-hidden rounded-md border border-gray-100 bg-red-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />

                        {/* Personalization Badge Overlay */}
                        {product.personalizationType && product.personalizationType !== 'None' && (
                          <div className="absolute top-4 left-4 z-20">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-red-100/50 text-[9px] font-bold uppercase tracking-wider text-[#760000] shadow-sm">
                              {product.personalizationType === 'Both' ? '✨ Personalizable' : 
                              product.personalizationType === 'Text' ? (
                                <><Pencil className="h-2.5 w-2.5" /> Text Only</>
                              ) : (
                                <><ImageIcon className="h-2.5 w-2.5" /> Photo Only</>
                              )}
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            removeFromWishlist(product._id || product.id);
                          }}
                          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#760000] shadow-md transition hover:scale-105"
                          aria-label={`Remove ${product.name} from wishlist`}
                        >
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                        {discount > 0 && (
                          <span className="absolute left-3 top-3 rounded-md border border-red-200 bg-white px-3 py-1 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-[#760000]">
                            {discount}% Off
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="flex min-h-[172px] flex-col">
                      <Link to={`/product/${product._id || product.id}`} className="group/title">
                        <h2 className="card-title mb-3 line-clamp-2 transition group-hover/title:text-[#760000]">
                          {product.name}
                        </h2>
                      </Link>

                      <div className="mb-5 flex items-center gap-2">
                        <span className="font-sans text-lg font-extrabold text-[#760000]">
                          {formatPrice(product.currentPrice)}
                        </span>
                        {Number(product.originalPrice) > Number(product.currentPrice) && (
                          <span className="font-sans text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex flex-col gap-2">
                        <Link
                          to={`/product/${product._id || product.id}`}
                          className="h-10 flex items-center justify-center rounded-md border border-gray-200 bg-white action-link text-[10px] text-gray-600 transition hover:border-[#760000] hover:text-[#760000]"
                        >
                          See More
                        </Link>
                        <div className="grid grid-cols-[1fr_44px] gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="h-11 rounded-md border border-[#760000] bg-[#760000] action-link text-[11px] text-white transition hover:bg-[#5e0000]"
                          >
                            Add To Cart
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(product._id || product.id)}
                            className="flex h-11 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 transition hover:border-[#760000] hover:text-[#760000]"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      <section className="site-container pb-8">
        <div className="grid overflow-hidden rounded-xl bg-[#fff2f0] lg:grid-cols-[0.48fr_0.52fr]">
          <div className="h-44 sm:h-52 lg:h-full">
            <img
              src={touchImage}
              alt="Add a personal touch to your gift"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#760000]">
              Make It Extra Special
            </p>
            <h2 className="mb-3 font-serif text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              Add a <span className="text-[#760000]">Personal</span> Touch
            </h2>
            <p className="mb-6 font-sans text-sm leading-relaxed text-gray-700 sm:text-base">
              Add a handwritten note to make your gift even more meaningful.
            </p>
            <button
              type="button"
              className="inline-flex h-11 w-max items-center gap-2 rounded-md border border-[#760000] bg-white px-5 action-link text-[#760000] transition hover:bg-red-50"
            >
              Add Gift Note
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="site-container pb-8">
        <div className="grid grid-cols-2 gap-y-8 rounded-lg border border-gray-100 bg-white px-4 py-7 shadow-sm md:grid-cols-4">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`px-2 text-center ${index < trustItems.length - 1
                  ? "md:border-r md:border-red-100"
                  : ''
                  }`}
              >
                <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center text-[#760000]">
                  <Icon className="h-8 w-8" strokeWidth={1.8} />
                </div>
                <h3 className="font-heading text-[12px] font-bold leading-snug tracking-[0.03em] text-gray-950">
                  {item.title}
                </h3>
                <p className="mt-1.5 font-sans text-[11px] font-normal leading-snug text-gray-500">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
