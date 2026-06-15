import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Grid2X2,
  LogOut,
  PackagePlus,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/home/logo1.png';

const navItems = [
  { icon: Grid2X2, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: PackagePlus, label: 'Add Product', path: '/admin/products/add' },
  { icon: Store, label: 'Product Listing', path: '/admin/products' },
  { icon: Grid2X2, label: 'Occasions', path: '/admin/occasions' },
  { icon: ShoppingBag, label: 'Orders Listing', path: '/admin/orders' },
  { icon: Sparkles, label: 'Personalized Gifts', path: '/admin/personalized-products' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: TrendingUp, label: 'Expenses', path: '/admin/expenses' },
];

const AdminSidebar = ({ isCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className={`fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden bg-[#8d0000] text-white shadow-[18px_0_45px_rgba(70,0,0,0.16)] transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[248px]'}`}>
      <div className="relative flex h-[128px] shrink-0 flex-col items-center justify-center border-b border-white/8 px-4">
        <Link to="/" className="flex items-center justify-center transition-transform hover:scale-105">
          <img
            src={logo}
            alt="Craftoria"
            className={`brightness-0 invert transition-all duration-300 ${isCollapsed ? 'h-10 w-10 object-contain' : 'h-16 w-auto'}`}
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-3 px-5 py-7">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin/products'}
            className={({ isActive }) => `
              flex h-12 items-center rounded-xl transition duration-300
              ${isCollapsed ? 'justify-center mx-2 px-0' : 'gap-4 px-4 mx-0'}
              ${isActive
                ? 'bg-[#fff7f0] text-[#8d0000] shadow-[0_14px_28px_rgba(53,0,0,0.18)]'
                : 'text-white/88 hover:bg-white/10 hover:text-white'}
            `}
            title={isCollapsed ? item.label : ''}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#a01010]' : 'text-white/82'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 px-4 pb-4">
        <div className={`flex items-center rounded-xl border border-white/10 bg-[#760000] transition-all duration-300 ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-3'}`}>
          <div className="h-10 w-10 shrink-0 rounded-full border border-white/30 overflow-hidden bg-[#8d0000] flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Users className="h-5 w-5 text-white/50" />
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-white/70">{user?.role || 'Admin'}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/78 transition hover:bg-white/10 hover:text-white"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
