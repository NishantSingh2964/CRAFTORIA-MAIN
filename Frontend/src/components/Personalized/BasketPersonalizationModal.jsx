import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  ImageIcon,
  Pencil,
  Type,
  Upload,
  X,
  ShoppingCart,
} from 'lucide-react';
import toast from 'react-hot-toast';

const BasketPersonalizationModal = ({ isOpen, onClose, onConfirm, itemCount }) => {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB');
      return;
    }
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirm = () => {
    onConfirm({ text: text.trim(), photo, photoPreview });
    // Reset state
    setText('');
    setPhoto(null);
    setPhotoPreview(null);
    onClose();
  };

  const handleSkip = () => {
    onConfirm({ text: '', photo: null, photoPreview: null });
    setText('');
    setPhoto(null);
    setPhotoPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-5 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Top accent bar */}
        <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-[#760000] via-red-400 to-[#760000]" />

        <div className="p-5 sm:p-7">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#760000]">
                <Pencil className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold leading-tight text-gray-900">
                  Personalise Your Basket
                </h2>
                <p className="mt-0.5 font-sans text-xs text-gray-500">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} · Add a special touch
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Text message section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-gray-700">
                <Type className="h-3.5 w-3.5 text-[#760000]" />
                Personal Message / Name
                <span className="ml-auto font-sans text-[10px] font-normal normal-case tracking-normal text-gray-400">
                  Optional
                </span>
              </label>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a heartfelt message, name, or special wish..."
                  rows={4}
                  maxLength={300}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 font-sans text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#760000]/40 focus:ring-4 focus:ring-[#760000]/5"
                />
                {text.trim() && (
                  <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex justify-end">
                <span className="font-sans text-[10px] text-gray-400">{text.length}/300</span>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400">and / or</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* Photo upload section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-gray-700">
                <ImageIcon className="h-3.5 w-3.5 text-[#760000]" />
                Upload a Photo
                <span className="ml-auto font-sans text-[10px] font-normal normal-case tracking-normal text-gray-400">
                  Optional
                </span>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed p-6 transition-all duration-300 ${
                  photoPreview
                    ? 'border-green-400 bg-green-50/40'
                    : 'border-red-100 bg-[#fffaf9] hover:border-[#760000]/30 hover:bg-[#fff5f4]'
                }`}
              >
                {photoPreview ? (
                  <div className="text-center">
                    <div className="relative mx-auto mb-3 h-28 w-28 overflow-hidden rounded-xl border-4 border-white shadow-md">
                      <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                    <p className="flex items-center justify-center gap-1.5 font-sans text-xs font-bold text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Photo ready
                    </p>
                    <button
                      onClick={handleRemovePhoto}
                      className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-wider text-red-400 hover:text-red-600 transition"
                    >
                      Remove & change
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#760000] shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="font-sans text-sm font-bold text-[#760000] opacity-70 group-hover:opacity-100 transition-opacity">
                      Tap to upload photo
                    </p>
                    <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      JPG, PNG · Max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50/60 px-4 py-3">
            <p className="font-sans text-[11px] leading-relaxed text-amber-800">
              <span className="font-bold">✨ Note:</span> Personalization details will be noted with your order. Our team will get in touch to confirm the design before production.
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={handleSkip}
              className="h-12 rounded-xl border border-gray-200 font-sans text-xs font-bold uppercase tracking-[0.14em] text-gray-600 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            >
              Skip — Add as is
            </button>
            <button
              onClick={handleConfirm}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#760000] font-sans text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_20px_-6px_rgba(118,0,0,0.45)] transition-all duration-300 hover:bg-[#5e0000] active:scale-[0.98]"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketPersonalizationModal;
