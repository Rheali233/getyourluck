/**
 * 响应式导航组件
 * 支持移动端菜单和触摸操作
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface ResponsiveNavigationProps extends BaseComponentProps {
  showThemeToggle?: boolean;
  // eslint-disable-next-line no-unused-vars
  onScrollToSection?: (sectionId: string) => void;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  className,
  testId = 'responsive-navigation',
  showThemeToggle = true,
  onScrollToSection,
  ...props
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭移动端菜单
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 处理滚动到指定区域
  const handleScrollToSection = (sectionId: string) => {
    closeMobileMenu();
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      // 默认滚动行为
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // 导航菜单项
  const navigationItems = [
    { name: '首页', href: '/', icon: '🏠' },
    { name: '测试中心', href: '/tests', icon: '🧪' },
            { name: '心理测试', href: '/psychology', icon: '🧠' },
    { name: '星座运势', href: '/astrology', icon: '⭐' },
    { name: '塔罗占卜', href: '/tarot', icon: '🔮' },
    { name: '职业规划', href: '/career', icon: '📊' },
    { name: '博客', href: '/blog', icon: '📝' },
    { name: '关于我们', href: '/about', icon: 'ℹ️' },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 shadow-lg" : "bg-transparent",
        className
      )}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-bold text-gray-900">SelfAtlas</span>
          </Link>

          {/* 桌面端导航 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium",
                  location.pathname === item.href && "text-primary-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 桌面端操作按钮 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* FAQ 按钮 */}
            <button
              onClick={() => handleScrollToSection('faq-section')}
              className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              FAQ
            </button>
            
            {/* Search 按钮 */}
            <button
              onClick={() => handleScrollToSection('search-section')}
              className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              Search
            </button>
            
            {showThemeToggle && (
              <button
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                <span className="text-lg">🌙</span>
              </button>
            )}
            <Link
              to="/tests"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
            >
              开始测试
            </Link>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            aria-label="切换菜单"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={cn(
                  "w-6 h-0.5 bg-current transition-all duration-300",
                  isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                )}
              />
              <span
                className={cn(
                  "w-6 h-0.5 bg-current transition-all duration-300",
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                )}
              />
              <span
                className={cn(
                  "w-6 h-0.5 bg-current transition-all duration-300",
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                )}
              />
            </div>
          </button>
        </div>

        {/* 移动端菜单 */}
        <div
          className={cn(
            "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-2 border-t border-gray-200">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200",
                  location.pathname === item.href
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            
            {/* 移动端操作按钮 */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {/* FAQ 按钮 */}
              <button
                onClick={() => handleScrollToSection('faq-section')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg">❓</span>
                <span>FAQ</span>
              </button>
              
              {/* Search 按钮 */}
              <button
                onClick={() => handleScrollToSection('search-section')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg">🔍</span>
                <span>Search</span>
              </button>
              
              {showThemeToggle && (
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <span className="text-lg">🌙</span>
                  <span>切换主题</span>
                </button>
              )}
              <Link
                to="/tests"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
              >
                开始测试
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
