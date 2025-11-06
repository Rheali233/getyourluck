import React from 'react';
import { cn } from '@/utils/classNames';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getCdnBaseUrl } from '@/config/environment';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';

const formatPublishDate = (value?: string): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const isRecentlyPublished = (value?: string, days = 14): boolean => {
  if (!value) return false;
  const published = new Date(value).getTime();
  if (Number.isNaN(published)) return false;
  return Date.now() - published <= days * 24 * 60 * 60 * 1000;
};

const formatReadCount = (value?: number): string | undefined => {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  return `${compact} ${UI_TEXT.blog.common.reads}`;
};

const getReadTimeLabel = (readTime?: string, wordCount?: number): string | undefined => {
  if (readTime) return readTime;
  if (typeof wordCount === 'number' && wordCount > 0) {
    const minutes = Math.max(1, Math.round(wordCount / 200));
    return `${UI_TEXT.blog.card.estimatedRead} ~${minutes} ${UI_TEXT.blog.card.minutesUnit}`;
  }
  return undefined;
};

const processImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) {
    return `${getCdnBaseUrl()}${imageUrl}`;
  }
  return imageUrl;
};

/* eslint-disable no-unused-vars */
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
  wordCount?: number;
  isFeatured?: boolean;
  className?: string;
  ctaLabel?: string;
  onClick?(id: string): void;
  onReadMore?(id: string): void;
  onCategoryClick?(category: string): void;
  onTagClick?(tag: string): void;
}
/* eslint-enable no-unused-vars */

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  coverImage,
  category,
  readTime,
  publishDate,
  author,
  readCount,
  tags,
  wordCount,
  isFeatured,
  className,
  ctaLabel,
  onClick,
  onReadMore,
  onCategoryClick,
  onTagClick,
}) => {
  const formattedDate = React.useMemo(() => formatPublishDate(publishDate), [publishDate]);
  const readTimeLabel = React.useMemo(() => getReadTimeLabel(readTime, wordCount), [readTime, wordCount]);
  const readCountLabel = React.useMemo(() => formatReadCount(readCount), [readCount]);
  const tagList = React.useMemo(() => (Array.isArray(tags) ? tags.filter((tagValue): tagValue is string => Boolean(tagValue)) : []), [tags]);
  const badgeLabel = React.useMemo(() => {
    if (isFeatured) return UI_TEXT.blog.card.featured;
    if (isRecentlyPublished(publishDate)) return UI_TEXT.blog.card.newlyPublished;
    return undefined;
  }, [isFeatured, publishDate]);
  const cardCtaLabel = ctaLabel || UI_TEXT.blog.card.readMore;

  const handleCardClick = () => {
    onClick?.(id);
  };

  const handleReadMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onReadMore) {
      onReadMore(id);
      return;
    }
    onClick?.(id);
  };

  const handleCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (category) {
      onCategoryClick?.(category);
    }
  };

  const handleTagButtonClick = (event: React.MouseEvent<HTMLButtonElement>, tagValue: string) => {
    event.stopPropagation();
    onTagClick?.(tagValue);
  };

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg',
        className,
      )}
      onClick={handleCardClick}
      role="article"
      aria-label={title}
    >
      <div className="relative">
        <div className="aspect-video overflow-hidden bg-gray-100">
        {coverImage ? (
          <LazyLoadImage
            src={processImageUrl(coverImage)}
            alt={title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            effect="blur"
            placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
              onError={(event) => {
                const target = event.target as HTMLImageElement;
              if (target.dataset['retry']) {
                return;
              }
              target.dataset['retry'] = 'true';
              const fallbackUrl = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=200&q=80';
              if (target.src !== fallbackUrl) {
                target.src = fallbackUrl;
              }
            }}
          />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 text-sm text-primary-800">
              {UI_TEXT.blog.detail.titleFallback}
            </div>
          )}
        </div>
        {badgeLabel ? (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
            {badgeLabel}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-3 text-xs text-gray-500">
          {category ? (
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              onClick={handleCategoryClick}
            >
              {category}
            </button>
          ) : null}
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
            {formattedDate ? <span>{formattedDate}</span> : null}
            {readTimeLabel ? <span>{readTimeLabel}</span> : null}
          </div>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900 line-clamp-2">{title}</h3>
        {excerpt ? (
          <p className="mt-3 text-sm text-gray-600 line-clamp-3">{excerpt}</p>
        ) : null}
        {tagList.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tagList.slice(0, 3).map((tagValue) => (
              <button
                key={tagValue}
                type="button"
                className="inline-flex items-center rounded-full bg-gray-900/5 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                onClick={(event) => handleTagButtonClick(event, tagValue)}
              >
                #{tagValue}
              </button>
            ))}
            {tagList.length > 3 ? (
              <span className="text-xs text-gray-500">+{tagList.length - 3}</span>
            ) : null}
          </div>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex flex-col text-xs text-gray-500">
            {author ? <span>{author}</span> : null}
            {readCountLabel ? <span>{readCountLabel}</span> : null}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
            onClick={handleReadMoreClick}
          >
            {cardCtaLabel}
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;


