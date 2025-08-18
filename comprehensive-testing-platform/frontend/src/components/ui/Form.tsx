/**
 * 表单组件
 * 遵循统一开发标准的UI组件
 */

import React from 'react';
import type { FormProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

/**
 * 表单组件
 * 用于包装表单元素，提供统一的表单样式和行为
 */
export const Form: React.FC<FormProps> = ({
  className,
  testId = 'form',
  onSubmit,
  children,
  ...props
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
      data-testid={testId}
      noValidate
      {...props}
    >
      {children}
    </form>
  );
};

export default Form; 