import React, { useRef, useState } from 'react';
import { CheckCircle2, ImageIcon, Pencil, Type, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const PersonalizationModal = ({ isOpen, onClose, onConfirm, product }) => {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null); // base64, safe for DB storage
  const fileInputRef = useRef(null);

  if (!isOpen || !product) return null;

  const { personalizationType } = product;
  const isTextRequired = personalizationType === 'Text' || personalizationType === 'Both';
  const isPhotoRequired = personalizationType === 'Photo' || personalizationType === 'Both';

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB');
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (isTextRequired && !text.trim()) {
      toast.error('Please enter your message/name');
      return;
    }
    if (isPhotoRequired && !photo) {
      toast.error('Please upload a photo');
      return;
    }

    onConfirm({ text, photo, photoPreview });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-5 sm:p-4">
      <div
        className="absolute inset-0 animate-in fade-in bg-black/40 backdrop-blur-sm duration-300"
        onClick={onClose}
      />

      <div className="relative max-h-[calc(100vh-2.5rem)] w-full max-w-[420px] overflow-y-auto rounded-xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 sm:max-w-lg">
        <div className="p-4 sm:p-7">
          <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5 sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-lg bg-red-50 p-2 text-[#760000]">
                <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <h2 className="min-w-0 font-serif text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                Personalize Your Gift
              </h2>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close personalization modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mb-4 font-sans text-xs leading-relaxed text-gray-500 sm:text-sm">
            Share the details below to make your gift truly unique and memorable.
          </p>

          <div className="space-y-5">
            {isTextRequired && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-700 sm:text-xs sm:tracking-widest">
                  <Type className="h-3.5 w-3.5 text-[#760000]" />
                  Your Message / Name
                </label>
                <div className="group relative">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter the name or message..."
                    className="h-13 w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 text-sm font-medium outline-none transition-all focus:border-[#760000]/40 focus:ring-8 focus:ring-[#760000]/5 sm:h-14 sm:px-5"
                  />
                  {text && (
                    <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-in zoom-in text-green-500" />
                  )}
                </div>
              </div>
            )}

            {isPhotoRequired && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-700 sm:text-xs sm:tracking-widest">
                  <ImageIcon className="h-3.5 w-3.5 text-[#760000]" />
                  Upload Photo
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
                  className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border-2 border-dashed p-5 transition-all duration-300 sm:p-8 ${
                    photoPreview
                      ? 'border-green-500 bg-green-50/30'
                      : 'border-[#ffeeed] bg-[#fffaf9] hover:border-[#760000]/20 hover:bg-[#fff5f4]'
                  }`}
                >
                  {photoPreview ? (
                    <div className="animate-in fade-in text-center duration-500">
                      <div className="relative mx-auto mb-3 h-24 w-24 overflow-hidden rounded-lg border-4 border-white shadow-md">
                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                      <p className="flex items-center justify-center gap-1.5 text-xs font-bold text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Photo selected
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#760000] shadow-sm transition-transform duration-300 group-hover:scale-110">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-[#760000] opacity-70 transition-opacity group-hover:opacity-100 sm:text-sm">
                        TAP TO UPLOAD PHOTO
                      </p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-tight text-gray-400">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onConfirm({ text: '', photo: null, photoPreview: null });
                onClose();
              }}
              className="h-11 cursor-pointer rounded-lg bg-gray-900 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-black sm:h-12 sm:tracking-widest"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              className="h-11 cursor-pointer rounded-lg bg-[#760000] font-heading text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_20px_-6px_rgba(118,0,0,0.5)] transition-all duration-300 hover:bg-[#5e0000] active:scale-[0.98] sm:h-12 sm:text-sm sm:tracking-widest"
            >
              Add
            </button>
          </div>

          <p className="mt-3 text-center text-[9px] font-bold uppercase leading-relaxed tracking-[0.12em] text-[#760000] opacity-70 sm:text-[10px] sm:tracking-widest">
            Customization Fee: +₹200, applied only when personalizing
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationModal;
