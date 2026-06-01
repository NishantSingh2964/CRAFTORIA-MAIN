import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useOrders } from '../contexts/OrderContext';
import { formatPrice } from '../utils/formatPrice';
import api from '../services/api';
import hero2 from '../assets/home/hero2.png?w=1400&format=webp&quality=82';
import UserOrderDetailsModal from '../components/UserOrderDetailsModal';

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

const ORDER_TABS = ['All Orders', 'Processing', 'Cancellation Requested', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];

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
  'Cancellation Requested': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    action: 'CANCELLATION INITIATED',
    getMessage: () => 'Waiting for admin approval',
  },
};

const PAYMENT_PENDING_BADGE = 'bg-red-50 text-red-700 border-red-200';

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
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { orders, fetchMyOrders, cancelOrder, loading: ordersLoading } = useOrders();
  const [activeTab, setActiveTab] = useState('All Orders');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [retryingId, setRetryingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? ₹50 will be deducted as a cancellation fee if already paid.')) return;

    try {
      setCancellingId(orderId);
      const res = await cancelOrder(orderId);
      if (res.success) {
        toast.success(res.message || 'Order cancelled successfully');
      } else {
        toast.error(res.error || 'Failed to cancel order');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setCancellingId(null);
    }
  };

  const handleWithdrawCancel = async (orderId) => {
    if (!window.confirm('Do you want to withdraw your cancellation request?')) return;

    try {
      setWithdrawingId(orderId);
      const res = await api.post(`/orders/${orderId}/withdraw-cancel`);
      if (res.data.success) {
        toast.success('Cancellation request withdrawn');
        fetchMyOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw request');
    } finally {
      setWithdrawingId(null);
    }
  };

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
  }, [fetchMyOrders, isLoaded, isSignedIn, navigate, openSignIn]);

  // Handle return from Stripe: ?payment=cancelled&orderId=X  or  ?retry=X
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const payment = searchParams.get('payment');
    const orderId = searchParams.get('orderId');
    const retryId = searchParams.get('retry');

    // Clean URL immediately
    if (payment || retryId) {
      window.history.replaceState({}, '', '/my-orders');
    }

    const callApi = async (url, method = 'POST') => {
      const res = await api({
        url,
        method,
      });
      return res.data;
    };

    // User cancelled Stripe checkout → mark pending + send email
    if (payment === 'cancelled' && orderId) {
      callApi(`/orders/${orderId}/mark-payment-pending`)
        .then(() => {
          fetchMyOrders(); // Refresh list to show 'Payment Pending' immediately
        })
        .catch(() => {});
      toast.error('Payment was not completed. Complete it any time from your orders.', { duration: 6000 });
    }

    // Email retry link → auto-open a new Stripe session
    if (retryId) {
      (async () => {
        try {
          setRetryingId(retryId);
          const data = await callApi(`/orders/${retryId}/retry-payment`);
          if (data.url) {
            window.location.href = data.url;
          } else {
            toast.error('Could not start payment. Please try again.');
          }
        } catch {
          toast.error('Something went wrong. Please try again.');
        } finally {
          setRetryingId(null);
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  const handleCompletePayment = useCallback(async (orderId) => {
    try {
      setRetryingId(orderId);
      const res = await api.post(`/orders/${orderId}/retry-payment`);
      const data = res.data;
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Could not start payment. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setRetryingId(null);
    }
  }, []);

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
      const response = await api.get(`/orders/${orderId}/invoice/download`, {
        responseType: 'blob'
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
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
      <section className="relative flex h-[250px] items-center overflow-hidden bg-white sm:h-[340px]">
        <div className="absolute inset-0 z-0">
          <img src={hero2} alt="" className="h-full w-full object-cover object-center sm:object-right" />
          <div className="absolute inset-0 bg-white/20 sm:bg-transparent" />
        </div>
        <div className="site-container relative z-10 w-full pt-16 sm:pt-20">
          <h1 className="mb-2 font-serif text-4xl font-bold tracking-tight text-gray-900 sm:mb-3 sm:text-5xl lg:text-[3.5rem]">
            My Orders
          </h1>
          <p className="max-w-xl font-sans text-sm leading-relaxed text-gray-600 sm:text-base">
            Track your orders and view order details, delivery status and invoice all in one place.
          </p>
        </div>
      </section>

      {/* Main */}
      <div className="site-container relative z-10 -mt-7 sm:-mt-8">
          <main className="w-full">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col gap-4 border-b border-gray-100 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pt-5">
                <div className="-mx-4 flex gap-1 overflow-x-auto px-4 scrollbar-none sm:-mx-1 sm:px-1">
                  {ORDER_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-3 font-sans text-[13px] font-medium transition-all ${
                        activeTab === tab
                          ? 'text-[#760000] border-[#760000]'
                          : 'text-gray-500 border-transparent hover:text-gray-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex w-full items-center justify-between gap-3 pb-4 sm:w-auto sm:justify-start sm:pb-5">
                  <span className="shrink-0 font-sans text-xs text-gray-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="min-w-0 flex-1 cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-sans text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#760000]/20 sm:flex-none"
                  >
                    <option value="Most Recent">Most Recent</option>
                    <option value="Oldest">Oldest</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
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
                    const items = order.items || [];
                    const primary = items[0];
                    const status = normalizeStatus(order.status);
                    const style = STATUS_STYLES[status];
                    const lineTotal = Number(primary?.price || 0) * (primary?.quantity || 1) || order.totalAmount;
                    const deliveryDate = new Date(order.createdAt);
                    deliveryDate.setDate(deliveryDate.getDate() + 3);

                    return (
                      <article
                        key={order._id || order.id}
                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] sm:p-5"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex min-w-0 gap-3 sm:gap-5">
                            <img
                              src={primary?.image || 'https://via.placeholder.com/150'}
                              alt={primary?.name || 'Order item'}
                              className="h-24 w-24 shrink-0 rounded-lg border border-gray-100 object-cover sm:h-28 sm:w-28"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="mb-1 font-sans text-xs text-gray-500">
                                Order <span className="font-semibold text-gray-800">#{order.orderNumber}</span>
                              </p>
                              <p className="mb-2 font-sans text-[11px] leading-snug text-gray-400">
                                Ordered on {formatOrderDate(order.createdAt)}
                              </p>
                              <h3 className="mb-2 line-clamp-2 font-serif text-base font-bold leading-tight text-gray-900 sm:text-lg">
                                {primary?.name}
                                {items.length > 1 && (
                                  <span className="font-sans text-sm font-normal text-gray-500">
                                    {' '}
                                    +{items.length - 1} more
                                  </span>
                                )}
                              </h3>
                              <p className="mb-3 font-sans text-sm text-gray-600">
                                Qty: {primary?.quantity || 1}{' '}
                                <span className="mx-1 text-gray-300">|</span>{' '}
                                <span className="font-semibold text-[#760000]">
                                  {formatPrice(lineTotal)}
                                </span>
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrder(order)}
                                  className="inline-flex items-center gap-1.5 font-sans text-xs text-gray-600 transition hover:text-[#760000]"
                                >
                                  <Icon className="w-3.5 h-3.5">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </Icon>
                                  View Details
                                </button>
                                {order.receiptUrl ? (
                                  <a
                                    href={order.receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#760000] transition hover:underline"
                                  >
                                    <Icon className="w-3.5 h-3.5">
                                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </Icon>
                                    Receipt
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleDownload(order._id || order.id, order.orderNumber)}
                                    className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#760000] transition hover:underline"
                                  >
                                    <Icon className="w-3.5 h-3.5">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                                      <path d="M14 2v6h6" />
                                      <path d="M12 18v-6" />
                                      <path d="m9 15 3 3 3-3" />
                                    </Icon>
                                    Invoice
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex w-full flex-col gap-3 rounded-lg bg-gray-50 p-3 md:w-48 md:items-end md:bg-transparent md:p-0">
                            {/* Payment Pending overrides the order status badge */}
                             {order.paymentStatus === 'Payment Pending' || order.paymentStatus === 'Unpaid' ? (
                               <span className={`inline-block w-fit rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${PAYMENT_PENDING_BADGE}`}>
                                 Payment Pending
                               </span>
                             ) : order.paymentStatus === 'Refunded' ? (
                               <span className="inline-block w-fit rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-purple-700">
                                 Refunded
                               </span>
                             ) : status === 'Cancellation Requested' ? (
                               <span className="inline-block w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                                 Cancellation Requested
                               </span>
                             ) : (
                               <span className={`inline-block w-fit rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${style.badge}`}>
                                 {status}
                               </span>
                             )}
                            <p className="font-sans text-[11px] leading-relaxed text-gray-500 md:text-right">
                              {order.paymentStatus === 'Payment Pending' || order.paymentStatus === 'Unpaid'
                                ? 'Payment not completed'
                                : style.getMessage(formatShortDate(deliveryDate))}
                            </p>
                             {/* Complete Payment button for unpaid orders */}
                            {(order.paymentStatus === 'Payment Pending' || order.paymentStatus === 'Unpaid') ? (
                              <button
                                type="button"
                                disabled={retryingId === (order._id || order.id)}
                                onClick={() => handleCompletePayment(order._id || order.id)}
                                className="w-full rounded-lg border-2 border-[#760000] bg-[#760000] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-[#5e0000] disabled:opacity-60 disabled:cursor-not-allowed md:w-auto"
                              >
                                {retryingId === (order._id || order.id) ? 'Redirecting…' : 'Complete Payment'}
                              </button>
                            ) : (
                              <div className="flex flex-col gap-2 w-full md:w-auto">
                                <button
                                  type="button"
                                  disabled={status === 'Delivered' || status === 'Completed' || status === 'Cancelled' || (status === 'Cancellation Requested' && withdrawingId === (order._id || order.id)) || ordersLoading}
                                  onClick={async () => {
                                    if (status === 'Cancellation Requested') {
                                      handleWithdrawCancel(order._id || order.id);
                                    } else if (style.action === 'TRACK ORDER') {
                                      await fetchMyOrders();
                                      toast.success('Status updated successfully');
                                    } else if (style.action === 'REORDER') {
                                      toast('Reorder feature coming soon!');
                                    }
                                  }}
                                  className={`w-full rounded-lg border-2 px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider transition md:w-auto ${
                                    status === 'Delivered' || status === 'Completed' || status === 'Cancelled'
                                      ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                      : status === 'Cancellation Requested'
                                      ? 'border-amber-600 bg-amber-600 text-white hover:bg-amber-700'
                                      : 'border-[#760000] text-[#760000] hover:bg-red-50'
                                  }`}
                                >
                                  {status === 'Cancellation Requested' ? (withdrawingId === (order._id || order.id) ? 'Removing...' : 'Remove Request') : style.action}
                                </button>
                                
                                {status === 'Processing' && (
                                  <button
                                    type="button"
                                    disabled={cancellingId === (order._id || order.id)}
                                    onClick={() => handleCancelOrder(order._id || order.id)}
                                    className="w-full rounded-lg border-2 border-red-100 bg-red-50 px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider text-red-600 transition hover:bg-red-100 disabled:opacity-60 md:w-auto"
                                  >
                                    {cancellingId === (order._id || order.id) ? 'Requesting...' : 'Cancel Order'}
                                  </button>
                                )}
                              </div>
                            )}
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
      <section className="site-container mt-10 sm:mt-16">
        <div className="grid grid-cols-2 gap-x-2 gap-y-6 rounded-2xl border border-red-50 bg-[#fff5f4] px-4 py-6 sm:rounded-[24px] sm:px-6 sm:py-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center px-2 relative ${
                index === 4 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-white text-[#760000] shadow-sm">
                <span className="font-serif text-lg font-bold">✦</span>
              </div>
              <h4 className="font-sans font-bold text-[11px] sm:text-xs text-gray-900 mb-1">{item.title}</h4>
              <p className="font-sans text-[10px] text-gray-500 leading-relaxed max-w-[140px] mx-auto">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      {selectedOrder && (
        <UserOrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default MyOrders;
