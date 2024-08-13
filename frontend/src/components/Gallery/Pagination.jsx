import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center gap-2">
    <button 
      onClick={() => onPageChange(currentPage - 1)} 
      disabled={currentPage === 1}
      className="px-3 py-1 text-gray-600 disabled:opacity-50"
    >
      &lt;
    </button>
    {[...Array(totalPages).keys()].map((page) => (
      <button
        key={page + 1}
        className={`w-8 h-8 rounded-full ${currentPage === page + 1 ? 'bg-black text-white' : 'bg-gray-200'}`}
        onClick={() => onPageChange(page + 1)}
      >
        {page + 1}
      </button>
    ))}
    <button 
      onClick={() => onPageChange(currentPage + 1)} 
      disabled={currentPage === totalPages}
      className="px-3 py-1 text-gray-600 disabled:opacity-50"
    >
      &gt;
    </button>
  </div>
);

export default Pagination;
