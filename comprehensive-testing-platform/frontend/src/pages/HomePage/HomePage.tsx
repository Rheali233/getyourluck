/**
 * 首页组件
 * 遵循统一开发标准的页面组件规范
 */

import React from 'react';
import { Homepage } from '@/modules/homepage';
import type { BaseComponentProps } from '@/types/componentTypes';

interface HomePageProps extends BaseComponentProps {}

/**
 * 首页页面组件
 * 使用首页模块的完整实现
 */
export const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Homepage
        className=""
        testId="homepage"
      />
    </div>
  );
};

export default HomePage;