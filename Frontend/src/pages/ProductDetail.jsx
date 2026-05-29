// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { usePersonalized } from '../contexts/PersonalizedContext';
import { useCart } from '../contexts/CartContext';
import { useReviews } from '../contexts/ReviewContext';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';
import { compressImage } from '../utils/imageCompressor';
import touchImage from '../assets/home/Touch.png?w=800&format=webp&quality=80';
import { 
  Star, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Pencil, 
  MoreVertical, 
  Heart,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Type
} from 'lucide-react';

const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Icon = ({ children, className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
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

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { fetchProductById, fetchProducts, products } = useProducts();
  const { fetchPersonalizedProductById } = usePersonalized();
  const { addToCart } = useCart();
  const { reviews, fetchReviewsByProduct, submitReview, deleteReview, loading: reviewsLoading } = useReviews();
  const { user, isSignedIn } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Personalization State
  const [personalizationText, setPersonalizationText] = useState('');
  const [personalizationPhoto, setPersonalizationPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.publicMetadata?.role === 'Admin' || user?.publicMetadata?.role === 'SuperAdmin' || user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        // try standard first
        const res = await fetchProductById(id);
        
        if (res.success) {
          setProduct(res.data);
          fetchReviewsByProduct(id);
        } else {
          // try personalized
          const persRes = await fetchPersonalizedProductById(id);
          if (persRes.success) {
            setProduct(persRes.data);
            fetchReviewsByProduct(id);
          } else {
            setError(res.error || persRes.error);
          }
        }

        // Always fetch global products if they aren't already loaded in context
        if (products.length === 0) fetchProducts();
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, products.length]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error('Please sign in to leave a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    const result = await submitReview({
      productId: id,
      rating,
      comment,
      userName: user.fullName || user.firstName || 'Anonymous',
      userImage: user.imageUrl
    });

    if (result.success) {
      setComment('');
      setRating(5);
    }
    setIsSubmitting(false);
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p._id !== product._id).slice(0, 4);
  }, [product, products]);

  if (loading) {
    return (
      <div className="site-container pt-40 pb-16 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse font-serif text-xl">Discovering product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <section className="site-container pt-40 pb-16">
        <p className="text-center text-gray-600">{error || 'Product not found.'}</p>
        <div className="mt-8 text-center">
          <Link to="/collections" className="px-6 py-2.5 bg-[#760000] text-white rounded-sm hover:bg-red-800 transition no-underline">
            Back to Collections
          </Link>
        </div>
      </section>
    );
  }

  const discount = Math.max(
    0,
    Math.round(
      ((Number(product.originalPrice) - Number(product.currentPrice)) /
        Number(product.originalPrice)) *
      100
    )
  );

  const handleOrderOnWhatsApp = () => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '');
    if (!phone) {
      toast.error('WhatsApp number is not configured');
      return;
    }
    const unitPrice = Number(product.currentPrice);
    const message = encodeURIComponent(
      `Hi CRAFTORIA, I would like to order:\n\nProduct: ${product.name}\nQuantity: ${quantity}\nPrice: ${formatPrice(unitPrice * quantity)}\nLink: ${window.location.href}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const essentials = [
    `${product.category} signature gift`,
    'Personal message card included',
    'Premium gift-safe packaging',
    'Express delivery eligible',
  ];

  const trustItems = [
    {
      title: 'Premium Quality',
      text: 'Handpicked with care',
      icon: <><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5c0 1.4 2 2.5 2 2.5Z" /><path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5c0 1.4-2 2.5-2 2.5Z" /></>,
    },
    {
      title: 'Secure Packaging',
      text: 'Safe and elegant',
      icon: <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></>,
    },
    {
      title: 'Express Delivery',
      text: 'On-time, every time',
      icon: <><path d="M10 17h4V5H2v12h3" /><path d="M14 17h1" /><path d="M19 17h3v-6l-3-4h-5" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>,
    },
    {
      title: 'Easy Returns',
      text: 'Hassle-free returns',
      icon: <><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v6h-6" /></>,
    },
    {
      title: 'Trusted by 50,000+ Customers',
      text: 'Across India',
      icon: <><path d="M16 21v-2a4 4 0 0 0-8 0v2" /><circle cx="12" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    },
    {
      title: '100% Secure Payments',
      text: 'Multiple payment options',
      icon: <><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /><path d="M7 15h.01" /><path d="M11 15h2" /></>,
    },
    {
      title: 'Made with Love',
      text: 'Perfect for every occasion',
      icon: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" /></>,
    },
    {
      title: '24/7 Customer Support',
      text: 'We are here to help',
      icon: <><path d="M3 11a9 9 0 0 1 18 0" /><path d="M21 11v5a2 2 0 0 1-2 2h-1" /><path d="M3 11v5a2 2 0 0 0 2 2h1" /><path d="M9 19h6" /><path d="M7 11v4" /><path d="M17 11v4" /></>,
    },
  ];

  return (
    <div className="bg-white pt-28 sm:pt-32 lg:pt-36 pb-2 text-gray-950">
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-[0.52fr_0.48fr] gap-8 lg:gap-14 items-start lg:items-stretch">
          <div className="relative rounded-md overflow-hidden bg-[#fbf5f2] min-h-[420px] sm:min-h-[520px] lg:min-h-0 lg:h-full max-w-[760px] w-full">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
            <button type="button" className="absolute right-5 top-5 h-14 w-14 rounded-full bg-white text-[#760000] shadow-lg flex items-center justify-center hover:scale-105 transition" aria-label="Add to wishlist">
              <Icon className="h-7 w-7"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></Icon>
            </button>
          </div>

          <aside className="lg:pt-2 h-full">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-bold leading-tight tracking-tight text-gray-950 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-7">
              <div className="flex text-[#760000] text-lg tracking-[0.12em]" aria-label={`${product.rating || 5} stars`}>
                {'★'.repeat(Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1))) + '☆'.repeat(5 - Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)))}
              </div>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="font-sans text-3xl font-extrabold text-[#760000]">₹{product.currentPrice}</span>
              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
              <span className="rounded-md border border-red-200 bg-red-50 px-4 py-2 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-[#760000]">
                {discount}% OFF
              </span>
            </div>

            <p className="body-copy text-[15px] text-gray-700 max-w-xl mb-7">{product.description}</p>

            {/* Customization Fields */}
            {product.personalizationType && product.personalizationType !== 'None' && (
              <div className="mb-8 p-6 rounded-2xl bg-[#fff9f8] border border-red-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Pencil className="h-4 w-4 text-[#760000]" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#760000]">Personalize Your Gift</h3>
                </div>

                {(product.personalizationType === 'Text' || product.personalizationType === 'Both') && (
                  <div className="space-y-2 mb-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <Type className="h-3 w-3" />
                      Your Message / Name
                    </label>
                    <input
                      type="text"
                      value={personalizationText}
                      onChange={(e) => setPersonalizationText(e.target.value)}
                      placeholder="Enter the name or message..."
                      className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-[#760000]/30 focus:ring-4 focus:ring-[#760000]/5 outline-none transition bg-white text-sm"
                    />
                  </div>
                )}

                {(product.personalizationType === 'Photo' || product.personalizationType === 'Both') && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <ImageIcon className="h-3 w-3" />
                      Upload Photo
                    </label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setIsOptimizing(true);
                            try {
                              const compressed = await compressImage(file);
                              setPersonalizationPhoto(compressed);
                              const reader = new FileReader();
                              reader.onloadend = () => setPhotoPreview(reader.result);
                              reader.readAsDataURL(compressed);
                              toast.success('Photo uploaded!');
                            } catch (err) {
                              toast.error('Failed to process image');
                            } finally {
                              setIsOptimizing(false);
                            }
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`h-24 w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all ${photoPreview ? 'border-green-200 bg-green-50' : 'border-red-100 bg-white group-hover:border-[#760000]/30'}`}>
                        {isOptimizing ? (
                          <p className="text-xs text-[#760000] animate-pulse font-bold">Optimizing Image...</p>
                        ) : photoPreview ? (
                          <div className="flex items-center gap-3 px-4">
                            <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded object-cover border border-white shadow-sm" />
                            <p className="text-xs text-green-700 font-bold uppercase tracking-wider">Image Ready</p>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="h-5 w-5 text-gray-400 mb-1" />
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tap to upload high-res photo</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mb-8">
              <h2 className="micro-label text-gray-900 mb-4">What's Inside?</h2>
              <ul className="space-y-3">
                {essentials.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-sans text-sm font-normal text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#760000] text-[#760000]">
                      <Icon className="h-3.5 w-3.5"><path d="m5 12 4 4L19 6" /></Icon>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="micro-label text-gray-900 mb-3">Select Quantity</p>
              <div className="inline-grid grid-cols-3 h-12 w-44 rounded-md border border-gray-300 overflow-hidden">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="text-[#760000] font-bold hover:bg-red-50" aria-label="Decrease quantity">−</button>
                <span className="flex items-center justify-center text-sm font-bold border-x border-gray-200">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} className="text-[#760000] font-bold hover:bg-red-50" aria-label="Increase quantity">+</button>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                type="button" 
                onClick={() => { 
                  if (product.personalizationType === 'Text' && !personalizationText) {
                    toast.error('Please enter your custom text');
                    return;
                  }
                  if (product.personalizationType === 'Photo' && !personalizationPhoto) {
                    toast.error('Please upload your photo');
                    return;
                  }
                  if (product.personalizationType === 'Both' && (!personalizationText || !personalizationPhoto)) {
                    toast.error('Please provide both text and photo');
                    return;
                  }

                  addToCart({
                    ...product,
                    customization: {
                      text: personalizationText,
                      photo: photoPreview // Using preview for now, real app would upload to cloud first
                    }
                  }, quantity); 
                  toast.success('Product added successfully'); 
                }} 
                className="w-full h-14 rounded-md bg-[#760000] text-white action-link shadow-[0_12px_26px_rgba(118,0,0,0.22)] hover:bg-[#760000] transition"
              >
                Add To Cart
              </button>
              <button
                type="button"
                onClick={handleOrderOnWhatsApp}
                className="w-full h-14 rounded-md flex items-center justify-center gap-2.5 bg-[#25D366] text-white action-link border border-[#20bd5a] shadow-[0_10px_24px_rgba(37,211,102,0.35)] hover:bg-[#20bd5a] hover:shadow-[0_12px_28px_rgba(37,211,102,0.45)] transition-all duration-300"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
                Order on WhatsApp
              </button>
            </div>
          </aside>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-y-8 gap-x-5 rounded-lg bg-[#fff5f4] border border-red-50 px-4 sm:px-5 py-7">
          {trustItems.map((item) => (
            <div key={item.title} className="text-center lg:border-r last:border-r-0 border-red-100 px-2">
              <div className="mx-auto mb-2.5 text-[#760000] flex h-9 w-9 items-center justify-center">
                <Icon className="h-8 w-8">{item.icon}</Icon>
              </div>
              <h3 className="font-heading text-[12px] leading-snug font-bold tracking-[0.03em] text-gray-950">
                {item.title}
              </h3>
              <p className="font-sans text-[11px] leading-snug font-normal text-gray-500 mt-1.5">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-10 grid lg:grid-cols-[0.44fr_0.56fr] overflow-hidden rounded-xl bg-[#fff2f0] min-h-[140px] lg:min-h-[200px]">
          <div className="h-[140px] sm:h-[170px] lg:h-full lg:min-h-[200px]">
            <img
              src={touchImage}
              alt="Add a personal touch to your gift"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="p-4 sm:p-5 lg:p-6 flex flex-col justify-center">
            <p className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#760000] mb-2">
              Make It Extra Special
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight text-gray-900 mb-2.5 leading-tight">
              Add a <span className="text-[#760000]">Personal</span> Touch
            </h2>
            <p className="font-sans text-base sm:text-lg text-gray-700 leading-relaxed mb-5 max-w-xl">
              Add a handwritten note to make your gift even more meaningful.
            </p>
            <button
              type="button"
              className="w-max rounded-md border-2 border-[#760000] px-6 py-2.5 font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#760000] hover:bg-white transition"
            >
              Add Gift Note
            </button>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="section-eyebrow">
                Recommended For You
              </span>
              <h2 className="section-title">
                You May Also Like
              </h2>
            </div>
            <Link to="/collections" className="action-link text-[#760000] hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map((item) => (
              <Link key={item._id} to={`/product/${item._id}`} className="group">
                <div className="relative aspect-[1.28] rounded-md overflow-hidden bg-red-50 mb-4">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" decoding="async" />
                  <span className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white text-[#760000] flex items-center justify-center shadow-md">
                    <Icon className="h-5 w-5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></Icon>
                  </span>
                </div>
                <h3 className="card-title mb-3 line-clamp-1">{item.name}</h3>
                <div className="flex items-center gap-2 mb-5">
                  <span className="font-sans text-[#760000] font-extrabold">₹{item.currentPrice}</span>
                  <span className="font-sans text-gray-400 line-through text-sm font-normal">₹{item.originalPrice}</span>
                </div>
                <span className="block w-full rounded-md border border-[#760000] py-3 text-center action-link text-[11px] text-[#760000] group-hover:bg-[#760000] group-hover:text-white transition">
                  Add To Cart
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 sm:mt-24">
          {/* Reviews Header & Form Section */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-6">
                <Heart className="h-3 w-3 fill-[#760000] text-[#760000]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#760000]">Customer Reviews</span>
              </div>
              
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight text-gray-900 mb-6">
                Loved by <span className="text-[#760000]">CRAFTORIA</span> Customers
              </h2>
              
              <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-10 font-sans italic">
                Hear what our community says about their CRAFTORIA experience.
              </p>
              
              {/* Stats Cards */}
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#760000]/5 flex items-center justify-center border border-[#760000]/10">
                    <Star className="h-5 w-5 fill-[#760000] text-[#760000]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">4.9/5</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Average Rating</p>
                  </div>
                </div>
                
                <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#760000]/5 flex items-center justify-center border border-[#760000]/10">
                    <Users className="h-5 w-5 text-[#760000]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">12K+</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Happy Customers</p>
                  </div>
                </div>
                
                <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#760000]/5 flex items-center justify-center border border-[#760000]/10">
                    <MessageSquare className="h-5 w-5 text-[#760000]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 leading-none">3K+</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Write a Review Card */}
            <div className="bg-[#fff9f8] p-8 rounded-2xl border-2 border-red-100 shadow-sm relative overflow-hidden">
              <h3 className="text-sm font-bold text-[#760000] uppercase tracking-widest mb-6">Write a Review</h3>
              
              {isSignedIn ? (
                <form onSubmit={handleReviewSubmit} className="space-y-6 relative z-10">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-all duration-200 transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`h-7 w-7 ${star <= rating
                              ? 'fill-[#760000] text-[#760000]'
                              : 'fill-white text-gray-300'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                  
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full text-base p-4 rounded-xl border border-gray-100 focus:border-[#760000]/30 focus:ring-4 focus:ring-[#760000]/5 outline-none min-h-[120px] transition bg-white"
                  />
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#760000] text-white text-sm font-bold uppercase tracking-[0.15em] rounded-xl flex items-center justify-center gap-3 hover:bg-[#8d0000] shadow-[0_10px_20px_rgba(118,0,0,0.15)] transition disabled:opacity-50"
                   >
                    <Pencil className="h-4 w-4" />
                    {isSubmitting ? 'Posting...' : 'Post Review'}
                  </button>
                  
                  <div className="flex items-center gap-2 text-gray-400 justify-center">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Secure & Verified Feedback</span>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-6 font-sans">Please sign in to share your experience with this product.</p>
                  <Link 
                    to="/checkout" 
                    className="inline-block px-8 py-3 bg-[#760000] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-800 transition shadow-lg shadow-red-100"
                  >
                    Sign In to Review
                  </Link>
                </div>
              )}
            </div>
          </div>
             {/* User Reviews List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review._id} className="bg-white p-10 rounded-[28px] border border-gray-100 flex flex-col hover:shadow-[0_22px_45px_rgba(0,0,0,0.06)] transition-all duration-500 relative group min-h-[340px]">
                
                {/* 1. Stars at Top */}
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating 
                          ? "fill-[#760000] text-[#760000]" 
                          : "fill-gray-100 text-gray-100"
                      }`}
                    />
                  ))}
                </div>

                {/* 2. Testimonial Text in Middle */}
                <div className="flex-grow mb-10">
                  <p className="text-[#333] text-lg leading-[1.6] font-medium tracking-tight">
                    "{review.comment}"
                  </p>
                </div>

                {/* 3. User Info at Bottom */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {review.userImage ? (
                      <img 
                        src={review.userImage} 
                        alt={review.userName} 
                        className="h-14 w-14 rounded-full object-cover border-2 border-red-50"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-[#760000] font-bold text-lg border-2 border-red-50">
                        {review.userName?.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase tracking-[0.1em] text-gray-900">
                        {review.userName}
                      </span>
                    </div>
                  </div>

                  {/* Admin Delete Action */}
                  {isAdmin && (
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this review?')) {
                          deleteReview(review._id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 h-9 w-9 rounded-full flex items-center justify-center text-red-200 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                      title="Delete Review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  
                  <div className="absolute top-8 right-8">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center bg-gray-50/30 rounded-[32px] border-2 border-dashed border-gray-100">
                <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-8 w-8 text-gray-200" />
                </div>
                <p className="font-serif text-2xl text-gray-400 italic">No reviews yet for this product.</p>
                <p className="text-gray-500 mt-2 text-sm italic">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
             <button className="px-8 py-3 rounded-full border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-3 group">
                View All Reviews
                <Icon className="h-4 w-4 group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>
             </button>
          </div>
        </section>

      </section>
    </div>
  );
};

export default ProductDetail;
