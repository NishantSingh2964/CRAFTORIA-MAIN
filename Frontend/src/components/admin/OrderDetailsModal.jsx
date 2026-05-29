import React from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, ShoppingBag } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-5 backdrop-blur-md">
          <div className="min-w-0">
            <h3 className="font-serif text-2xl font-black text-[#171111] truncate">Order Details</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8d0000] mt-0.5 truncate">#{order.orderNumber || order._id}</p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl bg-[#fffaf8] border border-[#f0e3df] p-5">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-[#8d0000]" />
                <h4 className="font-black text-sm uppercase tracking-wider text-[#171111]">Shipping Address</h4>
              </div>
              <div className="space-y-1.5 text-sm font-medium text-[#4c3936]">
                <p className="font-black text-[#171111] text-base mb-2">{order.deliveryInfo?.fullName || 'N/A'}</p>
                <p>{order.deliveryInfo?.address}</p>
                <p>{order.deliveryInfo?.city}, {order.deliveryInfo?.state} - {order.deliveryInfo?.pincode}</p>
                <p className="pt-2 font-bold text-[#8d0000]">Phone: {order.deliveryInfo?.phone || 'N/A'}</p>
              </div>
            </section>

            <section className="rounded-2xl bg-[#f8fbff] border border-[#e3eff0] p-5">
               <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                <h4 className="font-black text-sm uppercase tracking-wider text-[#171111]">Order Summary</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Payment Status</span>
                  <span className="font-black text-emerald-600 uppercase tracking-tighter">{order.paymentStatus || 'Unpaid'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Items Count</span>
                  <span className="font-black text-[#171111]">{(order.items || []).length} Items</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between">
                  <span className="font-black text-[#171111]">Total Amount</span>
                  <span className="font-black text-xl text-[#8d0000]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.totalAmount || 0)}</span>
                </div>
              </div>
            </section>
          </div>

          <section>
            <h4 className="font-black text-sm uppercase tracking-widest text-[#171111] mb-5 border-l-4 border-[#8d0000] pl-3">Order Items</h4>
            <div className="space-y-4">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50/50 transition">
                  <img src={item.image || ''} alt={item.name || 'Product'} className="h-20 w-20 rounded-xl object-cover shadow-sm bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#171111] truncate">{item.name || 'Unknown Product'}</p>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">Qty: <span className="text-[#171111] font-black">{item.quantity || 0}</span></p>

                    {item.customization && (
                      <div className="mt-3 p-3 rounded-lg bg-[#fff8f6] border border-[#f0e3df] space-y-2">
                        {item.customization.text && (
                          <p className="text-xs font-medium text-[#4c3936]">
                            <span className="font-black text-[#8d0000] uppercase tracking-tighter mr-1">Message:</span> 
                            {item.customization.text}
                          </p>
                        )}
                        {item.customization.photo && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-black text-[#8d0000] uppercase tracking-tighter">Photo:</span>
                            <div className="relative group/photo">
                              <img src={item.customization.photo} alt="Custom" className="h-12 w-12 rounded border border-white shadow-sm cursor-zoom-in group-hover/photo:scale-110 transition" onClick={() => window.open(item.customization.photo, '_blank')} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#171111]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price || 0)}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Per Unit</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-white/80 border-t border-gray-100 p-6 backdrop-blur-md">
          <button onClick={onClose} className="w-full h-12 rounded-xl bg-[#171111] text-white font-bold uppercase tracking-widest transition hover:bg-black">
            Close Overview
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderDetailsModal;
