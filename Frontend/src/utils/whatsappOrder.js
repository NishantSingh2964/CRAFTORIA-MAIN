import toast from 'react-hot-toast';
import { formatPrice } from './formatPrice';

const parsePrice = (price) => parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0;

export const openWhatsAppCartOrder = (cartItems, total) => {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '');
  if (!phone) {
    toast.error('WhatsApp number is not configured');
    return;
  }

  const lines = cartItems
    .map(
      (item) =>
        `• ${item.name} (Qty: ${item.quantity}) — ${formatPrice(parsePrice(item.currentPrice) * item.quantity)}`
    )
    .join('\n');

  const message = encodeURIComponent(
    `Hi CRAFTORIA, I would like to order:\n\n${lines}\n\nTotal: ${formatPrice(total)}\nLink: ${window.location.href}`
  );

  window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
};
