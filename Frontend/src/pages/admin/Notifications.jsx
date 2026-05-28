import React from 'react';
import { Bell, CheckCheck, Trash2, User, ShoppingBag, Info, Clock, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const { notifications, loading, markAllAsRead, deleteNotification } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'Order': return <ShoppingBag className="h-5 w-5 text-blue-600" />;
      case 'User': return <User className="h-5 w-5 text-emerald-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'Order': return 'bg-blue-50';
      case 'User': return 'bg-emerald-50';
      default: return 'bg-gray-50';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Notifications</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">Stay updated with the latest activities on your platform.</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#eadbd6] bg-white px-6 text-sm font-bold text-[#8d0000] transition hover:border-[#9a1515] hover:bg-[#fff7f3]"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </button>
      </div>

      <section className="overflow-hidden rounded-3xl border border-[#eadbd6] bg-white shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
        {loading ? (
          <div className="py-20 text-center text-[#8b7772] font-medium">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-32 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#fff4f0] text-[#8d0000]">
              <Bell className="h-10 w-10 opacity-20" />
            </div>
            <h3 className="mt-6 font-serif text-xl font-black text-[#171111]">No notifications yet</h3>
            <p className="mt-2 text-sm text-[#6c5c58]">We'll notify you when something important happens.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#efe3df]">
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`group flex items-start gap-5 p-6 transition hover:bg-[#fffaf7] ${!notif.isRead ? 'bg-[#fffcfb]' : ''}`}
              >
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${getBgColor(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className={`text-sm tracking-tight ${!notif.isRead ? 'font-black text-[#171111]' : 'font-semibold text-[#4c3936]'}`}>
                      {notif.message}
                    </p>
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#958783] whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-4">
                    {notif.link && (
                      <Link 
                        to={notif.link}
                        className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#8d0000] hover:underline"
                      >
                        Details
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    <button 
                      onClick={() => deleteNotification(notif._id)}
                      className="text-xs font-black uppercase tracking-widest text-[#958783] opacity-0 transition group-hover:opacity-100 hover:text-[#8d0000]"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {!notif.isRead && (
                  <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#8d0000]" />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Notifications;
