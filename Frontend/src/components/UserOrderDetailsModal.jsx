import React from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, ShoppingBag, Package, CreditCard, Clock } from 'lucide-react';

const fmt = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

const UserOrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const totalCustomizationFee = (order.items || []).reduce(
    (sum, item) => sum + (item.customization?.fee ? Number(item.customization.fee) * (item.quantity || 1) : 0),
    0
  );

  const steps = [
    { label: 'Placed', icon: ShoppingBag, completed: true },
    { label: 'Payment', icon: CreditCard, completed: order.paymentStatus === 'Paid' || order.paymentStatus === 'Refunded' },
    { label: 'Preparing', icon: Package, completed: ['Processing', 'Shipped', 'Delivered', 'Completed'].includes(order.status) },
    { label: 'On its way', icon: Clock, completed: ['Shipped', 'Delivered', 'Completed'].includes(order.status) },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-250 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div className="min-w-0">
            <h3 className="font-serif text-xl font-bold text-gray-900 truncate">Order #ID: {order.orderNumber}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tracking visualization */}
          <div className="flex items-center justify-between px-2 mb-8 mt-2 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 -z-10" />
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step.completed ? 'bg-red-50 border-[#760000] text-[#760000]' : 'bg-white border-gray-200 text-gray-300'
                  }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step.completed ? 'text-[#760000]' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Address */}
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3 text-[#760000]">
                <MapPin className="h-4 w-4" />
                <h4 className="font-bold text-xs uppercase tracking-widest">Shipping To</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-bold text-gray-900">{order.deliveryInfo?.fullName}</p>
                <p>{order.deliveryInfo?.address}</p>
                <p>{order.deliveryInfo?.city}, {order.deliveryInfo?.state} - {order.deliveryInfo?.pincode}</p>
                <p className="pt-1 font-semibold text-gray-900">Ph: {order.deliveryInfo?.phone}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3 text-[#760000]">
                <ShoppingBag className="h-4 w-4" />
                <h4 className="font-bold text-xs uppercase tracking-widest">Summary</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Status</span>
                  <span className="font-bold text-gray-900">{order.status}</span>
                </div>
                <div className="pt-2 border-t border-gray-50 flex justify-between">
                  <span className="font-bold text-gray-900">Total Price</span>
                  <span className="font-bold text-lg text-[#760000]">{fmt(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 ml-1">Products in your order</h4>
            <div className="space-y-3">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 rounded-xl border border-gray-50 bg-gray-50/30">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} × {fmt(item.price)}</p>
                    {item.customization?.text && (
                      <p className="text-xs bg-white p-2 rounded-md border border-gray-100 mt-2 text-gray-600 italic">
                        "{item.customization.text}"
                      </p>
                    )}
                    {item.customization?.isHamper && item.customization?.items && (
                      <div className="mt-2 space-y-1.5">
                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest px-1">Gifts in this Hamper:</p>
                        <ul className="bg-white/60 p-2.5 rounded-lg border border-red-50 space-y-1">
                          {item.customization.items.map((sub, sIdx) => (
                            <li key={sIdx} className="text-[10px] text-gray-600 flex justify-between items-center group">
                              <span>• {sub.name}</span>
                              <span className="text-gray-400 font-mono text-[9px] bg-gray-50 px-1.5 rounded">x{sub.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-sm text-gray-900">{fmt(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
          <button onClick={onClose} className="w-full h-11 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition text-sm uppercase tracking-widest">
            Close View
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UserOrderDetailsModal;
