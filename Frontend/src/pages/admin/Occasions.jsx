import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Filter,
  Image as ImageIcon,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOccasions } from '../../contexts/OccasionContext';
import Pagination from '../../components/admin/Pagination';

const formatDate = (date) => {
  if (!date) return 'Added recently';
  return `Added on ${new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`;
};

const Occasions = () => {
  const { occasions, loading, fetchOccasions, deleteOccasion } = useOccasions();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const occasionsPerPage = 10;

  useEffect(() => {
    fetchOccasions();
  }, []);

  const filteredOccasions = useMemo(() => {
    return occasions.filter((occasion) => {
      const matchesQuery = `${occasion.name || ''} ${occasion.tag || ''}`.toLowerCase().includes(query.toLowerCase());
      const occasionStatus = occasion.isActive === false ? 'Inactive' : 'Active';
      const matchesStatus = status === 'All Status' || status === occasionStatus;
      return matchesQuery && matchesStatus;
    });
  }, [occasions, query, status]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOccasions.length / occasionsPerPage);
  const paginatedOccasions = useMemo(() => {
    const startIndex = (currentPage - 1) * occasionsPerPage;
    return filteredOccasions.slice(startIndex, startIndex + occasionsPerPage);
  }, [filteredOccasions, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [query, status]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this occasion? This will prevent it from appearing on the frontend.')) {
      await deleteOccasion(id);
    }
  };

  const resetFilters = () => {
    setQuery('');
    setStatus('All Status');
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Occasions Listing</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">Manage occasion categories and their display settings.</p>
        </div>
        <Link
          to="/admin/occasions/add"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#8d0000] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(141,0,0,0.2)] transition hover:bg-[#760000]"
        >
          <Plus className="h-4 w-4" />
          Add Occasion
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#eadbd6] bg-white shadow-[0_14px_34px_rgba(80,24,18,0.05)]">
        <div className="flex flex-col gap-4 border-b border-[#efe3df] p-5 xl:flex-row xl:items-center">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-[#e4d5cf] bg-white px-4">
            <Search className="h-4 w-4 text-[#9a1515]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search occasions by name or tag..."
              className="w-full border-none bg-transparent text-sm text-[#4c3936] outline-none placeholder:text-[#8b7772]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 xl:w-[410px]">
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
                <th className="px-4 py-4 font-black">Occasion</th>
                <th className="px-4 py-4 font-black">Tag</th>
                <th className="px-4 py-4 font-black">Filter Key</th>
                <th className="px-4 py-4 font-black">Status</th>
                <th className="px-6 py-4 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center font-serif text-xl text-[#8b7772]">Loading occasions...</td>
                </tr>
              ) : paginatedOccasions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-sm font-medium text-[#8b7772]">No occasions found.</td>
                </tr>
              ) : paginatedOccasions.map((occasion) => {
                const isActive = occasion.isActive !== false;

                return (
                  <tr key={occasion._id} className="border-b border-[#efe3df] transition hover:bg-[#fffaf7]">
                    <td className="px-6 py-4">
                      <span className="block h-4 w-4 rounded border border-[#d9c9c3]" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#f5efec]">
                          {occasion.image ? (
                            <img src={occasion.image} alt={occasion.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-[#b8a7a1]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#171111]">{occasion.name}</p>
                          <p className="mt-1 text-sm font-medium text-[#6c5c58]">{formatDate(occasion.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#4c3936]">{occasion.tag}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#171111]">{occasion.filter}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-4 py-1.5 text-xs font-black ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/admin/occasions/edit/${occasion._id}`}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4d5cf] text-[#6c5c58] transition hover:border-[#9a1515] hover:text-[#9a1515]" 
                          aria-label={`Edit ${occasion.name}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(occasion._id)}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4d5cf] text-[#b00000] transition hover:border-[#b00000] hover:bg-red-50"
                          aria-label={`Delete ${occasion.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default Occasions;
