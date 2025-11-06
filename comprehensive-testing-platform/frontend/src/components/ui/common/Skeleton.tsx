import React from 'react';
import { cn } from '@/utils/classNames';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn('animate-pulse bg-gray-200 rounded-md', className)} />
);

export const ArticleCardSkeleton: React.FC = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-sm">
    <Skeleton className="aspect-video w-full" />
    <div className="flex flex-1 flex-col p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-24" />
      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

export default Skeleton;


