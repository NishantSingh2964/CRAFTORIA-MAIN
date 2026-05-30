import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  RotateCcw,
  Search,
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import toast from 'react-hot-toast';
import Pagination from '../../components/admin/Pagination';
import UserAccountModal from '../../components/admin/UserAccountModal';

const avatarColors = [
  'bg-[#fde8e3] text-[#9a1515]',
  'bg-[#dff7e9] text-[#067a46]',
  'bg-[#eadfff] text-[#673ab7]',
  'bg-[#fff0d8] text-[#9a5a00]',
  'bg-[#ffe1e1] text-[#b00000]',
  'bg-[#dceaff] text-[#2457a6]',
];

const getInitials = (name = '', email = '') => {
  const source = name || email || 'User';
  const parts = source.split(/[.\s@]+/).filter(Boolean);
  return `${parts[0]?.[0] || 'U'}${parts[1]?.[0] || ''}`.toUpperCase();
};

const formatDate = (date) => {
  if (!date) return { day: 'Recently', time: '--:--' };
  const parsed = new Date(date);
  return {
    day: parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: parsed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };
};



const UserList = () => {
  const { users, loading, fetchUsers, updateUserRole, currentUser, fetchCurrentAdmin } = useAdmin();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All Roles');
  const [status, setStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchCurrentAdmin();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchable = `${user.name || ''} ${user.email || ''}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const roleLabel = user.role === 'User' ? 'Customer' : user.role;
      const matchesRole = role === 'All Roles' || role === roleLabel;
      const userStatus = user.isActive === false ? 'Inactive' : 'Active';
      const matchesStatus = status === 'All Status' || status === userStatus;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, role, status, users]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [query, role, status]);

  const resetFilters = () => {
    setQuery('');
    setRole('All Roles');
    setStatus('All Status');
  };

  const handleRoleChange = async (userId, newRole) => {
    const roleValue = newRole === 'Customer' ? 'User' : newRole;
    const result = await updateUserRole(userId, roleValue);
    if (result.success) {
      toast.success('User role updated successfully');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Users Listing</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">View and manage all registered users.</p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#8d0000] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(141,0,0,0.2)] transition hover:bg-[#760000]"
        >
          <Download className="h-4 w-4" />
          Export Users
        </button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#eadbd6] bg-white shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
        <div className="flex flex-col gap-4 border-b border-[#efe3df] p-5 xl:flex-row xl:items-center">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-[#e4d5cf] bg-white px-4">
            <Search className="h-4 w-4 text-[#9a1515]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full border-none bg-transparent text-sm text-[#4c3936] outline-none placeholder:text-[#8b7772]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3 xl:w-[510px]">
            <label className="relative">
              <span className="sr-only">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-white px-4 pr-10 text-sm text-[#6c5c58] outline-none focus:border-[#9a1515]"
              >
                <option>All Roles</option>
                <option>Customer</option>
                <option>Admin</option>
                <option>SuperAdmin</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c5c58]" />
            </label>

            <label className="relative">
              <span className="sr-only">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-white px-4 pr-10 text-sm text-[#6c5c58] outline-none focus:border-[#9a1515]"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c5c58]" />
            </label>

            <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#e4d5cf] bg-white px-4 text-sm font-bold text-[#8d0000] transition hover:border-[#9a1515]">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#e4d5cf] bg-white px-5 text-sm font-bold text-[#8d0000] transition hover:border-[#9a1515] xl:ml-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead>
              <tr className="border-b border-[#efe3df] bg-white text-[11px] uppercase tracking-wider text-[#8b8f99]">
                <th className="w-14 px-6 py-4">
                  <span className="block h-4 w-4 rounded border border-[#d9c9c3]" />
                </th>
                <th className="px-4 py-4 font-black">User</th>
                <th className="px-4 py-4 font-black">Role</th>
                <th className="px-4 py-4 font-black">Joined On</th>
                <th className="px-4 py-4 font-black">Status</th>
                <th className="px-6 py-4 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center font-serif text-xl text-[#8b7772]">Loading users...</td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-sm font-medium text-[#8b7772]">No users found.</td>
                </tr>
              ) : paginatedUsers.map((user, index) => {
                const joined = formatDate(user.createdAt);
                const roleLabel = user.role === 'User' ? 'Customer' : user.role;
                const isActive = user.isActive !== false;

                return (
                  <tr key={user._id} className="border-b border-[#efe3df] transition hover:bg-[#fffaf7]">
                    <td className="px-6 py-4">
                      <span className="block h-4 w-4 rounded border border-[#d9c9c3]" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full text-sm font-black ${avatarColors[index % avatarColors.length]}`}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name || user.email} className="h-full w-full object-cover" />
                          ) : (
                            getInitials(user.name, user.email)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#171111]">{user.name || 'Incognito User'}</p>
                          <p className="mt-1 text-sm font-medium text-[#6c5c58]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {user.role === 'SuperAdmin' ? (
                        <span className="inline-flex rounded-full bg-purple-100 px-3 py-1.5 text-xs font-black text-purple-700">
                          SuperAdmin
                        </span>
                      ) : currentUser?.role === 'SuperAdmin' ? (
                        <div className="relative inline-block">
                          <select
                            value={roleLabel}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`appearance-none rounded-lg border px-3 py-2 pr-9 text-[11px] font-black uppercase tracking-wider outline-none transition-all cursor-pointer shadow-sm hover:shadow-md focus:ring-2 focus:ring-opacity-50 ${
                              roleLabel === 'Admin' 
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 focus:ring-indigo-500' 
                                : 'bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-500'
                            }`}
                          >
                            <option>Customer</option>
                            <option>Admin</option>
                          </select>
                          <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-70 ${
                              roleLabel === 'Admin' ? 'text-indigo-600' : 'text-blue-600'
                          }`} />
                        </div>
                      ) : (
                        <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${
                            roleLabel === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {roleLabel}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-[#171111]">{joined.day}</p>
                      <p className="mt-1 text-sm font-medium text-[#6c5c58]">{joined.time}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black before:h-1.5 before:w-1.5 before:rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700 before:bg-emerald-600' : 'bg-red-100 text-red-700 before:bg-red-600'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => setSelectedUser(user)}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4d5cf] text-[#171111] transition hover:border-[#9a1515] hover:text-[#9a1515]" 
                          aria-label={`View ${user.name || user.email}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4d5cf] text-[#8d0000] transition hover:border-[#9a1515] hover:bg-[#fff7f3]" aria-label={`More actions for ${user.name || user.email}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
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

      {/* User Details Modal */}
      <UserAccountModal 
        user={selectedUser} 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
    </div>
  );
};

export default UserList;
