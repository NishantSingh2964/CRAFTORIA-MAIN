import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useOrders } from '../contexts/OrderContext';
import { formatPrice } from '../utils/formatPrice';
import hero2 from '../assets/home/hero2.png?w=1400&format=webp&quality=82';

const Icon = ({ children, className = 'w-4 h-4' }) => (
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

const ORDER_TABS = ['All Orders', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];

const STATUS_STYLES = {
  Delivered: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    action: 'REORDER',
    getMessage: (date) => `Delivered on ${date}`,
  },
  Completed: {
    badge: 'bg-green-50 text-green-700 border-green-200',
    action: 'REORDER',
    getMessage: (date) => `Completed on ${date}`,
  },
  Shipped: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    action: 'TRACK ORDER',
    getMessage: (date) => `Shipped on ${date}`,
  },
  Processing: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    action: 'TRACK ORDER',
    getMessage: () => 'Your order is being prepared',
  },
  Cancelled: {
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    action: 'CANCEL ORDER',
    getMessage: () => 'This order was cancelled',
  },
};

const normalizeStatus = (status) => {
  const value = status || 'Processing';
  return ORDER_TABS.includes(value) ? value : 'Processing';
};

const formatOrderDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const formatShortDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const trustItems = [
  { title: 'Premium Quality', text: 'Handpicked with care' },
  { title: 'Secure Payments', text: 'Safe & encrypted checkout' },
  { title: 'Express Delivery', text: 'On-time, every time' },
  { title: 'Easy Returns', text: 'Hassle-free returns' },
  { title: 'Customer Support', text: "We're here to help" },
];

const MyOrders = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const { orders, fetchMyOrders, loading: ordersLoading } = useOrders();
  const [activeTab, setActiveTab] = useState('All Orders');
  const [sortBy, setSortBy] = useState('Most Recent');

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
        fetchMyOrders();
        return;
    }
    if (!isSignedIn) {
        openSignIn({ redirectUrl: `${window.location.origin}/my-orders` });
        navigate('/', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, openSignIn]);

  const enrichedOrders = useMemo(
    () =>
      orders.map((order) => {
        return {
          ...order,
          orderNumber: order.orderNumber || `GT${String(order._id || order.id).slice(-5)}`,
          status: normalizeStatus(order.status),
        };
      }),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    let list =
      activeTab === 'All Orders'
        ? enrichedOrders
        : enrichedOrders.filter((o) => o.status === activeTab);

    list = [...list].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortBy === 'Oldest' ? aTime - bTime : bTime - aTime;
    });

    return list;
  }, [enrichedOrders, activeTab, sortBy]);

  const handleDownload = async (orderId, orderNumber) => {
    try {
      const { getAuthToken } = await import('../services/api');
      const token = await getAuthToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/invoice/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toast.error('Failed to download invoice');
    }
  };

  if ((!isLoaded || !isSignedIn) || (ordersLoading && orders.length === 0)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#fafafa]">
        <p className="font-sans text-gray-500 text-sm animate-pulse">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa] min-h-screen pb-8">
      {/* Hero */}
      <section className="relative h-[320px] sm:h-[360px] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img src={hero2} alt="" className="w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/25 pointer-events-none" />
        </div>
        <div className="site-container relative z-10 w-full pt-20">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-gray-900 tracking-tight mb-3">
            My Orders
          </h1>
          <p className="font-sans text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed">
            Track your orders and view order details, delivery status and invoice all in one place.
          </p>
        </div>
      </section>

      {/* Main */}
      <div className="site-container -mt-8 relative z-10">
          <main className="w-full">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 pt-5 border-b border-gray-100">
                <div className="flex gap-1 sm:gap-0 overflow-x-auto scrollbar-none -mx-1 px-1">
                  {ORDER_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 font-sans text-[13px] font-medium transition-all border-b-2 -mb-px ${
                        activeTab === tab
                          ? 'text-[#760000] border-[#760000]'
                          : 'text-gray-500 border-transparent hover:text-gray-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pb-4 sm:pb-5 shrink-0">
                  <span className="font-sans text-xs text-gray-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="font-sans text-[13px] text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#760000]/20 cursor-pointer"
                  >
                    <option value="Most Recent">Most Recent</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                    </Icon>
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="font-sans text-sm text-gray-500 mb-6">
                      {activeTab === 'All Orders'
                        ? "You haven't placed any orders yet."
                        : `You don't have any ${activeTab.toLowerCase()} orders.`}
                    </p>
                    <Link
                      to="/collections"
                      className="inline-flex px-6 py-3 bg-[#760000] text-white font-sans text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#5e0000] transition"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const primary = order.items[0];
                    const status = normalizeStatus(order.status);
                    const style = STATUS_STYLES[status];
                    const lineTotal = Number(primary?.price || 0) * (primary?.quantity || 1) || order.totalAmount;
                    const deliveryDate = new Date(order.createdAt);
                    deliveryDate.setDate(deliveryDate.getDate() + 3);

                    return (
                      <article
                        key={order.id}
                        className="flex flex-col md:flex-row gap-5 p-5 rounded-xl border border-gray-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-shadow"
                      >
                        <div className="shrink-0">
                          <img
                            src={primary?.image || 'https://via.placeholder.com/150'}
                            alt={primary?.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-gray-100"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col md:flex-row gap-4 justify-between">
                          <div className="min-w-0">
                            <p className="font-sans text-xs text-gray-500 mb-1">
                              Order <span className="font-semibold text-gray-800">#{order.orderNumber}</span>
                            </p>
                            <p className="font-sans text-[11px] text-gray-400 mb-2">
                              Ordered on {formatOrderDate(order.createdAt)}
                            </p>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                              {primary?.name}
                              {order.items.length > 1 && (
                                <span className="font-sans text-sm font-normal text-gray-500">
                                  {' '}
                                  +{order.items.length - 1} more
                                </span>
                              )}
                            </h3>
                            <p className="font-sans text-sm text-gray-600 mb-3">
                              Qty: {primary?.quantity || 1}{' '}
                              <span className="text-gray-300 mx-1">|</span>{' '}
                              <span className="font-semibold text-[#760000]">
                                {formatPrice(lineTotal)}
                              </span>
                            </p>
                            <div className="flex flex-wrap gap-4">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 font-sans text-xs text-gray-600 hover:text-[#760000] transition"
                              >
                                <Icon className="w-3.5 h-3.5">
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                </Icon>
                                View Details
                              </button>
                              {order.receiptUrl && (
                                <a
                                  href={order.receiptUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 font-sans text-xs text-[#760000] font-bold hover:underline transition"
                                >
                                  <Icon className="w-3.5 h-3.5">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </Icon>
                                  Receipt
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-start md:items-end gap-3 self-end md:self-auto">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${style.badge}`}
                            >
                              {status}
                            </span>
                            <p className="font-sans text-[11px] text-gray-500 text-left md:text-right">
                              {style.getMessage(formatShortDate(deliveryDate))}
                            </p>
                            <button
                               type="button"
                               disabled={status === 'Delivered' || status === 'Completed' || status === 'Cancelled' || ordersLoading}
                               onClick={async () => {
                                 if (style.action === 'TRACK ORDER') {
                                   await fetchMyOrders();
                                   toast.success('Status updated successfully');
                                 } else if (style.action === 'REORDER') {
                                   toast('Reorder feature coming soon!');
                                 }
                               }}
                               className={`px-5 py-2 border-2 font-sans text-[11px] font-bold uppercase tracking-wider rounded-lg transition ${
                                 status === 'Delivered' || status === 'Completed' || status === 'Cancelled'
                                   ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                   : 'border-[#760000] text-[#760000] hover:bg-red-50'
                               }`}
                             >
                               {style.action}
                             </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </main>
      </div>

      {/* Trust bar */}
      <section className="site-container mt-16">
        <div className="bg-[#fff5f4] border border-red-50 rounded-[24px] py-8 px-4 sm:px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-8 lg:gap-y-0">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center px-2 relative ${
                index === 4 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white border border-red-100 flex items-center justify-center text-[#760000] mb-3 shadow-sm">
                <span className="font-serif text-lg font-bold">✦</span>
              </div>
              <h4 className="font-sans font-bold text-[11px] sm:text-xs text-gray-900 mb-1">{item.title}</h4>
              <p className="font-sans text-[10px] text-gray-500 leading-relaxed max-w-[140px] mx-auto">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyOrders;
