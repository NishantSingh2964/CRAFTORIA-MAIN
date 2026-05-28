export const formatPrice = (price) => {
  const numeric = Number(String(price).replace(/[^\d.]/g, ''));
  if (isNaN(numeric)) return '₹0';
  return `₹${numeric.toLocaleString('en-IN')}`;
};
