/**
 * Question Options Component
 * Unified component for rendering test question options
 */

import React from 'react';
import { cn } from '@/utils/classNames';

export interface QuestionOption {
  id: string;
  text: string;
  value: number;
  description?: string;
}

export interface QuestionOptionsProps {
  options: QuestionOption[];
  selectedAnswer: number | null;
  onSelect: (answer: number) => void;
  theme?: 'blue' | 'pink' | 'purple' | 'green' | 'orange';
  className?: string;
}

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  options,
  selectedAnswer,
  onSelect,
  theme = 'blue',
  className
}) => {
  // Theme color mapping
  const themeColors = {
    blue: {
      selected: 'bg-blue-50 text-blue-900',
      ring: 'ring-blue-500',
      hover: 'hover:border-blue-300 hover:bg-blue-100',
      checkmark: 'text-blue-600'
    },
    pink: {
      selected: 'bg-pink-50 text-pink-900',
      ring: 'ring-pink-500',
      hover: 'hover:border-pink-300 hover:bg-pink-100',
      checkmark: 'text-pink-600'
    },
    purple: {
      selected: 'bg-purple-50 text-purple-900',
      ring: 'ring-purple-500',
      hover: 'hover:border-purple-300 hover:bg-purple-100',
      checkmark: 'text-purple-600'
    },
    green: {
      selected: 'bg-green-50 text-green-900',
      ring: 'ring-green-500',
      hover: 'hover:border-green-300 hover:bg-green-100',
      checkmark: 'text-green-600'
    },
    orange: {
      selected: 'bg-orange-50 text-orange-900',
      ring: 'ring-orange-500',
      hover: 'hover:border-orange-300 hover:bg-orange-100',
      checkmark: 'text-orange-600'
    }
  };

  const colors = themeColors[theme];

  return (
    <div className={cn("mb-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.value)}
            className={cn(
              "w-full h-20 text-left rounded-lg transition-all duration-200",
              "flex items-center justify-between",
              selectedAnswer === option.value
                ? `${colors.selected} p-3 border border-transparent ring-1 ring-inset ${colors.ring} outline-none focus:outline-none focus-visible:outline-none`
                : `border border-gray-200 bg-white text-gray-700 p-3 ${colors.hover}`
            )}
          >
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">{option.text}</div>
              {option.description && (
                <div className="text-xs text-gray-600 leading-relaxed">{option.description}</div>
              )}
            </div>
            {selectedAnswer === option.value && (
              <div className="ml-3">
                <span className={cn("text-lg", colors.checkmark)}>✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionOptions;
