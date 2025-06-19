/* eslint-disable tailwindcss/no-custom-classname */
"use client"

import React, { useState, useEffect } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  visibleItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  visibleItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderPageNumbers = () => {
    if (isMobile && totalPages > 5) {
      // Mobile simplified view - show current page and total
      return (
        <div className="flex items-center">
          <span className="px-2 py-1 text-sm">
            {currentPage} / {totalPages}
          </span>
        </div>
      );
    }

    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage, endPage;
      
      if (currentPage <= Math.ceil(maxVisiblePages/2)) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages/2)) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxVisiblePages/2);
        endPage = currentPage + Math.floor(maxVisiblePages/2);
      }
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('ellipsis-start');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        if (i > 0 && i <= totalPages) pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('ellipsis-end');
        pages.push(totalPages);
      }
    }
    
    return pages.map((page, index) => {
      if (page === 'ellipsis-start' || page === 'ellipsis-end') {
        return (
          <span key={`ellipsis-${index}`} className="p-1 md:px-2">
            ...
          </span>
        );
      }
      
      return (
        <button
          key={page}
          onClick={() => onPageChange(page as number)}
          className={`h-8 min-w-8 rounded text-sm md:text-base ${
            currentPage === page
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
          aria-label={`Go to page ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="whitespace-nowrap text-sm text-gray-600">
        Showing {visibleItems} of {totalItems}
      </div>
      
      <div className="flex w-full flex-col items-center gap-3 sm:flex-row md:w-auto">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="text-sm text-gray-600 md:hidden">
            Page {currentPage} of {totalPages}
          </div>
          
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="max-w-[120px] rounded border px-2 py-1 text-sm text-gray-600"
            aria-label="Items per page"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full items-center justify-between gap-1 md:gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center rounded px-3 py-1 ${
              currentPage === 1 
                ? 'cursor-not-allowed bg-gray-600 opacity-50' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label="Previous page"
          >
            <span className="hidden md:inline">Previous</span>
            <span className="md:hidden">←</span>
          </button>
          
          <div className="scrollbar-hide flex gap-1 overflow-x-auto py-1">
            {renderPageNumbers()}
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center rounded px-3 py-1 ${
              currentPage === totalPages 
                ? 'cursor-not-allowed bg-gray-600 opacity-50' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label="Next page"
          >
            <span className="hidden md:inline">Next</span>
            <span className="md:hidden">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;