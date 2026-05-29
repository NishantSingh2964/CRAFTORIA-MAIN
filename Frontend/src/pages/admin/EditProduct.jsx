import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2, Save, Upload, X, Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useOccasions } from '../../contexts/OccasionContext';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getAuthToken } from '../../services/api';
import { compressImage } from '../../utils/imageCompressor';

const CATEGORIES = [
  'Personalized Gifts',
  'Flowers & Bouquets',
  'Combos & Hampers',
  'Cakes',
  'Chocolates',
  'Home & Living',
  'Soft Toys',
  'Gift Cards',
  'Corporate Gifts',
];

const BADGE_OPTIONS = [
  'None',
  'New Arrival',
  'Best Seller',
  'Limited Edition',
  'Featured',
  'Trending',
  'Premium',
  'Handcrafted',
  'Offer',
  'Sale',
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById } = useProducts();
  const { occasions } = useOccasions();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedOccasions, setSelectedOccasions] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Personalized Gifts',
    originalPrice: '',
    currentPrice: '',
    costPrice: '',
    stock: '',
    badge: '',
    isAvailable: true,
  });

  // Fetch existing product data
  useEffect(() => {
    const loadProduct = async () => {
      setFetching(true);
      const result = await fetchProductById(id);
      if (result.success) {
        const p = result.data;
        setFormData({
          name: p.name || '',
          description: p.description || '',
          category: p.category || 'Personalized Gifts',
          originalPrice: p.originalPrice || '',
          currentPrice: p.currentPrice || '',
          costPrice: p.costPrice || '',
          stock: p.stock ?? '',
          badge: p.badge || '',
          isAvailable: p.isAvailable !== false,
        });
        setPreview(p.image || null);
        // Pre-select occasions (works whether they are IDs or populated objects)
        const ids = (p.occasions || []).map(o => (typeof o === 'object' ? o._id : o));
        setSelectedOccasions(ids);
      } else {
        toast.error('Failed to load product');
        navigate('/admin/products');
      }
      setFetching(false);
    };
    loadProduct();
  }, [id]);

  const updateField = (key, value) => setFormData(curr => ({ ...curr, [key]: value }));

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const loadingToast = toast.loading('Optimizing image for speed...');
      try {
        const compressed = await compressImage(selectedFile);
        setFile(compressed);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(compressed);
        toast.success('Image optimized!', { id: loadingToast });
      } catch (error) {
        toast.error('Failed to process image', { id: loadingToast });
        console.error(error);
      }
    }
  };

  const toggleOccasion = (occId) => {
    setSelectedOccasions(prev =>
      prev.includes(occId) ? prev.filter(o => o !== occId) : [...prev, occId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getAuthToken();
      const submissionData = new FormData();
      Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
      submissionData.append('occasions', JSON.stringify(selectedOccasions));
      if (file) submissionData.append('image', file);

      await api.patch(`/products/admin/${id}`, submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="grid min-h-[60vh] place-items-center font-serif text-2xl text-[#8d0000]">
        Loading product...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Link
            to="/admin/products"
            className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8b7772] transition hover:text-[#8d0000]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Listing
          </Link>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Edit Product</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">Update product details, pricing and occasion tags.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-[#8d0000] px-7 text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_28px_rgba(141,0,0,0.22)] transition hover:bg-[#760000] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        {/* LEFT */}
        <div className="space-y-5">
          {/* General Info */}
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-7 font-serif text-2xl font-black text-[#171111]">General Information</h2>
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Product Name</span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#201514] outline-none transition focus:border-[#9a1515] focus:bg-white"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Description</span>
                <textarea
                  rows="5"
                  required
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  className="w-full resize-none rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 py-3 text-sm text-[#201514] outline-none transition focus:border-[#9a1515] focus:bg-white"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Category</span>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={e => updateField('category', e.target.value)}
                      className="h-12 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#253040] outline-none transition focus:border-[#9a1515] focus:bg-white"
                    >
                      {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52606d]" />
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Stock Quantity</span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={e => updateField('stock', e.target.value)}
                    className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#201514] outline-none transition focus:border-[#9a1515] focus:bg-white"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">
                  Badge / Tag <span className="normal-case font-normal tracking-normal text-[#958783]">(optional)</span>
                </span>
                <div className="relative">
                  <select
                    value={formData.badge || 'None'}
                    onChange={e => updateField('badge', e.target.value === 'None' ? '' : e.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#253040] outline-none transition focus:border-[#9a1515] focus:bg-white"
                  >
                    {BADGE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52606d]" />
                </div>
              </label>
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-6 font-serif text-2xl font-black text-[#171111]">Pricing</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { key: 'originalPrice', label: 'Original Price (MRP)' },
                { key: 'currentPrice', label: 'Selling Price' },
                { key: 'costPrice', label: 'Cost Price' },
              ].map(({ key, label }) => (
                <label key={key} className="block space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">{label}</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#958783]">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData[key]}
                      onChange={e => updateField(key, e.target.value)}
                      className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] pl-8 pr-4 text-sm text-[#201514] outline-none transition focus:border-[#9a1515] focus:bg-white"
                    />
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Occasions */}
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-2 font-serif text-2xl font-black text-[#171111]">Gift Occasions</h2>
            <p className="mb-5 text-xs font-medium text-[#8b7772]">Tag this product with relevant gifting occasions.</p>

            {selectedOccasions.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedOccasions.map(occId => {
                  const occ = occasions.find(o => o._id === occId);
                  return occ ? (
                    <span key={occId} className="inline-flex items-center gap-1.5 rounded-full bg-[#8d0000] px-3 py-1.5 text-xs font-black text-white">
                      {occ.name}
                      <button type="button" onClick={() => toggleOccasion(occId)} className="opacity-80 hover:opacity-100">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {occasions.length === 0 ? (
                <p className="col-span-full text-sm italic text-[#958783]">No occasions available.</p>
              ) : occasions.map(occ => {
                const isSelected = selectedOccasions.includes(occ._id);
                return (
                  <button
                    key={occ._id}
                    type="button"
                    onClick={() => toggleOccasion(occ._id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left text-xs font-black transition-all ${
                      isSelected
                        ? 'border-[#8d0000] bg-[#8d0000]/5 text-[#8d0000]'
                        : 'border-[#e4d5cf] bg-[#fafafa] text-[#52606d] hover:border-[#9a1515] hover:bg-white'
                    }`}
                  >
                    {occ.image
                      ? <img src={occ.image} alt={occ.name} className="h-8 w-8 shrink-0 rounded-lg object-cover" />
                      : <span className="h-8 w-8 shrink-0 rounded-lg bg-[#f0e3df]" />
                    }
                    <span className="flex-1 leading-tight">{occ.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#8d0000]" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-5 font-serif text-2xl font-black text-[#171111]">Imagery</h2>
            <label className="relative flex min-h-[290px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8b7ae] bg-[#fffaf7] text-center transition hover:border-[#9a1515]">
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 z-20 cursor-pointer opacity-0" />
              {preview ? (
                <>
                  <img src={preview} alt="Product" className="absolute inset-0 h-full w-full rounded-2xl object-cover" />
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); setPreview(null); setFile(null); }}
                    className="absolute right-3 top-3 z-30 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-[#e4d5cf] bg-white shadow-[0_12px_28px_rgba(80,24,18,0.08)]">
                    <Upload className="h-7 w-7 text-[#9aa0ad]" />
                  </span>
                  <span className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-[#9aa0ad]">Replace Image</span>
                  <span className="mt-2 text-[10px] font-black uppercase tracking-wide text-[#9aa0ad]">PNG, JPG or WEBP</span>
                </>
              )}
            </label>
            <p className="mt-3 text-center text-[10px] font-semibold text-[#958783]">Leave unchanged to keep the existing image</p>
          </section>

          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-5 font-serif text-2xl font-black text-[#171111]">Visibility</h2>
            <button
              type="button"
              onClick={() => updateField('isAvailable', !formData.isAvailable)}
              className="flex h-[72px] w-full items-center justify-between rounded-xl border border-[#eef0f3] bg-[#fafafa] px-5 transition hover:border-[#eadbd6]"
            >
              <span className="text-sm font-black uppercase tracking-[0.18em] text-[#52606d]">Live Status</span>
              <span className={`relative h-8 w-14 rounded-full transition ${formData.isAvailable ? 'bg-[#8d0000]' : 'bg-[#cfd5dc]'}`}>
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${formData.isAvailable ? 'right-1' : 'left-1'}`} />
              </span>
            </button>
            <p className="mt-5 border-l-2 border-[#8d0000] pl-4 text-xs italic leading-6 text-[#8b7772]">
              Unpublished items remain in your archive but won't be visible to customers.
            </p>
          </section>
        </aside>
      </div>
    </form>
  );
};

export default EditProduct;
