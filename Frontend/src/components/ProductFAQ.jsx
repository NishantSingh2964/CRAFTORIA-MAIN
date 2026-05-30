import React from 'react';
import {
  CreditCard,
  Gift,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import faqBackground from '../assets/home/faq.png?w=1800&format=webp&quality=84';

const faqs = [
  {
    icon: ShoppingBag,
    question: 'How can I place an order on Craftoria?',
    answer:
      'Browse our products, add your favorite items to the cart, and proceed to checkout. Fill in your details, confirm customization if needed, and complete payment to place your order.',
  },
  {
    icon: CreditCard,
    question: 'What payment methods do you accept?',
    answer:
      'We support secure online payments through available checkout options. For assisted orders, you can also connect with us on WhatsApp.',
  },
  {
    icon: Truck,
    question: 'How long does delivery usually take?',
    answer:
      'Delivery timelines depend on your location and selected product. Express delivery is available for eligible orders and locations.',
  },
  {
    icon: Gift,
    question: 'Can I add a personal message to my gift?',
    answer:
      'Yes. You can add a gift note or personalization details wherever the product supports it before adding the item to your cart.',
  },
  {
    icon: MessageCircle,
    question: 'Can I order directly on WhatsApp?',
    answer:
      'Yes. Use the WhatsApp order option on the product page to confirm details, customization, and delivery preferences with our team.',
  },
];

const ProductFAQ = ({ className = '' }) => (
  <section className={`relative overflow-hidden bg-[#fffaf8] pt-10 pb-10 lg:pt-14 lg:pb-14 ${className}`}>
    <img
      src={faqBackground}
      alt=""
      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
    <div className="pointer-events-none absolute inset-0 bg-white/10" />

    <div className="site-container relative grid items-start gap-8 lg:grid-cols-[0.36fr_0.64fr] lg:gap-12">
      <div className="pt-2 lg:min-h-[500px]">
        <div className="mb-4">
          <span className="section-eyebrow">
            Need To Know
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight mt-3">
            Frequently Asked <span className="text-[#760000]">Questions</span>
          </h2>
        </div>

        <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-gray-600">
          Quick answers about delivery, packaging, personalization, and ordering with{' '}
          <span className="font-bold uppercase tracking-wide text-[#760000]">CRAFTORIA.</span>
        </p>
      </div>

      <div className="w-full rounded-2xl border border-red-100/90 bg-white/88 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.10)] backdrop-blur-sm sm:p-6">
        <div className="overflow-hidden rounded-xl border border-red-100">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isFirst = index === 0;

            return (
              <details key={faq.question} className="group border-b border-red-100 last:border-b-0" open={isFirst}>
                <summary className="grid cursor-pointer list-none grid-cols-[44px_minmax(0,1fr)_40px] items-center gap-3 bg-white px-4 py-4 transition hover:bg-red-50/40 group-open:bg-[#fff7f6] sm:grid-cols-[64px_minmax(0,1fr)_48px] sm:gap-4 sm:px-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-[#fff7f6] text-[#760000] group-open:bg-white sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 font-heading text-[15px] font-bold leading-snug text-gray-950 sm:text-lg">
                    {faq.question}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-red-100 bg-white text-[#760000] transition justify-self-end">
                    <Plus className="h-4 w-4 group-open:hidden" />
                    <Minus className="hidden h-4 w-4 group-open:block" />
                  </span>
                </summary>
                <div className="bg-[#fff7f6] px-4 pb-5 pt-1 font-sans text-sm leading-[1.7] text-gray-600 sm:pl-[104px] sm:pr-20">
                  {faq.answer}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default ProductFAQ;
