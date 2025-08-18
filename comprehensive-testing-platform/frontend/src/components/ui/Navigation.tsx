/**
 * 导航组件
 * 遵循统一开发标准的组件架构规范
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { useLanguage } from '@/contexts/LanguageContext';

export interface NavigationProps extends BaseComponentProps {
  showLanguageSwitch?: boolean;
  showThemeToggle?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  className,
  testId = 'navigation',
  showLanguageSwitch = true,
  showThemeToggle = false, // 默认不显示主题切换
  ...props
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

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
    setIsMenuOpen(false);
  };

  // 切换语言
  const toggleLanguage = () => {
    const newLang = language === 'zh-CN' ? 'en-US' : 'zh-CN';
    setLanguage(newLang);
  };

  // 测试中心点击处理
  const handleTestCenterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // 如果已经在首页，滚动到测试模块
      const testModulesSection = document.getElementById('test-modules-section');
      if (testModulesSection) {
        testModulesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // 如果不在首页，先导航到首页，然后滚动
      navigate('/', { state: { scrollTo: 'test-modules-section' } });
    }
    closeMobileMenu();
  };

  // 首页点击处理
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // 如果已经在首页，滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // 如果不在首页，导航到首页
      navigate('/');
    }
    closeMobileMenu();
  };

  // 导航菜单项（修改版）
  const navigationItems = [
    { name: t('nav.home'), href: '/', icon: '🏠', onClick: handleHomeClick },
    { name: t('nav.testCenter'), href: '#', icon: '🧪', onClick: handleTestCenterClick },
    { name: t('nav.blog'), href: '/blog', icon: '📝' },
    { name: t('nav.about'), href: '/about', icon: 'ℹ️' },
  ];

  // 语言显示文本
  const languageText = t('nav.language');

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent",
        className
      )}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-bold text-gray-900">getyourluck</span>
          </Link>

          {/* 桌面端导航 - 靠左对齐 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8 lg:flex-1 lg:justify-start lg:ml-8">
            {navigationItems.map((item) => {
              if (item.onClick) {
                // 如果有onClick，使用button
                return (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-0"
                  >
                    {item.name}
                  </button>
                );
              } else {
                // 否则使用Link
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-0",
                      location.pathname === item.href && "text-primary-600"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
          </div>

          {/* 桌面端操作按钮 - 只保留语言切换 */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {showLanguageSwitch && (
              <button 
                onClick={toggleLanguage}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-0"
              >
                {languageText}
              </button>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="切换菜单"
            data-testid="mobile-menu-button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <div
            className="lg:hidden py-4 border-t border-gray-200 bg-white"
            data-testid="mobile-menu"
          >
            <div className="space-y-2">
              {navigationItems.map((item) => {
                if (item.onClick) {
                  // 如果有onClick，使用button
                  return (
                    <button
                      key={item.name}
                      onClick={item.onClick}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 w-full text-left focus:outline-none focus:ring-0"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                } else {
                  // 否则使用Link
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-0",
                        location.pathname === item.href && "text-primary-600 bg-primary-50"
                      )}
                      onClick={closeMobileMenu}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                }
              })}
            </div>
            
            {/* 移动端操作按钮 - 只保留语言切换 */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              {showLanguageSwitch && (
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-0"
                >
                  {languageText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
