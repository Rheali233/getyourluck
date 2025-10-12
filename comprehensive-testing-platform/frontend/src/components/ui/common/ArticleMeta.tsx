import React from 'react';
import { cn } from '@/utils/classNames';

export interface ArticleMetaProps {
  author?: string;
  publishDate?: string;
  readTime?: string;
  views?: number;
  className?: string;
}

export const ArticleMeta: React.FC<ArticleMetaProps> = ({
  author,
  publishDate,
  readTime,
  views,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap items-center gap-3 text-sm text-gray-500', className)}>
      {author ? (
        <span>
          {author}
        </span>
      ) : null}
      {publishDate ? <span aria-label="publish-date">{publishDate}</span> : null}
      {readTime ? <span aria-label="read-time">{readTime}</span> : null}
      {typeof views === 'number' ? <span aria-label="views">{views.toLocaleString()} views</span> : null}
    </div>
  );
};

export default ArticleMeta;


