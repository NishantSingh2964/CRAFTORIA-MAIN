import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  RotateCcw,
  Search,
  X,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import toast from 'react-hot-toast';
import Pagination from '../../components/admin/Pagination';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';

const formatCurrency = (value = 0) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value);

const getCustomerEmail = (order) => {
  if (order.deliveryInfo?.email) return order.deliveryInfo.email;
  const name = order.deliveryInfo?.fullName || 'customer';
  return `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`;
};

const getPaymentLabel = (paymentStatus) => {
  if (paymentStatus === 'Paid') return 'Paid';
  if (paymentStatus === 'Refunded') return 'Refunded';
  if (paymentStatus === 'Cancelled') return 'Cancelled';
  return 'Pending';
};

const getPaymentClass = (paymentStatus) => {
  if (paymentStatus === 'Paid') return 'bg-emerald-100 text-emerald-700 before:bg-emerald-600';
  if (paymentStatus === 'Refunded') return 'bg-purple-100 text-purple-700 before:bg-purple-600';
  if (paymentStatus === 'Cancelled') return 'bg-gray-100 text-gray-700 before:bg-gray-600';
  return 'bg-orange-100 text-orange-700 before:bg-orange-500';
};

const getStatusClass = (status) => {
  if (status === 'Delivered' || status === 'Completed') return 'bg-emerald-50 border-emerald-200 text-emerald-700 focus:ring-emerald-500';
  if (status === 'Processing') return 'bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-500';
  if (status === 'Shipped') return 'bg-indigo-50 border-indigo-200 text-indigo-700 focus:ring-indigo-500';
  if (status === 'Cancelled') return 'bg-red-50 border-red-200 text-red-700 focus:ring-red-500';
  if (status === 'Cancellation Requested') return 'bg-amber-50 border-amber-200 text-amber-700 focus:ring-amber-500';
  return 'bg-amber-50 border-amber-200 text-amber-700 focus:ring-amber-500';
};

const Orders = () => {
  const { adminOrders, loading, fetchAllOrders, updateOrderStatus, deleteOrder } = useOrders();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Status');
  const [payment, setPayment] = useState('All Payment Status');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const handleStartDateChange = (dateStr) => {
    setStartDate(dateStr);
    if (dateStr) {
      const start = new Date(dateStr);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      setEndDate(end.toISOString().split('T')[0]);
    } else {
      setEndDate('');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const handleDeleteOrder = async (order) => {
    const orderId = order.orderNumber || order._id;
    if (!window.confirm(`Are you sure you want to delete order ${orderId}? This action cannot be undone.`)) return;
    setOpenMenuId(null);
    const result = await deleteOrder(order._id);
    if (result.success) {
      toast.success(`Order ${orderId} deleted successfully`);
    } else {
      toast.error(result.error || 'Failed to delete order');
    }
  };

  const filteredOrders = useMemo(() => {
    return adminOrders.filter((order) => {
      const customer = order.deliveryInfo?.fullName || '';
      const email = getCustomerEmail(order);
      const orderId = order.orderNumber || order._id || '';
      const searchable = `${orderId} ${customer} ${email}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesStatus = status === 'All Status' || order.status === status;
      const paymentLabel = getPaymentLabel(order.paymentStatus);
      const matchesPayment = payment === 'All Payment Status' || payment === paymentLabel;
      
      // Date filtering
      let matchesDate = true;
      if (startDate || endDate) {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (orderDate < start) matchesDate = false;
        }
        
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (orderDate > end) matchesDate = false;
        }
      }

      return matchesQuery && matchesStatus && matchesPayment && matchesDate;
    });
  }, [adminOrders, payment, query, status, startDate, endDate]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredOrders, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [query, status, payment, startDate, endDate]);

  const resetFilters = () => {
    setQuery('');
    setStatus('All Status');
    setPayment('All Payment Status');
    setStartDate('');
    setEndDate('');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success(`Order status updated to ${newStatus}`);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Orders Listing</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">View and manage all customer orders.</p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#cfaaa1] bg-white px-6 text-sm font-bold text-[#8d0000] transition hover:border-[#9a1515] hover:bg-[#fff7f3]"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#eadbd6] bg-white shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
        <div className="grid gap-4 border-b border-[#efe3df] p-5 xl:grid-cols-[1fr_180px_210px_260px_92px_92px] xl:items-center">
          <label className="flex h-11 min-w-0 items-center gap-3 rounded-lg border border-[#e4d5cf] bg-white px-4">
            <Search className="h-4 w-4 text-[#9a1515]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order ID, Customer, Email..."
              className="w-full border-none bg-transparent text-sm text-[#4c3936] outline-none placeholder:text-[#8b7772]"
            />
          </label>

          <label className="relative">
            <span className="sr-only">Order status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-white px-4 pr-10 text-sm text-[#6c5c58] outline-none focus:border-[#9a1515]"
            >
              <option>All Status</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c5c58]" />
          </label>

          <label className="relative">
            <span className="sr-only">Payment status</span>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-white px-4 pr-10 text-sm text-[#6c5c58] outline-none focus:border-[#9a1515]"
            >
              <option>All Payment Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c5c58]" />
          </label>

          <div className="flex h-11 items-center gap-3 rounded-lg border border-[#e4d5cf] bg-white px-4">
            <CalendarDays className="h-4 w-4 text-[#8d0000]" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-gray-400">Start Date</span>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="bg-transparent text-[11px] font-black uppercase outline-none"
              />
            </div>
            {endDate && (
              <div className="flex flex-col border-l border-gray-100 pl-3">
                <span className="text-[9px] font-black uppercase text-gray-400">Range (7 Days)</span>
                <span className="text-[11px] font-black text-[#8d0000] uppercase pt-0.5">
                  Until {new Date(endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            )}
          </div>

          <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#e4d5cf] bg-white px-4 text-sm font-bold text-[#8d0000] transition hover:border-[#9a1515]">
            <Filter className="h-4 w-4" />
            Filter
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#e4d5cf] bg-white px-4 text-sm font-bold text-[#8d0000] transition hover:border-[#9a1515]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1110px] text-left">
            <thead>
              <tr className="border-b border-[#efe3df] bg-white text-[11px] uppercase tracking-wider text-[#8b8f99]">
                <th className="w-14 px-6 py-4">
                  <span className="block h-4 w-4 rounded border border-[#d9c9c3]" />
                </th>
                <th className="px-4 py-4 font-black">Order ID</th>
                <th className="px-4 py-4 font-black">Customer</th>
                <th className="px-4 py-4 font-black">Date</th>
                <th className="px-4 py-4 font-black">Amount</th>
                <th className="px-4 py-4 font-black">Payment</th>
                <th className="px-4 py-4 font-black">Status</th>
                <th className="px-6 py-4 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-8 py-20 text-center font-serif text-xl text-[#8b7772]">Loading orders...</td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-8 py-20 text-center text-sm font-medium text-[#8b7772]">No orders found.</td>
                </tr>
              ) : paginatedOrders.map((order) => {
                const date = order.createdAt ? new Date(order.createdAt) : null;
                const orderId = order.orderNumber || `#ORD${order._id?.slice(-6)?.toUpperCase() || '000000'}`;
                const itemCount = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || order.items?.length || 1;

                return (
                  <tr key={order._id} className="border-b border-[#efe3df] transition hover:bg-[#fffaf7]">
                    <td className="px-6 py-4">
                      <span className="block h-4 w-4 rounded border border-[#d9c9c3]" />
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#171111]">{orderId}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-[#171111]">{order.deliveryInfo?.fullName || 'Customer'}</p>
                      <p className="mt-1 text-sm font-medium text-[#6c5c58]">{getCustomerEmail(order)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-[#171111]">
                        {date ? date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#6c5c58]">
                        {date ? date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-[#171111]">{formatCurrency(order.totalAmount)}</p>
                      <p className="mt-1 text-sm font-medium text-[#6c5c58]">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black before:h-1.5 before:w-1.5 before:rounded-full ${getPaymentClass(order.paymentStatus)}`}>
                        {getPaymentLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative inline-block group">
                        <select
                          value={order.status || 'Processing'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`appearance-none rounded-lg border px-4 py-2 pr-10 text-[11px] font-black uppercase tracking-wider outline-none transition-all cursor-pointer shadow-sm hover:shadow-md focus:ring-2 focus:ring-opacity-50 ${getStatusClass(order.status)}`}
                        >
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Completed</option>
                          <option>Cancelled</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70 transition-transform group-hover:scale-110" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => setSelectedOrder(order)}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4d5cf] text-[#171111] transition hover:border-[#9a1515] hover:text-[#9a1515]" 
                          aria-label={`View ${orderId}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === order._id ? null : order._id); }}
                            className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4d5cf] text-[#8d0000] transition hover:border-[#9a1515] hover:bg-[#fff7f3]" 
                            aria-label={`More actions for ${orderId}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {openMenuId === order._id && (
                            <div 
                              className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-[#eadbd6] bg-white shadow-xl"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleDeleteOrder(order)}
                                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                Delete Order
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-5">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default Orders;
