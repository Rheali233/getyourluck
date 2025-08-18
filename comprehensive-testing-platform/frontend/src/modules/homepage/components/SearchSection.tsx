/**
 * 搜索功能区组件
 * 提供智能搜索和测试推荐功能
 */

import React, { useState } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // 默认搜索建议
  const defaultSuggestions: SearchSuggestion[] = [
    { id: '1', text: '我是什么性格', type: 'keyword', icon: '🔍' },
    { id: '2', text: '今日运势', type: 'keyword', icon: '⭐' },
    { id: '3', text: '塔罗占卜', type: 'test', icon: '🎴' },
    { id: '4', text: '适合的职业', type: 'keyword', icon: '💼' },
    { id: '5', text: '心理测试', type: 'test', icon: '🧠' },
    { id: '6', text: '星座配对', type: 'test', icon: '❤️' },
    { id: '7', text: '爱情运势', type: 'keyword', icon: '💕' },
    { id: '8', text: '性格分析', type: 'keyword', icon: '📊' }
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
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🔍 {t('searchSection.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('searchSection.subtitle')}
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
                placeholder={t('searchSection.placeholder')}
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
                    {t('searchSection.searching')}
                  </div>
                ) : (
                  t('searchSection.search')
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 热门搜索关键词 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            {t('searchSection.popularSearches')}
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
            {t('searchSection.categories')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl mb-2">🧠</div>
              <h4 className="font-medium text-gray-900 mb-2">
                {t('searchSection.psychology')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('searchSection.psychologyDesc')}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <h4 className="font-medium text-gray-900 mb-2">
                {t('searchSection.astrology')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('searchSection.astrologyDesc')}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl mb-2">💼</div>
              <h4 className="font-medium text-gray-900 mb-2">
                {t('searchSection.career')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('searchSection.careerDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
