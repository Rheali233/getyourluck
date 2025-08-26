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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Articles</h1>
          <p className="text-xl text-gray-600">Explore psychology, astrology and related knowledge</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card title="Blog Articles" description="Blog article list will be implemented in future tasks">
            <p className="text-center text-gray-500">
              Blog article list will be implemented in future tasks
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
        <Card title="Blog Article Details" description="Blog article details will be implemented in future tasks">
          <p className="text-center text-gray-500">
            Blog article details will be implemented in future tasks
          </p>
        </Card>
      </div>
    </div>
  );
};