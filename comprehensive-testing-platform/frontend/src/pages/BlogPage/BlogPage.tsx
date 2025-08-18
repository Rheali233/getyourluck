/**
 * 博客页面路由组件
 * 遵循统一开发标准的页面组件规范
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { Card } from '@/components/ui';

interface BlogPageProps extends BaseComponentProps {}

export const BlogPage: React.FC<BlogPageProps> = ({
  className,
  testId = 'blog-page',
  ...props
}) => {
  return (
    <div 
      className={className}
      data-testid={testId}
      {...props}
    >
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/articles/:id" element={<BlogArticle />} />
      </Routes>
    </div>
  );
};

const BlogList: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">博客文章</h1>
          <p className="text-xl text-gray-600">探索心理学、占星学等相关知识</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card title="博客文章" description="博客文章列表将在后续任务中实现">
            <p className="text-center text-gray-500">
              博客文章列表将在后续任务中实现
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

const BlogArticle: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card title="博客文章详情" description="博客文章详情将在后续任务中实现">
          <p className="text-center text-gray-500">
            博客文章详情将在后续任务中实现
          </p>
        </Card>
      </div>
    </div>
  );
};