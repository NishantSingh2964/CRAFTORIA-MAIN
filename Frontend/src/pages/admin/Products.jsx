import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Filter,
  Package,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import Pagination from '../../components/admin/Pagination';

const formatCurrency = (value = 0) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value);

const formatDate = (date) => {
  if (!date) return 'Added recently';
  return `Added on ${new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`;
};

const Products = () => {
  const { products, loading, fetchProducts, deleteProduct } = useProducts();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return ['All Categories', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = `${product.name || ''} ${product._id || ''}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All Categories' || product.category === category;
      const productStatus = product.isAvailable === false ? 'Inactive' : 'Active';
      const matchesStatus = status === 'All Status' || status === productStatus;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, products, query, status]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [query, category, status]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('All Categories');
    setStatus('All Status');
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-[34px] font-black leading-tight text-[#171111]">Product Listing</h1>
          <p className="mt-1 text-sm font-medium text-[#6c5c58]">Manage and monitor all products in your store.</p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#8d0000] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(141,0,0,0.2)] transition hover:bg-[#760000]"
        >
          <Plus className="h-4 w-4" />
          Add Product
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
              placeholder="Search products by name, SKU..."
              className="w-full border-none bg-transparent text-sm text-[#4c3936] outline-none placeholder:text-[#8b7772]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3 xl:w-[610px]">
            <label className="relative">
              <span className="sr-only">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-[#e4d5cf] bg-white px-4 pr-10 text-sm text-[#6c5c58] outline-none focus:border-[#9a1515]"
              >
                {categories.map((item) => <option key={item}>{item}</option>)}
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
                <th className="px-4 py-4 font-black">Product</th>
                <th className="px-4 py-4 font-black">SKU</th>
                <th className="px-4 py-4 font-black">Category</th>
                <th className="px-4 py-4 font-black">Price</th>
                <th className="px-4 py-4 font-black">Stock</th>
                <th className="px-4 py-4 font-black">Status</th>
                <th className="px-6 py-4 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-8 py-20 text-center font-serif text-xl text-[#8b7772]">Loading products...</td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-8 py-20 text-center text-sm font-medium text-[#8b7772]">No products found.</td>
                </tr>
              ) : paginatedProducts.map((product, index) => {
                const isActive = product.isAvailable !== false;
                const isOut = Number(product.stock || 0) <= 0;
                const sku = product.sku || `CTR-${String(index + 1).padStart(3, '0')}`;

                return (
                  <tr key={product._id} className="border-b border-[#efe3df] transition hover:bg-[#fffaf7]">
                    <td className="px-6 py-4">
                      <span className="block h-4 w-4 rounded border border-[#d9c9c3]" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#f5efec]">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-6 w-6 text-[#b8a7a1]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#171111]">{product.name}</p>
                          <p className="mt-1 text-sm font-medium text-[#6c5c58]">{formatDate(product.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#4c3936]">{sku}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#171111]">{product.category || 'General'}</td>
                    <td className="px-4 py-4 text-sm font-black text-[#171111]">{formatCurrency(product.currentPrice)}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-[#171111]">{product.stock ?? 0}</p>
                      <p className={`mt-1 text-xs font-semibold ${isOut ? 'text-[#b00000]' : 'text-emerald-700'}`}>
                        {isOut ? 'Out of stock' : 'in stock'}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-4 py-1.5 text-xs font-black ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/admin/products/edit/${product._id}`}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4d5cf] text-[#6c5c58] transition hover:border-[#9a1515] hover:text-[#9a1515]" 
                          aria-label={`Edit ${product.name}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-[#e4d5cf] text-[#b00000] transition hover:border-[#b00000] hover:bg-red-50"
                          aria-label={`Delete ${product.name}`}
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

export default Products;
