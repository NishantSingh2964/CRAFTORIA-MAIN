import React from 'react';

const Icon = ({ children, className = 'h-5 w-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
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

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-sans text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition';

const contactDetails = [
  {
    title: 'Call Us',
    text: '+91 78590 84667',
    sub: 'Mon–Sat, 10am – 7pm',
    icon: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </>
    ),
  },
  {
    title: 'Email Us',
    text: 'hello@craftoria.com',
    sub: 'We reply within 24 hours',
    icon: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    ),
  },
  {
    title: 'Visit Studio',
    text: 'Jaipur, Rajasthan',
    sub: 'By appointment only',
    icon: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
];

const ExperienceForm = ({ form, updateField, onSubmit, onWhatsApp }) => {
  return (
    <section className="mt-24 pt-16 sm:pt-20 border-t border-gray-200/80">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-10 sm:mb-12">
        <div className="max-w-2xl">
          <span className="section-eyebrow">We&apos;re Here To Help</span>
          <h2 className="section-title">Tell Us About Your Experience</h2>
          <p className="body-copy mt-4 max-w-xl">
            Have a custom design in mind or need help with bulk personalization? Share your idea and
            our team will craft something unforgettable for you.
          </p>
        </div>
        <button
          type="button"
          onClick={onWhatsApp}
          className="inline-flex items-center gap-2 shrink-0 self-start lg:mt-6 px-6 py-2.5 rounded-xl bg-[#25D366] text-white font-sans text-xs font-bold uppercase tracking-[0.15em] border border-[#20bd5a] shadow-[0_6px_16px_rgba(37,211,102,0.2)] hover:bg-[#20bd5a] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat on WhatsApp
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-4 space-y-4">
          {contactDetails.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
                <Icon>{item.icon}</Icon>
              </span>
              <div>
                <p className="micro-label text-gray-400 mb-1">
                  {item.title}
                </p>
                <p className="font-sans text-[15px] font-semibold text-gray-800 leading-snug">{item.text}</p>
                <p className="font-sans text-xs text-gray-500 mt-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Icon className="h-5 w-5">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </Icon>
            </span>
            <h3 className="font-serif text-xl font-bold text-gray-900 tracking-tight">
              Send Us a Message
            </h3>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="micro-label text-gray-500 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="micro-label text-gray-500 mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@email.com"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="micro-label text-gray-500 mb-1.5 block">Phone Number</label>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-red-600/10 focus-within:border-red-600 transition-all">
                  <span className="inline-flex items-center px-4 bg-gray-50 border-r border-gray-200 text-[13px] font-semibold text-gray-500 shrink-0">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                    }
                    placeholder="10-digit mobile"
                    className="flex-1 px-4 py-3 font-sans text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="micro-label text-gray-500 mb-1.5 block">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="Custom personalized order">Custom personalized order</option>
                  <option value="Bulk / corporate order">Bulk / corporate order</option>
                  <option value="Design & engraving help">Design & engraving help</option>
                  <option value="Order status">Order status</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="micro-label text-gray-500 mb-1.5 block">Your Message</label>
              <textarea
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Tell us about your gift idea, quantity, occasion, or any special requests..."
                rows={5}
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto min-w-[200px] h-12 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold uppercase tracking-[0.15em] shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ExperienceForm;
