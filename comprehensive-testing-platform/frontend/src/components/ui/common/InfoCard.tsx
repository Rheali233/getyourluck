/**
 * 通用信息展示卡片组件
 * 适用于所有测试类型的信息展示
 * 
 * @example
 * // 心理学测试使用
 * <InfoCard icon="🧠" title="Brain Type" value="INTJ" theme="psychology" />
 * 
 * // 职业测试使用
 * <InfoCard icon="💼" title="Career Interest" value="Investigative" theme="career" />
 * 
 * @param icon - 图标
 * @param title - 标题
 * @param value - 值
 * @param theme - 主题
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface InfoCardProps extends BaseComponentProps {
  icon: string;
  title: string;
  value: string | number;
  theme?: string;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  value,
  theme = 'psychology',
  className,
  testId = 'info-card',
  ...props
}) => {
  return (
    <div 
      className={cn(
        "flex items-center p-4 bg-white border border-gray-200 rounded-lg",
        className
      )}
      data-testid={testId}
      {...props}
    >
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-700">{value}</p>
      </div>
    </div>
  );
};
