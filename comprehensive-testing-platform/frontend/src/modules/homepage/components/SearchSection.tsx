/**
 * 搜索功能区组件
 * 提供智能搜索和测试推荐功能
 */

import React, { useState } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';


export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'test' | 'article' | 'keyword';
  icon: string;
}

export interface SearchSectionProps extends BaseComponentProps {
  onSearch?: (query: string) => void;
  suggestions?: SearchSuggestion[];
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  className,
  testId = 'search-section',
  onSearch,
  suggestions = [],
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Default search suggestions
  const defaultSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'What is my personality', type: 'keyword', icon: '🔍' },
    { id: '2', text: 'Today\'s fortune', type: 'keyword', icon: '⭐' },
    { id: '3', text: 'Tarot reading', type: 'test', icon: '🎴' },
    { id: '4', text: 'Suitable career', type: 'keyword', icon: '💼' },
    { id: '5', text: 'Psychological test', type: 'test', icon: '🧠' },
    { id: '6', text: 'Zodiac compatibility', type: 'test', icon: '❤️' },
    { id: '7', text: 'Love fortune', type: 'keyword', icon: '💕' },
    { id: '8', text: 'Personality analysis', type: 'keyword', icon: '📊' }
  ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
      // 模拟搜索延迟
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    if (onSearch) {
      onSearch(suggestion.text);
    }
  };

  return (
    <section
      className={cn("search-section py-16 bg-white", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🔍 Find What You Need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for tests, articles, and insights that match your interests
          </p>
        </div>

        {/* 搜索框 */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tests, articles, or insights..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none"
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className={cn(
                  "absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-0",
                  isSearching || !searchQuery.trim() 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-primary-700 hover:shadow-lg"
                )}
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 热门搜索关键词 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Popular Searches
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {displaySuggestions.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-0",
                  suggestion.type === 'test'
                    ? "bg-primary-100 text-primary-700 hover:bg-primary-200"
                    : suggestion.type === 'article'
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <span>{suggestion.icon}</span>
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>

        {/* 搜索分类说明 */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Search Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl mb-2">🧠</div>
              <h4 className="font-medium text-gray-900 mb-2">
                Psychology
              </h4>
              <p className="text-sm text-gray-600">
                Personality tests, mental health assessments, and emotional intelligence tests
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <h4 className="font-medium text-gray-900 mb-2">
                Astrology
              </h4>
              <p className="text-sm text-gray-600">
                Daily horoscopes, zodiac compatibility, and fortune predictions
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl mb-2">💼</div>
              <h4 className="font-medium text-gray-900 mb-2">
                Career
              </h4>
              <p className="text-sm text-gray-600">
                Career planning, job matching, and professional development tests
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
