/**
 * 输入框组件
 * 遵循统一开发标准的UI组件
 */

import React, { forwardRef } from 'react';
import type { InputProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

/**
 * 输入框组件
 * 用于文本输入的表单元素，支持标签、错误提示和验证状态
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  testId = 'input',
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const inputId = `input-${testId}`;
  const errorId = `error-${testId}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'block w-full px-3 py-2 border rounded-md shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'transition-colors duration-200',
          'placeholder-gray-400',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          disabled && 'bg-gray-50 cursor-not-allowed opacity-50',
          className
        )}
        data-testid={testId}
        {...props}
      />
      
      {error && (
        <p 
          id={errorId}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 