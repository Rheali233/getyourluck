import React from 'react';
import { cn } from '@/utils/classNames';

export interface ArticleCardProps {
  id: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  readTime?: string;
  publishDate?: string;
  author?: string;
  readCount?: number;
  tags?: string[];
  className?: string;
  onClick?: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  coverImage,
  category,
  readTime,
  author,
  readCount,
  className,
  onClick,
}) => {
  return (
    <article
      className={cn(
        'flex-shrink-0 bg-white rounded-xl overflow-hidden hover:transition-shadow duration-300 cursor-pointer',
        className,
      )}
      onClick={() => onClick?.(id)}
      role="article"
      aria-label={title}
    >
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {category ? (
            <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
              {category}
            </span>
          ) : null}
          {readTime ? <span className="text-xs text-gray-500">{readTime}</span> : null}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        {excerpt ? (
          <p className="text-gray-600 mb-3 text-sm line-clamp-3">{excerpt}</p>
        ) : null}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{author}</span>
          {typeof readCount === 'number' ? <span>{readCount.toLocaleString()} reads</span> : <span />}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;


