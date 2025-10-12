import React from 'react';
import { cn } from '@/utils/classNames';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  makeHref: (page: number) => string;
  onNavigate?: (page: number) => void;
  className?: string;
}

// 简单分页组件：可点击页码 + 上一页/下一页
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  makeHref,
  onNavigate,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  const handleClick = (page: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page);
    }
  };

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)} aria-label="Pagination">
      <a
        href={makeHref(Math.max(1, currentPage - 1))}
        onClick={(e) => handleClick(Math.max(1, currentPage - 1), e)}
        className={cn(
          'px-3 py-2 rounded-lg border',
          currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
        )}
        aria-disabled={currentPage === 1}
      >
        Prev
      </a>
      {start > 1 && (
        <>
          <a href={makeHref(1)} onClick={(e) => handleClick(1, e)} className="px-3 py-2 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50">1</a>
          {start > 2 && <span className="px-2 text-gray-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <a
          key={p}
          href={makeHref(p)}
          onClick={(e) => handleClick(p, e)}
          className={cn(
            'px-3 py-2 rounded-lg border',
            p === currentPage ? 'bg-primary-600 text-white border-primary-600' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          )}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </a>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-gray-400">…</span>}
          <a href={makeHref(totalPages)} onClick={(e) => handleClick(totalPages, e)} className="px-3 py-2 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50">{totalPages}</a>
        </>
      )}
      <a
        href={makeHref(Math.min(totalPages, currentPage + 1))}
        onClick={(e) => handleClick(Math.min(totalPages, currentPage + 1), e)}
        className={cn(
          'px-3 py-2 rounded-lg border',
          currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
        )}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </a>
    </nav>
  );
};

export default Pagination;


