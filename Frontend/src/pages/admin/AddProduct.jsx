import React, { useState } from 'react';
import { ChevronDown, Loader2, Save, Upload, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useOccasions } from '../../contexts/OccasionContext';
import toast from 'react-hot-toast';
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

const PERSONALIZATION_TYPES = ['None', 'Text', 'Photo', 'Both'];

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { occasions } = useOccasions();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [files, setFiles] = useState([null, null, null, null]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [occasionDropdown, setOccasionDropdown] = useState(false);

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
    personalizationType: 'None',
  });

  const updateField = (key, value) => {
    setFormData(curr => ({ ...curr, [key]: value }));
  };

  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleImageChange = async (e, index) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setIsOptimizing(true);
      try {
        const compressed = await compressImage(selectedFile);
        
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[index] = compressed;
          return newFiles;
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => {
            const newPreviews = [...prev];
            newPreviews[index] = reader.result;
            return newPreviews;
          });
          setIsOptimizing(false);
          toast.success(`Image ${index + 1} ready`);
        };
        reader.readAsDataURL(compressed);
      } catch (error) {
        setIsOptimizing(false);
        toast.error('Failed to process image');
        console.error(error);
      }
    }
  };

  const removeImage = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = null;
      return newFiles;
    });
    setPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });
  };

  const toggleOccasion = (id) => {
    setSelectedOccasions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files[0]) {
      toast.error('Please upload a Main Image (Slot 1)');
      return;
    }

    setLoading(true);
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    
    // Filter out null files and append to 'images'
    files.forEach(file => {
      if (file) submissionData.append('images', file);
    });

    // Send occasions as a JSON string (matches backend parser)
    submissionData.append('occasions', JSON.stringify(selectedOccasions));

    const result = await addProduct(submissionData);
    if (result.success) {
      toast.success('Product published successfully!');
      navigate('/admin/products');
    } else {
      toast.error(result.error || 'Failed to publish product');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Create Item</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">Add a new masterpiece to your curated collection.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-[#8d0000] px-7 text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_28px_rgba(141,0,0,0.22)] transition hover:bg-[#760000] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {loading ? 'Publishing...' : 'Publish Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        {/* LEFT: General Info */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-7 font-serif text-2xl font-black text-[#171111]">General Information</h2>
            <div className="space-y-5">
              {/* Name */}
              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Product Name</span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g. Midnight Truffle Basket"
                  className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#201514] outline-none transition placeholder:text-[#958783] focus:border-[#9a1515] focus:bg-white"
                />
              </label>

              {/* Description */}
              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Description</span>
                <textarea
                  rows="5"
                  required
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="Describe the product and its premium contents..."
                  className="w-full resize-none rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 py-3 text-sm text-[#201514] outline-none transition placeholder:text-[#958783] focus:border-[#9a1515] focus:bg-white"
                />
              </label>

              {/* Category + Stock */}
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
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Personalization Option</span>
                  <div className="relative">
                    <select
                      value={formData.personalizationType}
                      onChange={e => updateField('personalizationType', e.target.value)}
                      className="h-12 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#253040] outline-none transition focus:border-[#9a1515] focus:bg-white"
                    >
                      {PERSONALIZATION_TYPES.map(type => <option key={type} value={type}>{type} Entry</option>)}
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
                    placeholder="0"
                    className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#201514] outline-none transition placeholder:text-[#958783] focus:border-[#9a1515] focus:bg-white"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Badge / Tag <span className="text-[#958783] normal-case font-normal tracking-normal">(optional)</span></span>
                <div className="relative">
                  <select
                    value={formData.badge}
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
                      placeholder="0"
                      className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] pl-8 pr-4 text-sm text-[#201514] outline-none transition placeholder:text-[#958783] focus:border-[#9a1515] focus:bg-white"
                    />
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Occasions Multi-Select */}
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-2 font-serif text-2xl font-black text-[#171111]">Gift Occasions</h2>
            <p className="mb-5 text-xs font-medium text-[#8b7772]">Tag this product with relevant gifting occasions. It will appear in those category filters on the store.</p>

            {/* Selected Tags */}
            {selectedOccasions.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedOccasions.map(id => {
                  const occ = occasions.find(o => o._id === id);
                  return occ ? (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#8d0000] px-3 py-1.5 text-xs font-black text-white"
                    >
                      {occ.name}
                      <button type="button" onClick={() => toggleOccasion(id)} className="ml-1 opacity-80 hover:opacity-100">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Occasion Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {occasions.length === 0 ? (
                <p className="col-span-full text-sm text-[#958783] italic">No occasions available. Add some from the Occasions page first.</p>
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
                    {/* Occasion image thumbnail */}
                    {occ.image ? (
                      <img src={occ.image} alt={occ.name} className="h-8 w-8 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="h-8 w-8 shrink-0 rounded-lg bg-[#f0e3df]" />
                    )}
                    <span className="flex-1 leading-tight">{occ.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#8d0000]" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT: Image + Visibility */}
        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-1 font-serif text-2xl font-black text-[#171111]">Imagery</h2>
            <p className="mb-5 text-[11px] font-medium text-[#8b7772]">Add up to 4 images. Slot 1 is the main card image.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className={idx === 0 ? 'col-span-2' : ''}>
                  <label 
                    className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                      previews[idx] ? 'border-solid border-[#8d0000]' : 'border-[#d8b7ae] bg-[#fffaf7] hover:border-[#9a1515]'
                    } ${idx === 0 ? 'h-[240px]' : 'h-[120px]'}`}
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageChange(e, idx)} 
                      className="absolute inset-0 z-20 cursor-pointer opacity-0" 
                    />
                    
                    {previews[idx] ? (
                      <>
                        <img src={previews[idx]} alt={`Preview ${idx + 1}`} className="absolute inset-0 h-full w-full rounded-[10px] object-cover" />
                        <div className="absolute inset-0 z-10 bg-black/10 transition hover:bg-black/20" />
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); removeImage(idx); }}
                          className="absolute right-2 top-2 z-30 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#8d0000] shadow-lg transition hover:bg-white hover:scale-110"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-3 left-3 z-30 rounded-full bg-[#8d0000] px-3 py-1 text-[10px] font-black uppercase text-white shadow-lg">Main Image</span>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className={`${idx === 0 ? 'h-8 w-8' : 'h-5 w-5'} text-[#d8b7ae] mb-2`} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#9aa0ad]">
                          {idx === 0 ? 'Main Photo' : `Gallery ${idx}`}
                        </span>
                      </div>
                    )}
                    
                    {isOptimizing && idx === 0 && (
                      <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                        <Loader2 className="h-6 w-6 animate-spin text-[#8d0000]" />
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
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
              Unpublished items remain in your archive but won't be visible to customers in the store.
            </p>
          </section>
        </aside>
      </div>
    </form>
  );
};

export default AddProduct;
