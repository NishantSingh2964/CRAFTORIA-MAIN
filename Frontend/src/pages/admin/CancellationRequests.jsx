import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Check,
  Search,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import toast from 'react-hot-toast';
import Pagination from '../../components/admin/Pagination';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import api from '../../services/api';

const CancellationRequests = () => {
  const { adminOrders, loading, fetchAllOrders } = useOrders();
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const requests = useMemo(() => {
    return adminOrders.filter(order => order.status === 'Cancellation Requested');
  }, [adminOrders]);

  const filteredRequests = useMemo(() => {
    return requests.filter((order) => {
      const customer = order.deliveryInfo?.fullName || '';
      const orderId = order.orderNumber || order._id || '';
      const searchable = `${orderId} ${customer}`.toLowerCase();
      return searchable.includes(query.toLowerCase());
    });
  }, [requests, query]);

  const handleApprove = async (orderId) => {
    if (!window.confirm('Are you sure you want to APPROVE this cancellation? A refund will be initiated minus the nominal charge.')) return;
    try {
      setProcessingId(orderId);
      const res = await api.patch(`/orders/admin/${orderId}/approve-cancel`);
      if (res.data.success) {
        toast.success('Cancellation approved successfully');
        fetchAllOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve cancellation');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (orderId) => {
    if (!window.confirm('Are you sure you want to REJECT this cancellation request?')) return;
    try {
      setProcessingId(orderId);
      const res = await api.patch(`/orders/admin/${orderId}/reject-cancel`);
      if (res.data.success) {
        toast.success('Cancellation rejected');
        fetchAllOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject cancellation');
    } finally {
      setProcessingId(null);
    }
  };

  const totalPages = Math.ceil(filteredRequests.length / ordersPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return filteredRequests.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredRequests, currentPage]);

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Cancellation Requests</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">Review and manage order cancellation requests from customers.</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#eadbd6] bg-white shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
        <div className="border-b border-[#efe3df] p-5">
          <label className="flex h-11 max-w-md items-center gap-3 rounded-lg border border-[#e4d5cf] bg-white px-4">
            <Search className="h-4 w-4 text-[#9a1515]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order ID or Customer..."
              className="w-full border-none bg-transparent text-sm text-[#4c3936] outline-none placeholder:text-[#8b7772]"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-[#efe3df] bg-white text-[11px] uppercase tracking-wider text-[#8b8f99]">
                <th className="px-6 py-4 font-black">Order ID</th>
                <th className="px-6 py-4 font-black">Customer</th>
                <th className="px-6 py-4 font-black">Amount</th>
                <th className="px-6 py-4 font-black">Date Requested</th>
                <th className="px-6 py-4 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center font-serif text-xl text-[#8b7772]">Loading...</td></tr>
              ) : paginatedRequests.length === 0 ? (
                <tr><td colSpan="5" className="py-20 text-center text-sm font-medium text-[#8b7772]">No pending requests found.</td></tr>
              ) : paginatedRequests.map((order) => (
                <tr key={order._id} className="border-b border-[#efe3df] transition hover:bg-[#fffaf7]">
                  <td className="px-6 py-4 text-sm font-semibold text-[#171111]">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-[#171111]">{order.deliveryInfo?.fullName}</td>
                  <td className="px-6 py-4 text-sm font-black text-[#171111]">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 text-sm text-[#6c5c58]">{new Date(order.updatedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4d5cf] text-[#171111] transition hover:border-[#9a1515]"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleApprove(order._id)}
                        disabled={processingId === order._id}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(order._id)}
                        disabled={processingId === order._id}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-5">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </section>

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default CancellationRequests;
