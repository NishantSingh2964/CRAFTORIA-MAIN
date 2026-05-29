import React, { useEffect, useState } from 'react';
import { ChevronDown, Loader2, Save, Upload, X, Check, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePersonalized } from '../../contexts/PersonalizedContext';
import { useOccasions } from '../../contexts/OccasionContext';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getAuthToken } from '../../services/api';
import { compressImage } from '../../utils/imageCompressor';

const CATEGORIES = [
  'Personalized Gifts',
  'Custom Jewelry',
  'Photo Gifts',
  'Engraved Items',
  'Personalized Decor',
  'Custom Apparels',
];

const PERSONALIZATION_TYPES = ['Text', 'Photo', 'Both', 'None'];

const EditPersonalizedProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPersonalizedProductById } = usePersonalized();
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
    personalizationType: 'Text',
    isAvailable: true,
  });

  useEffect(() => {
    const loadProduct = async () => {
      const result = await fetchPersonalizedProductById(id);
      if (result.success) {
        const p = result.data;
        setFormData({
          name: p.name,
          description: p.description,
          category: p.category,
          originalPrice: p.originalPrice,
          currentPrice: p.currentPrice,
          costPrice: p.costPrice,
          stock: p.stock,
          badge: p.badge || '',
          personalizationType: p.personalizationType || 'Text',
          isAvailable: p.isAvailable,
        });
        setPreview(p.image);
        setSelectedOccasions(p.occasions?.map(o => typeof o === 'object' ? o._id : o) || []);
      } else {
        toast.error('Failed to load product details');
        navigate('/admin/personalized-products');
      }
      setFetching(false);
    };
    loadProduct();
  }, [id]);

  const updateField = (key, value) => {
    setFormData(curr => ({ ...curr, [key]: value }));
  };

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        const loadingToast = toast.loading('Optimizing image...');
        try {
          const compressed = await compressImage(selectedFile);
          setFile(compressed);
          const reader = new FileReader();
          reader.onloadend = () => setPreview(reader.result);
          reader.readAsDataURL(compressed);
          toast.success('Image optimized!', { id: loadingToast });
        } catch (error) {
          toast.error('Failed to process image', { id: loadingToast });
        }
    }
  };

  const toggleOccasion = (id) => {
    setSelectedOccasions(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const token = await getAuthToken();
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        if (file) submissionData.append('image', file);
        submissionData.append('occasions', JSON.stringify(selectedOccasions));

        await api.put(`/personalized-products/${id}`, submissionData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        toast.success('Product updated successfully!');
        navigate('/admin/personalized-products');
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
        setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-[#8d0000]" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-[#8d0000]" />
            <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Edit Custom Gift</h1>
          </div>
          <p className="text-sm font-medium text-[#6c5c58]">Modify your personalized product details.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-[#8d0000] px-7 text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_28px_rgba(141,0,0,0.22)] transition hover:bg-[#760000] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {loading ? 'Saving...' : 'Update Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-7 font-serif text-2xl font-black text-[#171111]">Gift Details</h2>
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
                  rows="4"
                  required
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  className="w-full resize-none rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 py-3 text-sm text-[#201514] outline-none transition focus:border-[#9a1515] focus:bg-white"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Personalization Type</span>
                  <div className="relative">
                    <select
                      value={formData.personalizationType}
                      onChange={e => updateField('personalizationType', e.target.value)}
                      className="h-12 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#253040] outline-none transition focus:border-[#9a1515] focus:bg-white"
                    >
                      {PERSONALIZATION_TYPES.map(type => <option key={type} value={type}>{type} Input</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52606d]" />
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Stock</span>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => updateField('stock', e.target.value)}
                    className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#201514] outline-none transition focus:border-[#9a1515] focus:bg-white"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-6 font-serif text-2xl font-black text-[#171111]">Pricing</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { key: 'originalPrice', label: 'MRP (₹)' },
                { key: 'currentPrice', label: 'Sale Price (₹)' },
                { key: 'costPrice', label: 'Cost Price (₹)' },
              ].map(({ key, label }) => (
                <label key={key} className="block space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">{label}</span>
                  <input
                    type="number"
                    required
                    value={formData[key]}
                    onChange={e => updateField(key, e.target.value)}
                    className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#201514] outline-none transition focus:border-[#9a1515] focus:bg-white"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-5 font-serif text-2xl font-black text-[#171111]">Tag Occasions</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {occasions.map(occ => {
                const isSelected = selectedOccasions.includes(occ._id);
                return (
                  <button
                    key={occ._id}
                    type="button"
                    onClick={() => toggleOccasion(occ._id)}
                    className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-[11px] font-bold transition ${
                      isSelected ? 'border-[#8d0000] bg-[#8d0000]/5 text-[#8d0000]' : 'border-[#e4d5cf] bg-[#fafafa] text-[#52606d]'
                    }`}
                  >
                    <span className="truncate">{occ.name}</span>
                    {isSelected && <Check className="h-3 w-3 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-5 font-serif text-2xl font-black text-[#171111]">Product Image</h2>
            <label className="relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8b7ae] bg-[#fffaf7] transition hover:border-[#9a1515]">
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 z-20 cursor-pointer opacity-0" />
              {preview ? (
                <img src={preview} alt="Preview" className="absolute inset-0 h-full w-full rounded-2xl object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-[#9aa0ad] mb-3" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9aa0ad]">Change Photo</span>
                </div>
              )}
            </label>
          </section>

          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-5 font-serif text-2xl font-black text-[#171111]">Visibility</h2>
            <div className="flex items-center justify-between p-4 bg-[#fafafa] rounded-xl border border-[#eef0f3]">
              <span className="text-xs font-black uppercase tracking-wider text-[#52606d]">Active on Store</span>
              <button
                type="button"
                onClick={() => updateField('isAvailable', !formData.isAvailable)}
                className={`relative h-7 w-12 rounded-full transition ${formData.isAvailable ? 'bg-[#8d0000]' : 'bg-[#cfd5dc]'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${formData.isAvailable ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
};

export default EditPersonalizedProduct;
