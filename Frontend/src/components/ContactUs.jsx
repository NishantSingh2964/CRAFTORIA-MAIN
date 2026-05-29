import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import contactBg from '../assets/home/contact.png?w=1600&format=webp&quality=85';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsApp = () => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '');
    const message = encodeURIComponent('Hi CRAFTORIA, I have an inquiry about your luxury gifts.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      toast.error('Configuration error: missing access key');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending your message...');

    const formData = new FormData();
    formData.append('access_key', accessKey);
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('subject', `New Home Inquiry from ${form.name}`);
    formData.append('message', form.message);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        toast.success('Thank you! We will get back to you shortly.', { id: loadingToast });
        setForm({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Error sending message.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={contactBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Column: Branding & Info */}
          <div className="space-y-12">
            <div>
              <span className="section-eyebrow">Get In Touch</span>
              <h2 className="section-title">
                Let Us Help You <br />
                <span className="text-[#760000]">Curate Perfection.</span>
              </h2>
              <p className="mt-6 text-gray-500 max-w-md leading-relaxed">
                Whether it's a bulk order, a custom engraving, or just a simple query, our experts are here to assist you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#760000] group-hover:bg-[#760000] group-hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Call Us</p>
                  <p className="text-sm font-bold text-gray-900">+91 78590 84667</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#760000] group-hover:bg-[#760000] group-hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                  <p className="text-sm font-bold text-gray-900">hello@craftoria.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#760000] group-hover:bg-[#760000] group-hover:text-white transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Studio</p>
                  <p className="text-sm font-bold text-gray-900">Jaipur, Rajasthan, India</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-green-900/10 hover:bg-green-600 hover:scale-[1.02] transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp
            </button>
          </div>

          {/* Right Column: Sleek Form */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_30px_80px_rgba(0,0,0,0.05)] p-8 sm:p-12">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-8">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#760000]/10 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#760000]/10 transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">How can we help?</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#760000]/10 transition-all outline-none resize-none"
                  placeholder="Tell us about your gift idea..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#760000] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-black transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className={`w-4 h-4 transition-transform ${isSubmitting ? 'animate-bounce' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactUs;
