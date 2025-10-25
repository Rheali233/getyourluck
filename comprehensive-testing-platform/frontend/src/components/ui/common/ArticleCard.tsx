import React from 'react';
import { cn } from '@/utils/classNames';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getCdnBaseUrl } from '@/config/environment';

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
  // 🔥 修复：处理图片URL，为相对路径添加CDN前缀
  const processImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl; // 外部链接直接返回
    if (imageUrl.startsWith('/')) {
      return `${getCdnBaseUrl()}${imageUrl}`;
    }
    return imageUrl;
  };
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
          <LazyLoadImage
            src={processImageUrl(coverImage)}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            effect="blur"
            placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // 🔥 修复：错误时先尝试原始路径，再使用fallback
              if (!target.src.includes('unsplash.com')) {
                target.src = coverImage.startsWith('/') 
                  ? `${window.location.origin}${coverImage}`
                  : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=200&q=80';
              } else {
                target.src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=200&q=80';
              }
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


