import React from 'react';
import { 
  X, 
  User, 
  Shield, 
  Mail, 
  ChevronRight, 
  Plus, 
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

const UserAccountModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[700px] animate-in zoom-in-95 duration-300">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-8 flex flex-col">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 leading-none">Account</h2>
            <p className="text-sm text-gray-500 mt-2">Manage user account info.</p>
          </div>
          
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-900 font-semibold text-sm transition text-left">
              <User className="h-4 w-4" />
              Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 font-medium text-sm transition text-left">
              <Shield className="h-4 w-4" />
              Security
            </button>
          </nav>

          <div className="mt-auto pt-8 border-t border-gray-200">
             <div className="flex items-center gap-2 text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-widest">Secured by</span>
                <span className="font-sans text-[11px] font-black tracking-tight flex items-center gap-1">
                   <ShieldCheck className="h-3 w-3 fill-gray-400 text-white" />
                   CLERK
                </span>
             </div>
             <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-3">Development mode</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white p-8 md:p-12 relative">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 transition text-gray-400 grayscale hover:grayscale-0"
          >
            <X className="h-5 w-5" />
          </button>

          <header className="mb-12">
            <h1 className="text-xl font-bold text-gray-900">Profile details</h1>
          </header>

          <div className="space-y-12">
            {/* Profile Section */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-gray-100 gap-4 group">
              <div className="text-sm font-semibold text-gray-700 w-32 uppercase tracking-wider">Profile</div>
              <div className="flex-1 flex items-center gap-5">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-red-50 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold text-[#760000]">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user.name?.charAt(0) || user.email?.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.name || 'Incognito User'}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-gray-400 hover:text-gray-900 transition flex items-center gap-1">
                Update profile
              </button>
            </section>

            {/* Email Addresses */}
            <section className="py-6 border-b border-gray-100">
               <div className="flex items-start justify-between mb-6">
                 <div className="text-sm font-semibold text-gray-700 w-32 uppercase tracking-wider">Email addresses</div>
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 -mx-2 rounded-lg transition group">
                       <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-900 font-medium">{user.email}</span>
                          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">Primary</span>
                       </div>
                       <MoreHorizontal className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    
                    <button className="flex items-center gap-2.5 text-gray-600 hover:text-gray-900 transition-colors">
                       <Plus className="h-4 w-4" />
                       <span className="text-[13px] font-bold">Add email address</span>
                    </button>
                 </div>
               </div>
            </section>

            {/* Connected Accounts */}
            <section className="py-6">
               <div className="flex items-start justify-between">
                 <div className="text-sm font-semibold text-gray-700 w-32 uppercase tracking-wider pt-1">Connected accounts</div>
                 <div className="flex-1">
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2 -mx-2 rounded-lg transition group">
                       <div className="flex items-center gap-3">
                          <div className="bg-white p-1 rounded border border-gray-200">
                             <svg width="14" height="14" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                             </svg>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">Google</span>
                          <span className="text-xs text-gray-400">• {user.email}</span>
                       </div>
                       <MoreHorizontal className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                 </div>
               </div>
            </section>

            {/* Quick Stats / Info Section */}
            <section className="bg-gray-50 rounded-xl p-8 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
               <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">User details</h4>
                  <div className="space-y-3">
                     <p className="text-sm text-gray-600 flex justify-between">
                        <span>User ID:</span>
                        <code className="text-[11px] bg-white px-1.5 py-0.5 rounded border border-gray-100 font-mono text-xs">{user._id || user.id}</code>
                     </p>
                     <p className="text-sm text-gray-600 flex justify-between">
                        <span>Joined On:</span>
                        <span className="font-bold text-gray-900 underline decoration-gray-200 underline-offset-4">{formatDate(user.createdAt)}</span>
                     </p>
                     <p className="text-sm text-gray-600 flex justify-between">
                        <span>Last Login:</span>
                        <span className="font-bold text-gray-900 underline decoration-gray-200 underline-offset-4">{formatDate(user.lastSignInAt || user.updatedAt)}</span>
                     </p>
                  </div>
               </div>
               
               <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Security info</h4>
                  <div className="space-y-4">
                     <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-green-50 text-green-600">
                           <Smartphone className="h-3.5 w-3.5" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-900 uppercase">2FA Enabled</p>
                           <p className="text-[11px] text-gray-500 font-medium uppercase tracking-tighter mt-1">Sms verification active</p>
                        </div>
                     </div>
                     <button className="text-xs font-bold text-[#760000] hover:underline uppercase tracking-tight flex items-center gap-1.5">
                        Manage security settings
                        <ChevronRight className="h-3 w-3" />
                     </button>
                  </div>
               </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserAccountModal;
