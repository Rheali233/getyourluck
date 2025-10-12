/**
 * Numerology Time Input Component
 * 命理模块专用时间输入组件，使用红色主题
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/classNames';

export interface NumerologyTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const NumerologyTimeInput: React.FC<NumerologyTimeInputProps> = ({
  value,
  onChange,
  className,
  placeholder = 'HH:MM',
  required = false,
  disabled = false,
  ...props
}) => {
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');
  
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  // 解析初始值
  useEffect(() => {
    if (value) {
      const timeParts = value.split(':');
      if (timeParts.length === 2) {
        setHour(timeParts[0] || '');
        setMinute(timeParts[1] || '');
      }
    }
  }, [value]);

  // 更新父组件的值 - 只在完整输入时更新
  useEffect(() => {
    if (hour && minute && hour.length >= 2 && minute.length >= 2) {
      const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      onChange(formattedTime);
    }
  }, [hour, minute]);

  // 处理小时输入
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // 只允许数字
    if (input.length <= 2) {
      // 允许输入"0"作为前导零，或者完整的小时数字
      if (input.length === 0 || 
          input === '0' || 
          input.startsWith('0') || 
          (parseInt(input) >= 0 && parseInt(input) <= 23)) {
        setHour(input); // 保持原始输入，包括前导零
        if (input.length === 2) {
          minuteRef.current?.focus();
        }
      }
    }
  };

  // 处理分钟输入
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // 只允许数字
    if (input.length <= 2) {
      // 允许输入"0"作为前导零，或者完整的分钟数字
      if (input.length === 0 || 
          input === '0' || 
          input.startsWith('0') || 
          (parseInt(input) >= 0 && parseInt(input) <= 59)) {
        setMinute(input); // 保持原始输入，包括前导零
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentRef: React.RefObject<HTMLInputElement>, nextRef?: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Backspace' && currentRef.current?.value === '') {
      // 如果当前字段为空且按退格键，跳转到上一个字段
      if (currentRef === minuteRef && hourRef.current) {
        hourRef.current.focus();
      }
    } else if (e.key === 'ArrowLeft' && currentRef.current?.selectionStart === 0) {
      // 左箭头键跳转到上一个字段
      if (currentRef === minuteRef && hourRef.current) {
        hourRef.current.focus();
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
      {/* 小时输入 */}
      <input
        ref={hourRef}
        type="text"
        value={hour}
        onChange={handleHourChange}
        onKeyDown={(e) => handleKeyDown(e, hourRef, minuteRef)}
        placeholder="HH"
        maxLength={2}
        disabled={disabled}
        className={cn(
          "w-16 p-3 border border-red-200 rounded-lg text-center bg-white text-red-900 placeholder-red-700",
          "focus:ring-2 focus:ring-red-500 focus:border-red-500",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        required={required}
      />
      <span className="text-red-600 font-medium">:</span>
      
      {/* 分钟输入 */}
      <input
        ref={minuteRef}
        type="text"
        value={minute}
        onChange={handleMinuteChange}
        onKeyDown={(e) => handleKeyDown(e, minuteRef)}
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
    </div>
  );
};
