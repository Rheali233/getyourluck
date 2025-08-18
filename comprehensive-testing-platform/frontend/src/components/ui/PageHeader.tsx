/**
 * 页面头部组件
 * 遵循统一开发标准的UI组件
 */

import React from 'react';
import type { PageHeaderProps } from '../../types/componentTypes';
import { cn } from '../../utils/classNames';
import { Button } from './Button';

/**
 * 页面头部组件
 * 用于显示页面主要标题、描述和操作按钮
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  className,
  testId = 'page-header',
  title,
  description,
  icon,
  theme = 'primary',
  onStart,
  ...props
}) => {
  // 主题样式映射
  const themeStyles = {
    primary: 'bg-primary-50 text-primary-800',
    secondary: 'bg-secondary-50 text-secondary-800',
    constellation: 'bg-constellation-50 text-constellation-800',
    psychology: 'bg-psychology-50 text-psychology-800',
    tarot: 'bg-tarot-50 text-tarot-800',
    mbti: 'bg-mbti-50 text-mbti-800',
    career: 'bg-career-50 text-career-800',
  };

  // 图标颜色映射
  const iconColors = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    constellation: 'text-constellation-500',
    psychology: 'text-psychology-500',
    tarot: 'text-tarot-500',
    mbti: 'text-mbti-500',
    career: 'text-career-500',
  };

  return (
    <div
      className={cn(
        "page-header",
        themeStyles[theme],
        "flex flex-col items-center text-center py-12 px-8 rounded-lg mb-8",
        className
      )}
      data-testid={testId}
      {...props}
    >
      {icon && (
        <div className="page-header__icon mb-6">
          <span className={cn("text-5xl", iconColors[theme])}>
            <i className={`fas fa-${icon}`} />
          </span>
        </div>
      )}

      <h1 className="page-header__title text-3xl font-bold mb-4">
        {title}
      </h1>

      {description && (
        <p className="page-header__description text-lg max-w-2xl mx-auto mb-8 opacity-75">
          {description}
        </p>
      )}

      {onStart && (
        <Button
          variant={theme === 'primary' ? 'primary' : theme === 'secondary' ? 'secondary' : 'primary'}
          size="large"
          onClick={onStart}
          testId="start-test-button"
        >
          开始测试
        </Button>
      )}
    </div>
  );
};

export default PageHeader; 