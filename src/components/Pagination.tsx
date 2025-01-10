import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'p-2 rounded-xl',
          'transition-all duration-200',
          'hover:bg-primary/10 disabled:hover:bg-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-primary/50'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span
              key={`dots-${index}`}
              className="px-4 py-2 text-white/50"
            >
              {page}
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(Number(page))}
              className={cn(
                'min-w-[40px] h-10 px-4',
                'rounded-xl font-medium',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                currentPage === page
                  ? 'bg-gradient-to-r from-primary to-purple-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-primary/10'
              )}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'p-2 rounded-xl',
          'transition-all duration-200',
          'hover:bg-primary/10 disabled:hover:bg-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-primary/50'
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}