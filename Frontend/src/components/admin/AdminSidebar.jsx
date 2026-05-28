import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronDown,
  Grid2X2,
  LogOut,
  PackagePlus,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import logo from '../../assets/home/logo1.png';

const navItems = [
  { icon: Grid2X2, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: PackagePlus, label: 'Add Product', path: '/admin/products/add' },
  { icon: Store, label: 'Product Listing', path: '/admin/products' },
  { icon: Grid2X2, label: 'Occasions', path: '/admin/occasions' },
  { icon: ShoppingBag, label: 'Orders Listing', path: '/admin/orders' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: TrendingUp, label: 'Expenses', path: '/admin/expenses' },
];

const AdminSidebar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[248px] flex-col overflow-hidden bg-[#8d0000] text-white shadow-[18px_0_45px_rgba(70,0,0,0.16)]">
      <div className="relative flex h-[128px] shrink-0 flex-col items-center justify-center border-b border-white/8 px-6">
        <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/15" aria-label="Collapse sidebar">
          <ChevronDown className="h-4 w-4 rotate-90" />
        </button>
        <img src={logo} alt="Craftoria" className="h-16 w-auto brightness-0 invert" />
      </div>

      <nav className="flex-1 space-y-3 px-5 py-7">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin/products'}
            className={({ isActive }) => `
              flex h-12 items-center gap-4 rounded-xl px-4 text-[15px] font-semibold transition duration-300
              ${isActive
                ? 'bg-[#fff7f0] text-[#8d0000] shadow-[0_14px_28px_rgba(53,0,0,0.18)]'
                : 'text-white/88 hover:bg-white/10 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 ${isActive ? 'text-[#a01010]' : 'text-white/82'}`} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 px-5 pb-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#760000] p-3">
          <img
            src={user?.imageUrl}
            alt="Profile"
            className="h-11 w-11 rounded-full border border-white/30 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user?.firstName || user?.fullName || 'Admin'}</p>
            <p className="text-xs text-white/70">Super Admin</p>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: '/' })}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/78 transition hover:bg-white/10 hover:text-white"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
