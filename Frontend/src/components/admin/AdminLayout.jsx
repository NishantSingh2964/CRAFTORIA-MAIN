import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, CalendarDays, Menu, Search, UserRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from './AdminSidebar';
import { useNotifications } from '../../contexts/NotificationContext';
import { useOrders } from '../../contexts/OrderContext';
import { Link } from 'react-router-dom';

const AdminLayout = () => {
  const { user } = useAuth();
  const { unreadCount, fetchNotifications } = useNotifications();
  const { adminOrders, fetchAllOrders } = useOrders();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    fetchAllOrders();
    fetchNotifications();
  }, []);

  const pendingCancellations = useMemo(() => {
    return adminOrders.filter(o => o.status === 'Cancellation Requested').length;
  }, [adminOrders]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#201514]">
      <Toaster />
      <AdminSidebar isCollapsed={isCollapsed} />

      <main className={`${isCollapsed ? 'ml-[80px]' : 'ml-[248px]'} min-h-screen transition-all duration-300`}>
        <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-[#eadbd6] bg-white/94 px-9 backdrop-blur">
          <div className="flex items-center gap-7">
            <button 
              onClick={toggleSidebar}
              className="grid h-10 w-10 place-items-center rounded-full text-[#9a1515] transition hover:bg-[#fff3ef]" 
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <label className="flex h-11 w-[330px] items-center gap-3 rounded-full border border-[#eadbd6] bg-white px-5 shadow-[0_8px_24px_rgba(80,24,18,0.04)]">
              <span className="sr-only">Search dashboard</span>
              <Search className="h-5 w-5 text-[#a33a30]" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full border-none bg-transparent text-sm text-[#4c3936] outline-none placeholder:text-[#8b7772]"
              />
            </label>
          </div>

          <div className="flex items-center gap-5">
            <Link 
              to="/admin/cancellation-requests"
              className="relative grid h-10 w-10 place-items-center rounded-full text-[#9a1515] transition hover:bg-[#fff3ef]" 
              title="Cancellation Requests"
            >
              <AlertCircle className="h-5 w-5" />
              {pendingCancellations > 0 && (
                <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-orange-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {pendingCancellations}
                </span>
              )}
            </Link>
            <Link 
              to="/admin/notifications"
              className="relative grid h-10 w-10 place-items-center rounded-full text-[#9a1515] transition hover:bg-[#fff3ef]" 
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#9a1515] text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <button className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-[#f7e9e2] text-[#201514]" aria-label="Admin profile">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || 'Admin'} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1540px] px-9 py-9">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
