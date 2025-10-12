/**
 * 通用说明列表组件
 * 适用于所有测试类型的说明展示
 * 
 * @example
 * // 心理学测试使用
 * <InstructionList 
 *   title="Answering Suggestions" 
 *   items={['Answer honestly', 'Choose quiet environment']} 
 *   icon="✓" 
 *   color="green" 
 * />
 * 
 * // 职业测试使用
 * <InstructionList 
 *   title="Career Tips" 
 *   items={['Consider interests', 'Think long-term']} 
 *   icon="💡" 
 *   color="blue" 
 * />
 * 
 * @param title - 标题
 * @param items - 说明项列表
 * @param icon - 图标
 * @param color - 颜色主题
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface InstructionListProps extends BaseComponentProps {
  title: string;
  items: string[];
  icon: string;
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
  className?: string;
}

export const InstructionList: React.FC<InstructionListProps> = ({
  title,
  items,
  icon,
  color = 'green',
  className,
  testId = 'instruction-list',
  ...props
}) => {
  const colorClasses = {
    green: 'text-green-500',
    blue: 'text-blue-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500'
  };

  return (
    <div 
      className={cn("", className)}
      data-testid={testId}
      {...props}
    >
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-700">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className={cn("mr-2", colorClasses[color])}>{icon}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
