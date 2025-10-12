/**
 * Numerology Date Input Component
 * 命理模块专用日期输入组件，使用红色主题
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/classNames';

export interface NumerologyDateInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const NumerologyDateInput: React.FC<NumerologyDateInputProps> = ({
  value,
  onChange,
  className,
  placeholder = 'YYYY-MM-DD',
  required = false,
  disabled = false,
  ...props
}) => {
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  // 解析初始值
  useEffect(() => {
    if (value) {
      const dateParts = value.split('-');
      if (dateParts.length === 3) {
        setYear(dateParts[0] || '');
        setMonth(dateParts[1] || '');
        setDay(dateParts[2] || '');
      }
    }
  }, [value]);

  // 更新父组件的值 - 只在完整输入时更新
  useEffect(() => {
    if (year && month && day && year.length >= 4 && month.length >= 2 && day.length >= 2) {
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      onChange(formattedDate);
    }
  }, [year, month, day]);

  // 处理年份输入
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // 只允许数字
    if (input.length <= 4) {
      setYear(input);
      if (input.length === 4) {
        monthRef.current?.focus();
      }
    }
  };

  // 处理月份输入
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // 只允许数字
    if (input.length <= 2) {
      // 允许输入"0"作为前导零，或者完整的月份数字
      if (input.length === 0 || 
          input === '0' || 
          input.startsWith('0') || 
          (parseInt(input) >= 1 && parseInt(input) <= 12)) {
        setMonth(input); // 保持原始输入，包括前导零
        if (input.length === 2) {
          dayRef.current?.focus();
        }
      }
    }
  };

  // 处理日期输入
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // 只允许数字
    if (input.length <= 2) {
      const maxDay = month ? new Date(parseInt(year) || 2000, parseInt(month), 0).getDate() : 31;
      // 允许输入"0"作为前导零，或者完整的日期数字
      if (input.length === 0 || 
          input === '0' || 
          input.startsWith('0') || 
          (parseInt(input) >= 1 && parseInt(input) <= maxDay)) {
        setDay(input); // 保持原始输入，包括前导零
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentRef: React.RefObject<HTMLInputElement>, nextRef?: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Backspace' && currentRef.current?.value === '') {
      // 如果当前字段为空且按退格键，跳转到上一个字段
      if (currentRef === monthRef && yearRef.current) {
        yearRef.current.focus();
      } else if (currentRef === dayRef && monthRef.current) {
        monthRef.current.focus();
      }
    } else if (e.key === 'ArrowLeft' && currentRef.current?.selectionStart === 0) {
      // 左箭头键跳转到上一个字段
      if (currentRef === monthRef && yearRef.current) {
        yearRef.current.focus();
      } else if (currentRef === dayRef && monthRef.current) {
        monthRef.current.focus();
      }
    } else if (e.key === 'ArrowRight' && currentRef.current?.selectionStart === currentRef.current?.value.length) {
      // 右箭头键跳转到下一个字段
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  return (
    <div className={cn("flex items-center space-x-2 w-full max-w-xs", className)} {...props}>
      {/* 年份输入 */}
      <input
        ref={yearRef}
        type="text"
        value={year}
        onChange={handleYearChange}
        onKeyDown={(e) => handleKeyDown(e, yearRef, monthRef)}
        placeholder="YYYY"
        maxLength={4}
        disabled={disabled}
        className={cn(
          "w-20 p-3 border border-red-200 rounded-lg text-center bg-white text-red-900 placeholder-red-700",
          "focus:ring-2 focus:ring-red-500 focus:border-red-500",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        required={required}
      />
      <span className="text-red-600 font-medium">-</span>
      
      {/* 月份输入 */}
      <input
        ref={monthRef}
        type="text"
        value={month}
        onChange={handleMonthChange}
        onKeyDown={(e) => handleKeyDown(e, monthRef, dayRef)}
        placeholder="MM"
        maxLength={2}
        disabled={disabled}
        className={cn(
          "w-16 p-3 border border-red-200 rounded-lg text-center bg-white text-red-900 placeholder-red-700",
          "focus:ring-2 focus:ring-red-500 focus:border-red-500",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        required={required}
      />
      <span className="text-red-600 font-medium">-</span>
      
      {/* 日期输入 */}
      <input
        ref={dayRef}
        type="text"
        value={day}
        onChange={handleDayChange}
        onKeyDown={(e) => handleKeyDown(e, dayRef)}
        placeholder="DD"
        maxLength={2}
        disabled={disabled}
        className={cn(
          "w-16 p-3 border border-red-200 rounded-lg text-center bg-white text-red-900 placeholder-red-700",
          "focus:ring-2 focus:ring-red-500 focus:border-red-500",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        required={required}
      />
    </div>
  );
};
