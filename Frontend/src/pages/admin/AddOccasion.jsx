import React, { useState } from 'react';
import { ChevronDown, Loader2, Save, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOccasions } from '../../contexts/OccasionContext';
import toast from 'react-hot-toast';
import { compressImage } from '../../utils/imageCompressor';

const AddOccasion = () => {
  const navigate = useNavigate();
  const { addOccasion } = useOccasions();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    filter: '',
    desc: '',
    tag: 'New Collection',
    isActive: true,
  });

  const updateField = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const loadingToast = toast.loading('Optimizing image for speed...');
      try {
        const compressed = await compressImage(selectedFile, 1600); // Higher width for occasion banners
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.filter || !formData.desc || !formData.tag) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!file) {
      toast.error('Please upload an image for the occasion');
      return;
    }

    setLoading(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => submissionData.append(key, formData[key]));
    submissionData.append('image', file);

    const result = await addOccasion(submissionData);
    if (result.success) {
      toast.success('Occasion created successfully!');
      navigate('/admin/occasions');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Create Occasion</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">Add a new category for special gifting moments.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-[#8d0000] px-7 text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_28px_rgba(141,0,0,0.22)] transition hover:bg-[#760000] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {loading ? 'Publishing...' : 'Publish Occasion'}
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
          <h2 className="mb-7 font-serif text-2xl font-black text-[#171111]">Category Details</h2>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block space-y-3">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Occasion Name</span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField('name', val);
                    // Generate filter slug automatically if filter is empty or matches previous slug logic
                    if (!formData.filter || formData.filter === formData.name.toLowerCase().replace(/\s+/g, '-')) {
                        updateField('filter', val.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Birthday Magic"
                  className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#201514] outline-none transition placeholder:text-[#958783] focus:border-[#9a1515] focus:bg-white"
                />
              </label>

              <label className="block space-y-3">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Filter Key (Slug)</span>
                <input
                  type="text"
                  required
                  value={formData.filter}
                  onChange={(e) => updateField('filter', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. birthday-magic"
                  className="h-12 w-full rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#201514] outline-none transition placeholder:text-[#958783] focus:border-[#9a1515] focus:bg-white"
                />
              </label>
            </div>

            <label className="block space-y-3">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Description</span>
              <textarea
                rows="4"
                required
                value={formData.desc}
                onChange={(e) => updateField('desc', e.target.value)}
                placeholder="Briefly describe what makes this gifting occasion special..."
                className="w-full resize-none rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 py-3 text-sm text-[#201514] outline-none transition placeholder:text-[#958783] focus:border-[#9a1515] focus:bg-white"
              />
            </label>

            <label className="block space-y-3">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#8d0000]">Tag / Badge</span>
              <div className="relative">
                <select
                  value={formData.tag}
                  onChange={(e) => updateField('tag', e.target.value)}
                  className="h-12 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-[#fafafa] px-4 text-sm text-[#253040] outline-none transition focus:border-[#9a1515] focus:bg-white"
                >
                  <option>New Collection</option>
                  <option>Best Seller</option>
                  <option>Limited Edition</option>
                  <option>Trending Now</option>
                  <option>Premium Pick</option>
                  <option>Seasonal Special</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52606d]" />
              </div>
            </label>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-5 font-serif text-2xl font-black text-[#171111]">Cover Imagery</h2>
            <label className="relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8b7ae] bg-[#fffaf7] text-center transition hover:border-[#9a1515]">
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 z-20 cursor-pointer opacity-0" />
              {preview ? (
                <>
                  <img src={preview} alt="Occasion preview" className="absolute inset-0 h-full w-full rounded-2xl object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreview(null);
                      setFile(null);
                    }}
                    className="absolute right-3 top-3 z-30 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-[#e4d5cf] bg-white shadow-[0_12px_28px_rgba(80,24,18,0.08)]">
                    <Upload className="h-7 w-7 text-[#9aa0ad]" />
                  </span>
                  <span className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-[#9aa0ad]">Choose File</span>
                  <span className="mt-2 text-[10px] font-black uppercase tracking-wide text-[#9aa0ad]">PNG, JPG or WEBP (16:9 recommended)</span>
                </>
              )}
            </label>
          </section>

          <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <h2 className="mb-5 font-serif text-2xl font-black text-[#171111]">Visibility</h2>
            <button
              type="button"
              onClick={() => updateField('isActive', !formData.isActive)}
              className="flex h-[72px] w-full items-center justify-between rounded-xl border border-[#eef0f3] bg-[#fafafa] px-5 transition hover:border-[#eadbd6]"
            >
              <span className="text-sm font-black uppercase tracking-[0.18em] text-[#52606d]">Active State</span>
              <span className={`relative h-8 w-14 rounded-full transition ${formData.isActive ? 'bg-[#8d0000]' : 'bg-[#cfd5dc]'}`}>
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${formData.isActive ? 'right-1' : 'left-1'}`} />
              </span>
            </button>
            <p className="mt-6 border-l-2 border-[#8d0000] pl-4 text-xs italic leading-6 text-[#8b7772]">
              Only active occasions will be featured in the "Gifts By Occasion" section on the main website.
            </p>
          </section>
        </aside>
      </div>
    </form>
  );
};

export default AddOccasion;
