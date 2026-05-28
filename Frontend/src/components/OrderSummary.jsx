import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { openWhatsAppCartOrder } from '../utils/whatsappOrder';

const FREE_EXPRESS_THRESHOLD = 999;
const NEXT_TIER_THRESHOLD = 3500;

const parsePrice = (price) => parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0;

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

const WhatsAppIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const OrderSummary = ({ cartItems, primaryLabel, primaryTo, onPrimaryClick, stickyTop = 'xl:top-24' }) => {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const { subtotal, discount, total, savings } = useMemo(() => {
    const originalTotal = cartItems.reduce(
      (sum, item) => sum + parsePrice(item.originalPrice) * item.quantity,
      0
    );
    const payableTotal = cartItems.reduce(
      (sum, item) => sum + parsePrice(item.currentPrice) * item.quantity,
      0
    );
    const itemDiscount = Math.max(0, originalTotal - payableTotal);
    return {
      subtotal: originalTotal,
      discount: itemDiscount,
      total: payableTotal,
      savings: itemDiscount,
    };
  }, [cartItems]);

  const deliveryProgress = Math.min(100, (total / NEXT_TIER_THRESHOLD) * 100);
  const amountToNextTier = Math.max(0, NEXT_TIER_THRESHOLD - total);
  const hasFreeExpress = total >= FREE_EXPRESS_THRESHOLD;

  const primaryButtonClass =
    'flex items-center justify-center gap-2 w-full h-12 rounded-md bg-[#760000] text-white action-link shadow-[0_8px_20px_rgba(118,0,0,0.25)] hover:bg-[#5e0000] transition';

  return (
    <aside
      className={`bg-white border border-gray-100 rounded-xl shadow-sm p-6 sm:p-7 xl:sticky ${stickyTop}`}
    >
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-3.5 text-sm font-sans">
        <div className="flex justify-between text-gray-600">
          <span>
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span className="font-semibold">− {formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-emerald-600">
          <span>Shipping</span>
          <span className="font-bold uppercase tracking-wide text-xs">FREE</span>
        </div>
      </div>

      <div className="border-t border-gray-100 mt-5 pt-5 mb-2">
        <div className="flex justify-between items-end">
          <span className="font-serif text-lg font-bold text-gray-900">Total</span>
          <span className="font-sans text-2xl font-extrabold text-[#760000]">{formatPrice(total)}</span>
        </div>
        {savings > 0 && (
          <p className="text-[11px] text-gray-500 mt-2">You saved {formatPrice(savings)} on this order</p>
        )}
      </div>

      <div className="space-y-3 mt-6">
        {primaryTo ? (
          <Link to={primaryTo} className={primaryButtonClass}>
            <Icon className="h-4 w-4">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </Icon>
            {primaryLabel}
          </Link>
        ) : (
          <button type="button" onClick={onPrimaryClick} className={primaryButtonClass}>
            <Icon className="h-4 w-4">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </Icon>
            {primaryLabel}
          </button>
        )}
        <button
          type="button"
          onClick={() => openWhatsAppCartOrder(cartItems, total)}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-md bg-[#25D366] text-white action-link border border-[#20bd5a] shadow-[0_8px_20px_rgba(37,211,102,0.35)] hover:bg-[#20bd5a] transition"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          Order on WhatsApp
        </button>
      </div>

      <div className="mt-7 pt-6 border-t border-gray-100">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#760000]">
            <Icon className="h-5 w-5">
              <path d="M10 17h4V5H2v12h3" />
              <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
              <circle cx="7.5" cy="17.5" r="2.5" />
              <circle cx="17.5" cy="17.5" r="2.5" />
            </Icon>
          </div>
          <div className="min-w-0">
            <p className="font-sans text-sm font-semibold text-gray-900 leading-snug">
              {hasFreeExpress
                ? 'Yay! You are eligible for FREE Express Delivery'
                : `Add ${formatPrice(FREE_EXPRESS_THRESHOLD - total)} more for FREE Express Delivery`}
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#760000] transition-all duration-500"
                style={{
                  width: `${hasFreeExpress ? Math.max(deliveryProgress, 88) : (total / FREE_EXPRESS_THRESHOLD) * 100}%`,
                }}
              />
            </div>
            {amountToNextTier > 0 && total >= FREE_EXPRESS_THRESHOLD && (
              <p className="text-[11px] text-gray-500 mt-2">
                Add items worth {formatPrice(amountToNextTier)} more
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="micro-label text-gray-500 mb-3">We Accept</p>
        <div className="flex flex-wrap items-center gap-3 opacity-70">
          <span className="text-[10px] font-bold tracking-wider text-blue-800 border border-gray-200 px-2 py-1 rounded bg-white">
            VISA
          </span>
          <span className="text-[10px] font-bold tracking-wider text-red-700 border border-gray-200 px-2 py-1 rounded bg-white">
            MC
          </span>
          <span className="text-[10px] font-bold tracking-wider text-blue-600 border border-gray-200 px-2 py-1 rounded bg-white">
            RuPay
          </span>
          <span className="text-[10px] font-bold tracking-wider text-gray-800 border border-gray-200 px-2 py-1 rounded bg-white">
            UPI
          </span>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
