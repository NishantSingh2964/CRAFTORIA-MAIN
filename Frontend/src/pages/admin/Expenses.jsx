import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, DollarSign, Calendar, Tag, X, Loader2, Eye, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatPrice';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ totalOverall: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Others',
    message: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, statsRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/expenses/stats')
      ]);
      setExpenses(expensesRes.data.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogExpense = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      return toast.error('Please fill all required fields');
    }

    try {
      setIsSubmitting(true);
      await api.post('/expenses', formData);
      toast.success('Expense logged successfully');
      setShowModal(false);
      setFormData({
        title: '',
        amount: '',
        category: 'Others',
        message: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchData(); // Refresh list and stats
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to log expense';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const filteredExpenses = expenses.filter(exp => 
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryStat = (cat) => {
    const stat = stats.byCategory.find(s => s._id === cat);
    return stat ? stat.totalAmount : 0;
  };

  if (loading && expenses.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#760000] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">Expenditure</h1>
          <p className="font-sans text-gray-500 text-sm italic">Track your operational costs and overheads.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#760000] hover:bg-[#5a0000] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#760000]/10"
        >
          <Plus className="w-4 h-4" />
          Log Expense
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:border-[#760000]/20 transition-colors">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Total Revenue</p>
            <h2 className="font-serif text-2xl font-bold text-gray-900 text-center">{formatPrice(stats.totalRevenue || 0)}</h2>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:border-[#760000]/20 transition-colors">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Operational Expenses</p>
            <h2 className="font-serif text-2xl font-bold text-[#760000] text-center">{formatPrice(stats.totalOverall)}</h2>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:border-[#760000]/20 transition-colors border-emerald-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Product COGS</p>
            <h2 className="font-serif text-2xl font-bold text-gray-900 text-center">{formatPrice(stats.totalCogs || 0)}</h2>
        </div>
        <div className="bg-[#760000] p-6 rounded-3xl shadow-lg shadow-[#760000]/20">
            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1 text-center">Net Profit</p>
            <h2 className="font-serif text-2xl font-bold text-white text-center">
              {formatPrice((stats.totalRevenue || 0) - (stats.totalOverall + (stats.totalCogs || 0)))}
            </h2>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex-grow flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl focus-within:border-[#760000]/30 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search records by title or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none font-sans text-sm w-full"
          />
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-4">Transaction</th>
                <th className="px-8 py-4 text-center">Category</th>
                <th className="px-8 py-4 text-center">Date</th>
                <th className="px-8 py-4 text-right">Amount</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#760000] group-hover:bg-[#760000]/5 transition-all">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{expense.title}</p>
                        <p className="text-[10px] text-gray-400 font-sans tracking-tight italic">
                          {expense.category} {expense.message && `| ${expense.message.substring(0, 30)}${expense.message.length > 30 ? '...' : ''}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center text-xs text-gray-500 font-sans">
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-gray-900 font-sans italic">
                      -{formatPrice(expense.amount)}
                  </td>
                  <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => { setSelectedExpense(expense); setShowViewModal(true); }}
                          className="p-2 hover:bg-[#760000]/5 text-gray-400 hover:text-[#760000] rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-gray-400 text-sm font-sans italic">
                    No expense records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#760000] px-6 py-4 flex items-center justify-between font-serif">
              <h3 className="text-xl font-bold text-white">Log New Expense</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleLogExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Expense Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Packaging Boxes"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-sans text-sm outline-none focus:border-[#760000]/30 transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Amount (₹)</label>
                  <input 
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-sans text-sm outline-none focus:border-[#760000]/30 transition-all"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-sans text-sm outline-none focus:border-[#760000]/30 transition-all"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Shipping">Shipping</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Note / Message (Optional)</label>
                <textarea 
                  placeholder="Additional details about this transaction..."
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-sans text-sm outline-none focus:border-[#760000]/30 transition-all resize-none font-medium text-gray-700"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Transaction Date</label>
                <input 
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-sans text-sm outline-none focus:border-[#760000]/30 transition-all"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#760000] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#5a0000] transition-all shadow-lg shadow-[#760000]/10 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSubmitting ? 'Logging...' : 'Log Expense'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Expense Detail Modal */}
      {showViewModal && selectedExpense && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between font-serif">
              <h3 className="text-xl font-bold text-white">Expense Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#760000]/10 flex items-center justify-center text-[#760000]">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Spent</p>
                  <p className="text-2xl font-serif font-black text-gray-900">{formatPrice(selectedExpense.amount)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction Title</p>
                  <p className="font-sans text-sm font-bold text-gray-900">{selectedExpense.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                  <span className="inline-block px-3 py-1 bg-[#760000]/5 border border-[#760000]/10 rounded-full text-[10px] font-bold text-[#760000] uppercase">
                    {selectedExpense.category}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="font-sans text-sm text-gray-600">
                    {new Date(selectedExpense.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Note / Description</p>
                <div className="p-4 bg-gray-50 rounded-xl text-sm font-sans text-gray-700 italic leading-relaxed border border-gray-100">
                  {selectedExpense.message || 'No additional notes provided for this transaction.'}
                </div>
              </div>

              <button 
                onClick={() => setShowViewModal(false)}
                className="w-full py-3 border-2 border-gray-200 text-gray-600 font-sans text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
