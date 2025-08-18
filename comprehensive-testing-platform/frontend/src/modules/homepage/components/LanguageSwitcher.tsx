/**
 * 语言切换组件
 * 支持中英文切换和用户偏好存储
 */

import React, { useState, useEffect, useRef } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import {
  changeLanguage,
  getCurrentLanguage,
  getLanguageDisplayName,
  getLanguageFlag,
  supportedLanguages,
} from '@/i18n';

export interface LanguageSwitcherProps extends BaseComponentProps {
  variant?: 'button' | 'dropdown' | 'inline';
  showFlag?: boolean;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  testId = 'language-switcher',
  variant = 'dropdown',
  showFlag = true,
  showName = true,
  size = 'md',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(getCurrentLanguage());
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 切换语言
  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLang) return;

    const success = await changeLanguage(languageCode);
    if (success) {
      setCurrentLang(languageCode);
      setIsOpen(false);
    }
  };

  // 按钮变体
  if (variant === 'button') {
    return (
      <div className="flex space-x-2" data-testid={testId} {...props}>
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200",
              currentLang === language.code
                ? "bg-primary-100 text-primary-700 border border-primary-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300",
              size === 'sm' && "px-2 py-1 text-sm",
              size === 'lg' && "px-4 py-3 text-lg"
            )}
          >
            {showFlag && <span className="text-lg">{language.flag}</span>}
            {showName && <span>{language.name}</span>}
          </button>
        ))}
      </div>
    );
  }

  // 内联变体
  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-1" data-testid={testId} {...props}>
        {supportedLanguages.map((language, index) => (
          <React.Fragment key={language.code}>
            <button
              onClick={() => handleLanguageChange(language.code)}
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded transition-colors duration-200",
                currentLang === language.code
                  ? "text-primary-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {showFlag && <span>{language.flag}</span>}
              {showName && <span className="text-sm">{language.name}</span>}
            </button>
            {index < supportedLanguages.length - 1 && (
              <span className="text-gray-300">|</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // 下拉框变体（默认）
  return (
    <div className="relative" ref={dropdownRef} data-testid={testId} {...props}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200",
          size === 'sm' && "px-2 py-1 text-sm",
          size === 'lg' && "px-4 py-3 text-lg"
        )}
        aria-label="切换语言"
      >
        {showFlag && <span className="text-lg">{getLanguageFlag(currentLang)}</span>}
        {showName && <span>{getLanguageDisplayName(currentLang)}</span>}
        <svg
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200",
                  currentLang === language.code && "bg-primary-50 text-primary-700"
                )}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {currentLang === language.code && (
                  <svg className="w-4 h-4 text-primary-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
