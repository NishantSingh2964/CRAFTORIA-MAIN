import React, { useState } from 'react';
import { Search, Plus, Filter, DollarSign, Calendar, Tag } from 'lucide-react';

const Expenses = () => {
  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">Expenditure</h1>
          <p className="font-sans text-gray-500 text-sm italic">Track your operational costs and overheads.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#760000] hover:bg-[#5a0000] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#760000]/10">
          <Plus className="w-4 h-4" />
          Log Expense
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Total Monthly Outflow</p>
            <h2 className="font-serif text-3xl font-bold text-gray-900 text-center">₹12,450</h2>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Packaging Costs</p>
            <h2 className="font-serif text-3xl font-bold text-[#760000] text-center">₹4,200</h2>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Delivery Overhead</p>
            <h2 className="font-serif text-3xl font-bold text-gray-900 text-center">₹8,250</h2>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex-grow flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-transparent border-none outline-none font-sans text-sm w-full"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">Date Range</span>
        </button>
      </div>

      {/* Expense Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-8 py-4">Transaction</th>
              <th className="px-8 py-4">Type</th>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[1,2,3,4].map((i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Custom Packaging Boxes</p>
                      <p className="text-[10px] text-gray-400 font-sans tracking-tight italic">Supplier: PrintPack Solutions</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase">
                    Operations
                  </span>
                </td>
                <td className="px-8 py-5 text-xs text-gray-500 font-sans">
                    May 1{i}, 2024
                </td>
                <td className="px-8 py-5 text-right font-bold text-gray-900 font-sans italic">
                    -₹1,200
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
