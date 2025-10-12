/**
 * Custom Location Input Component
 * 自定义地点输入组件，提供常见城市建议
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/classNames';

export interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

// 常见城市建议
const COMMON_CITIES = [
  'New York, NY, USA',
  'Los Angeles, CA, USA',
  'Chicago, IL, USA',
  'Houston, TX, USA',
  'Phoenix, AZ, USA',
  'Philadelphia, PA, USA',
  'San Antonio, TX, USA',
  'San Diego, CA, USA',
  'Dallas, TX, USA',
  'San Jose, CA, USA',
  'London, England, UK',
  'Paris, France',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Toronto, ON, Canada',
  'Vancouver, BC, Canada',
  'Berlin, Germany',
  'Madrid, Spain',
  'Rome, Italy',
  'Amsterdam, Netherlands',
  'Beijing, China',
  'Shanghai, China',
  'Hong Kong, China',
  'Singapore',
  'Dubai, UAE',
  'Mumbai, India',
  'Delhi, India',
  'São Paulo, Brazil',
  'Mexico City, Mexico',
  'Buenos Aires, Argentina'
];

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  className,
  placeholder = 'e.g., New York, NY, USA',
  required = false,
  disabled = false,
  ...props
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 过滤城市建议
  useEffect(() => {
    if (value && value.length > 1) {
      const filtered = COMMON_CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 8)); // 限制显示8个建议
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredCities([]);
    }
  }, [value]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // 处理建议选择
  const handleSuggestionClick = (city: string) => {
    onChange(city);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'Enter' && filteredCities.length > 0) {
      e.preventDefault();
      handleSuggestionClick(filteredCities[0]!);
    }
  };

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative w-full max-w-xs", className)} {...props}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (filteredCities.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500",
          "focus:ring-2 focus:ring-[#5F0F40] focus:border-[#5F0F40]",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        required={required}
      />
      
      {/* 建议列表 */}
      {showSuggestions && filteredCities.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredCities.map((city, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(city)}
              className="px-4 py-2 hover:bg-violet-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
