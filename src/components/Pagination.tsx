import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
      {/* Info */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          Mostrando <span className="font-semibold text-gray-700">{startItem}</span>-<span className="font-semibold text-gray-700">{endItem}</span> de{' '}
          <span className="font-semibold text-gray-700">{totalItems}</span> resultados
        </span>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Exibir:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
          title="Primeira página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, i) =>
          typeof p === 'string' ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                p === currentPage
                  ? 'text-white shadow-md shadow-violet-500/25'
                  : 'border border-gray-200 text-gray-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600'
              }`}
              style={p === currentPage ? { background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' } : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
          title="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
          title="Última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
