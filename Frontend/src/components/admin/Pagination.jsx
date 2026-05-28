import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between border-t border-[#efe3df] pt-6">
      <div className="text-sm font-medium text-[#6c5c58]">
        Showing page <span className="font-black text-[#171111]">{currentPage}</span> of <span className="font-black text-[#171111]">{totalPages}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#eadbd6] bg-white text-[#171111] transition hover:border-[#9a1515] hover:text-[#9a1515] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-10 min-w-[40px] px-3 rounded-xl border text-sm font-black transition ${
                currentPage === page
                  ? 'border-[#9a1515] bg-[#9a1515] text-white'
                  : 'border-[#eadbd6] bg-white text-[#171111] hover:border-[#9a1515]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#eadbd6] bg-white text-[#171111] transition hover:border-[#9a1515] hover:text-[#9a1515] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
