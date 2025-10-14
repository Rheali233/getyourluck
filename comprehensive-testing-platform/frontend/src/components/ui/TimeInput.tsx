/**
 * Custom Time Input Component
 * 自定义时间输入组件，支持自动跳转到下一个输入单位
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/classNames';

export interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value: _value,
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
    if (_value) {
      const timeParts = _value.split(':');
      if (timeParts.length === 2) {
        setHour(timeParts[0] || '');
        setMinute(timeParts[1] || '');
      }
    }
  }, [_value]);

  // 更新父组件的值 - 只在完整输入时更新
  useEffect(() => {
    // 只有在小时和分钟都完整输入时才更新
    if (hour && minute && 
        ((hour.length === 2 && minute.length >= 2) || 
         (hour.length === 1 && minute.length >= 2))) {
      const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      onChange(formattedTime);
    }
  }, [hour, minute]); // 移除 onChange 依赖，避免无限循环

  // 处理小时输入
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // 只允许数字
    if (input.length <= 2) {
      const hourNum = parseInt(input);
      if (input.length === 0 || (hourNum >= 0 && hourNum <= 23)) {
        setHour(input);
        if (input.length === 2) {
          // 延迟跳转，确保状态更新完成
          setTimeout(() => {
            minuteRef.current?.focus();
          }, 0);
        }
      }
    }
  };

  // 处理分钟输入
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // 只允许数字
    if (input.length <= 2) {
      const minuteNum = parseInt(input);
      if (input.length === 0 || (minuteNum >= 0 && minuteNum <= 59)) {
        setMinute(input);
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
    <div className={cn("flex items-center space-x-2 w-full", className)} {...props}>
      {/* 小时输入 */}
      <input
        ref={hourRef}
        type="text"
        value={hour}
        onChange={handleHourChange}
        onKeyDown={(e) => handleKeyDown(e, hourRef, minuteRef)}
        placeholder={placeholder?.split(':')[0] || "HH"}
        maxLength={2}
        disabled={disabled}
        className={cn(
          "w-16 p-3 border border-gray-300 rounded-lg text-center bg-white text-gray-900 placeholder-gray-500",
          "focus:ring-2 focus:ring-[#5F0F40] focus:border-[#5F0F40]",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        required={required}
      />
      <span className="text-gray-500 font-medium">:</span>
      
      {/* 分钟输入 */}
      <input
        ref={minuteRef}
        type="text"
        value={minute}
        onChange={handleMinuteChange}
        onKeyDown={(e) => handleKeyDown(e, minuteRef)}
        placeholder={placeholder?.split(':')[1] || "MM"}
        maxLength={2}
        disabled={disabled}
        className={cn(
          "w-16 p-3 border border-gray-300 rounded-lg text-center bg-white text-gray-900 placeholder-gray-500",
          "focus:ring-2 focus:ring-[#5F0F40] focus:border-[#5F0F40]",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        required={required}
      />
    </div>
  );
};
