/**
 * FAQ Component
 * 通用FAQ组件，样式参照How It Works
 */

import React, { useState } from 'react';
import { Card } from './Card';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { FAQItem } from '@/shared/configs/FAQ_CONFIG';

export interface FAQProps extends BaseComponentProps {
  title?: string;
  items: readonly FAQItem[];
  titleColor?: string;
}

export const FAQ: React.FC<FAQProps> = ({
  className,
  testId = 'faq',
  title = "Frequently Asked Questions",
  items,
  titleColor = "text-white",
  ...props
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className={cn("mb-8", className)} data-testid={testId} {...props}>
      <h2 className={cn("text-2xl font-bold mb-4", titleColor)}>{title}</h2>
      <Card className="bg-white p-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  {item.icon && (
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                </div>
                <svg
                  className={cn(
                    "w-5 h-5 text-gray-500 transition-transform duration-200",
                    openItems.has(item.id) ? "transform rotate-180" : ""
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openItems.has(item.id) && (
                <div className="mt-3 ml-8">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
