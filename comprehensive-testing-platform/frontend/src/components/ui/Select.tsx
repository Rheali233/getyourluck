/**
 * 选择组件
 * 遵循统一开发标准的UI组件
 */

import { forwardRef } from 'react';
import type { SelectProps } from '../../types/componentTypes';
import { cn } from '../../utils/classNames';

/**
 * 选择组件
 * 用于下拉选择的表单元素，支持标签、错误提示和验证状态
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  testId = 'select',
  label,
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const selectId = `select-${testId}`;
  const errorId = `error-${testId}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'block w-full px-3 py-2 border rounded-md shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'transition-colors duration-200',
          'bg-white',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          disabled && 'bg-gray-50 cursor-not-allowed opacity-50',
          className
        )}
        data-testid={testId}
        {...props}
      >
        <option value="">请选择...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
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

Select.displayName = 'Select';

export default Select; 