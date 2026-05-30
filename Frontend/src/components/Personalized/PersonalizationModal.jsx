import React, { useState, useRef } from 'react';
import { Pencil, Type, ImageIcon, X, Upload, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PersonalizationModal = ({ isOpen, onClose, onConfirm, product }) => {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null); // base64 — safe for DB storage
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
      // Convert to base64 so it persists in DB and admin panel
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-5 sm:p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 text-[#760000]">
                <Pencil className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">Personalize Your Gift</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-900">
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-500 font-sans text-xs sm:text-sm mb-4">
            Share the details below to make your gift truly unique and memorable.
          </p>

          <div className="space-y-5">

            {/* Text Input Section */}
            {isTextRequired && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-widest">
                  <Type className="h-3.5 w-3.5 text-[#760000]" />
                  Your Message / Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter the name or message..."
                    className="w-full h-14 px-5 rounded-lg border border-gray-200 focus:border-[#760000]/40 focus:ring-8 focus:ring-[#760000]/5 outline-none transition-all bg-gray-50/30 text-sm font-medium"
                  />
                  {text && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-in zoom-in" />}
                </div>
              </div>
            )}

            {/* Photo Upload Section */}
            {isPhotoRequired && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-widest">
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
                  className={`relative cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 overflow-hidden group
                    ${photoPreview ? 'border-green-500 bg-green-50/30' : 'border-[#ffeeed] bg-[#fffaf9] hover:bg-[#fff5f4] hover:border-[#760000]/20'}`}
                >
                  {photoPreview ? (
                    <div className="text-center animate-in fade-in duration-500">
                      <div className="relative mx-auto mb-3 w-24 h-24 rounded-lg overflow-hidden border-4 border-white shadow-md">
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold text-green-600 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Photo selected
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-white text-[#760000] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-bold text-[#760000] opacity-70 group-hover:opacity-100 transition-opacity">TAP TO UPLOAD HIGH-RES PHOTO</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mt-2 tracking-tighter">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => {
                onConfirm({ text: '', photo: null, photoPreview: null });
                onClose();
              }}
              className="flex-1 h-12 rounded-lg bg-gray-900 text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-black transition-all duration-300 cursor-pointer"
            >
              Skip &amp; Add Plain
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 h-12 rounded-lg bg-[#760000] text-white font-heading text-sm font-bold uppercase tracking-widest shadow-[0_8px_20px_-6px_rgba(118,0,0,0.5)] hover:bg-[#5e0000] transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              Confirm &amp; Add
            </button>
          </div>

          {/* Fee Notice */}
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[#760000] mt-3 opacity-70">
            ✨ Customization Fee: +₹200 — applied only when personalizing
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationModal;
