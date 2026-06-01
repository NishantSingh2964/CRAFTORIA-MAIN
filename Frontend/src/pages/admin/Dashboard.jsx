import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Clock3,
  Eye,
  DollarSign,
  Package,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Users,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import { useAdmin } from '../../contexts/AdminContext';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';

const formatCurrency = (value = 0) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value);

const sparkLines = [
  '34,58 58,56 82,42 106,47 130,34 154,54 178,68 202,60 226,64 250,45 274,34 298,52 322,66 346,60 370,64 394,40',
  '34,60 58,58 82,43 106,35 130,50 154,65 178,54 202,57 226,62 250,44 274,35 298,52 322,67 346,62 370,59 394,38',
  '34,57 58,55 82,38 106,45 130,35 154,52 178,66 202,58 226,60 250,50 274,34 298,43 322,66 346,62 370,58 394,36',
  '34,61 58,59 82,51 106,36 130,48 154,36 178,54 202,67 226,58 250,61 274,44 298,35 322,50 346,67 370,58 394,37',
];

const categoryData = [
  { label: 'Flowers & Bouquets', value: 48750, percent: 39, color: '#990d0d', stroke: 'stroke-[#990d0d]', dash: '32 68', offset: 0 },
  { label: 'Gift Hampers', value: 38200, percent: 31, color: '#c8252c', stroke: 'stroke-[#c8252c]', dash: '25 75', offset: -32 },
  { label: 'Personalized Gifts', value: 22450, percent: 18, color: '#eea07c', stroke: 'stroke-[#eea07c]', dash: '15 85', offset: -57 },
  { label: 'Chocolates', value: 10850, percent: 9, color: '#db5c5d', stroke: 'stroke-[#db5c5d]', dash: '8 92', offset: -72 },
  { label: 'Others', value: 4700, percent: 3, color: '#d66963', stroke: 'stroke-[#d66963]', dash: '4 96', offset: -80 },
];

const statusItems = [
  { label: 'Pending', count: 32, icon: Clock3, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Processing', count: 58, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Shipped', count: 96, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Delivered', count: 186, icon: Check, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Cancelled', count: 12, icon: X, color: 'text-red-500', bg: 'bg-red-50' },
];

const fallbackOrders = [
  { _id: 'ORD00125', shippingDetails: { firstName: 'Riya', lastName: 'Sharma' }, createdAt: '2024-05-18', totalAmount: 2299, status: 'Delivered' },
  { _id: 'ORD00124', shippingDetails: { firstName: 'Arjun', lastName: 'Mehta' }, createdAt: '2024-05-18', totalAmount: 1499, status: 'Processing' },
  { _id: 'ORD00123', shippingDetails: { firstName: 'Neha', lastName: 'Verma' }, createdAt: '2024-05-17', totalAmount: 3199, status: 'Shipped' },
  { _id: 'ORD00122', shippingDetails: { firstName: 'Karan', lastName: 'Singh' }, createdAt: '2024-05-17', totalAmount: 999, status: 'Pending' },
  { _id: 'ORD00121', shippingDetails: { firstName: 'Ananya', lastName: 'Reddy' }, createdAt: '2024-05-16', totalAmount: 2599, status: 'Delivered' },
];

const getStatusClass = (status = '') => {
  const normalized = status.toLowerCase();
  if (normalized.includes('deliver')) return 'bg-emerald-100 text-emerald-700';
  if (normalized.includes('ship')) return 'bg-green-100 text-green-700';
  if (normalized.includes('pend')) return 'bg-orange-100 text-orange-700';
  if (normalized.includes('cancel')) return 'bg-red-100 text-red-700';
  return 'bg-blue-100 text-blue-700';
};

const Dashboard = () => {
  const { stats, loading, fetchDashboardStats } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Derived Summary Data
  const revenue = stats?.totalIncome || 0;
  const ordersCount = Object.values(stats?.orderSummary || {}).reduce((a, b) => a + b, 0);
  const customers = stats?.totalUsers || 0;
  const products = stats?.totalProducts || 0;
  const recentOrders = stats?.recentOrders || [];

  // Order Status Mapping
  const statusItems = [
    { label: 'Pending', count: stats?.orderSummary?.Pending || 0, icon: Clock3, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Processing', count: stats?.orderSummary?.Processing || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Shipped', count: stats?.orderSummary?.Shipped || 0, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Delivered', count: stats?.orderSummary?.Delivered || 0, icon: Check, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Cancelled', count: stats?.orderSummary?.Cancelled || 0, icon: X, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  // Category Chart Mapping
  const colors = ['#990d0d', '#c8252c', '#eea07c', '#db5c5d', '#d66963'];
  const categoryData = useMemo(() => {
    if (!stats?.categoryRevenue?.length) return [];

    let offset = 0;
    return stats.categoryRevenue.map((item, idx) => {
      const percent = Math.round((item.totalRevenue / revenue) * 100);
      const dash = `${percent} ${100 - percent}`;
      const currentOffset = offset;
      offset -= percent;

      return {
        label: item._id || 'Uncategorized',
        value: item.totalRevenue,
        percent,
        color: colors[idx % colors.length],
        stroke: `stroke-[${colors[idx % colors.length]}]`,
        dash,
        offset: currentOffset,
      };
    });
  }, [stats?.categoryRevenue, revenue]);

  // Sparkline Generation for Weekly Trend
  const getChartPoints = (metric) => {
    if (!stats?.weeklyStats?.length) return '';
    const values = stats.weeklyStats.map(d => d[metric]);
    const max = Math.max(...values, 1);
    return stats.weeklyStats.map((d, i) => `${34 + (i * 60)},${70 - (d[metric] / max * 60)}`).join(' ');
  };

  if (loading && !stats) {
    return (
      <div className="grid min-h-[60vh] place-items-center font-serif text-2xl text-[#8d0000]">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Dashboard</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">Welcome back, Admin! Here's what's happening with Craftoria.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(revenue)} icon={ShoppingBag} trendValue="+12.5" sparkline={getChartPoints('revenue')} />
        <StatCard title="Total Orders" value={ordersCount.toLocaleString('en-IN')} icon={ShoppingCart} trendValue="+8.3" sparkline={getChartPoints('orders')} />
        <StatCard title="Total Products" value={products.toLocaleString('en-IN')} icon={Package} trendValue="+5.2" sparkline={getChartPoints('products')} />
        <StatCard title="Total Customers" value={customers.toLocaleString('en-IN')} icon={Users} trendValue="+10.7" sparkline={getChartPoints('users')} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.65fr_0.65fr]">
        <section className="rounded-2xl border border-[#eadbd6] bg-white p-5 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#171111]">Revenue Overview</h2>
            <button className="rounded-xl border border-[#eadbd6] px-3 py-1.5 text-xs font-bold text-[#8d0000]">Last 7 Days</button>
          </div>
          <div className="relative h-[178px]">
            <div className="absolute inset-x-0 top-0 flex h-full flex-col justify-between pl-1 text-xs font-medium text-[#6c5c58]">
              {['MAX', 'MID', 'LOW', 'MIN'].map((label, i) => {
                const max = Math.max(...(stats?.weeklyStats?.map(d => d.revenue) || [0]), 1000);
                const val = Math.round(max * (1 - i / 3));
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-12 text-[10px]">{formatCurrency(val).replace('.00', '')}</span>
                    <span className="h-px flex-1 bg-[#efe3df]" />
                  </div>
                );
              })}
            </div>
            {/* Dynamic SVG Chart */}
            <svg className="absolute inset-0 h-full w-full pl-14 pt-2" viewBox="0 0 640 220" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a20d0d" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#a20d0d" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {stats?.weeklyStats?.length > 0 && (
                <>
                  <path
                    d={`M0 210 ${stats.weeklyStats.map((d, i) => {
                      const max = Math.max(...stats.weeklyStats.map(rv => rv.revenue), 1);
                      return `L${i * (640 / 6)} ${210 - (d.revenue / max * 180)}`;
                    }).join(' ')} L640 210 Z`}
                    fill="url(#revenue-fill)"
                  />
                  <path
                    d={`M0 ${210 - (stats.weeklyStats[0].revenue / Math.max(...stats.weeklyStats.map(rv => rv.revenue), 1) * 180)} ${stats.weeklyStats.slice(1).map((d, i) => {
                      const max = Math.max(...stats.weeklyStats.map(rv => rv.revenue), 1);
                      return `L${(i + 1) * (640 / 6)} ${210 - (d.revenue / max * 180)}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#a20d0d"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </div>
          <div className="ml-14 mt-4 grid grid-cols-7 text-center text-[10px] font-black uppercase tracking-tighter text-[#8b7772]">
            {stats?.weeklyStats?.map((d) => <span key={d.date}>{d.date}</span>)}
          </div>
        </section>

        <section className="rounded-2xl border border-[#eadbd6] bg-white p-5 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#171111]">Order Status</h2>
          </div>
          <div className="space-y-4">
            {statusItems.map((item) => (
              <div key={item.label} className="group flex items-center gap-3">
                <span className={`grid h-8 w-8 place-items-center rounded-lg ${item.bg} ${item.color} transition group-hover:scale-110`}>
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-semibold text-[#2b1d1a]">{item.label}</span>
                <span className="text-sm font-black text-[#171111]">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <section className="overflow-hidden rounded-2xl border border-[#eadbd6] bg-white shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
          <div className="flex items-center justify-between border-b border-[#f1e5e1] px-6 py-5">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#171111]">Top Categories</h2>
              <p className="mt-1 text-xs font-medium text-[#8b7772]">Revenue by gifting segment</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
              <div className="relative h-[200px] w-[200px] shrink-0">
                <div className="absolute inset-2 rounded-full bg-[#fff7f3]" />
                <svg className="relative h-full w-full -rotate-90 drop-shadow-md" viewBox="0 0 42 42" aria-hidden="true">
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="#f6e8e4" strokeWidth="8" />
                  {categoryData.map((item) => (
                    <circle
                      key={item.label}
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="8"
                      strokeDasharray={item.dash}
                      strokeDashoffset={item.offset}
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <p className="font-serif text-lg font-black leading-none text-[#171111]">{formatCurrency(revenue).replace('.00', '')}</p>
                    <p className="mt-1 text-[8px] font-black uppercase tracking-widest text-[#8b7772]">Total Rev</p>
                  </div>
                </div>
              </div>

              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                {categoryData.length > 0 ? categoryData.slice(0, 4).map((item) => (
                  <div key={item.label} className="group rounded-xl border border-[#f0e3df] bg-[#fffaf8] p-3 transition-all hover:border-[#a20d0d] hover:bg-white">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <p className="min-w-0 flex-1 truncate text-[10px] font-black uppercase tracking-wider text-[#2b1d1a]">{item.label}</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-sm font-black text-[#171111]">{formatCurrency(item.value).replace('.00', '')}</p>
                      <span className="text-xs font-black text-[#8b7772]">{item.percent}%</span>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-6 text-center font-serif text-[#8b7772]">No category data yet.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
            <div className="mb-6">
                <h2 className="font-serif text-lg font-bold text-[#171111]">Low Inventory</h2>
                <p className="mt-1 text-xs font-medium text-[#8b7772]">Stock alerts for top items</p>
            </div>
            <div className="space-y-4">
                {stats?.lowStockProducts?.length > 0 ? stats.lowStockProducts.map((p) => (
                    <div key={p._id} className="group flex items-center gap-4 rounded-xl border border-transparent p-1 transition hover:bg-[#fff9f6] hover:border-[#f1e5e1]">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                            {p.image ? (
                                <img src={p.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <div className="grid h-full w-full place-items-center text-xs font-black text-gray-300">PFG</div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-bold text-[#2b1d1a] group-hover:text-[#a20d0d]">{p.name}</p>
                            <p className="text-[10px] font-semibold text-[#8b7772]">{p.category}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-black ${p.stock === 0 ? 'text-[#8d0000]' : 'text-gray-900'}`}>
                            {p.stock} <span className="text-[10px] uppercase text-gray-400">Left</span>
                          </p>
                          <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-gray-100">
                             <div 
                               className={`h-full transition-all duration-1000 ${p.stock === 0 ? 'bg-red-600' : p.stock < 5 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                               style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }}
                             />
                          </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center font-serif text-[#8b7772]">Inventory levels are healthy.</div>
                )}
            </div>
            <Link 
                to="/admin/products"
                className="mt-6 flex w-full items-center justify-center rounded-xl border border-[#eadbd6] py-2.5 text-[10px] font-black uppercase tracking-widest text-[#8d0000] transition hover:bg-[#8d0000] hover:text-white"
            >
                View Full Inventory
            </Link>
        </section>
      </div>

      <section className="rounded-2xl border border-[#eadbd6] bg-white p-6 shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#171111]">Recent Orders</h2>
          <button className="text-xs font-black uppercase tracking-wider text-[#8d0000] hover:underline">View Ledger</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-[#eadbd6] text-[10px] uppercase font-black tracking-[0.2em] text-[#8b7772]">
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? recentOrders.map((order) => {
                const customerName = order.deliveryInfo?.fullName || 'Craftoria Customer';
                const orderId = order.orderNumber || `#${order._id?.slice(-8)}`;
                const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

                return (
                  <tr key={order._id} className="border-b border-[#f0e5e1] transition hover:bg-[#fff9f6]">
                    <td className="px-4 py-5 text-sm font-black text-[#171111]">{orderId}</td>
                    <td className="px-4 py-5">
                      <p className="text-sm font-black text-[#2b1d1a]">{customerName}</p>
                      <p className="mt-1 text-xs font-semibold text-[#8b7772]">{order.deliveryInfo?.email || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-5 text-sm font-medium text-[#2b1d1a]">{orderDate}</td>
                    <td className="px-4 py-5 text-sm font-black text-[#171111]">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${getStatusClass(order.status)}`}>
                        {order.status || 'Received'}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <button 
                        onClick={() => {
                          console.log('EYE CLICKED on Dashboard - Opening Modal for:', order);
                          setSelectedOrder(order);
                        }}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-[#eadbd6] text-[#6c5c58] transition hover:border-[#9a1515] hover:text-[#9a1515]" 
                        title="Quick View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center font-serif text-[#8b7772]">No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

export default Dashboard;
