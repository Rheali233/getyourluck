/**
 * 导航组件
 * 遵循统一开发标准的组件架构规范
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';


export interface NavigationProps extends BaseComponentProps {
}

export const Navigation: React.FC<NavigationProps> = ({
  className,
  testId = 'navigation',
  ...props
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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



  // 测试中心跳转
  const handleTestCenterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/tests');
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


  // Navigation menu items
  const navigationItems = [
    { name: 'Home', href: '/', icon: '🏠', onClick: handleHomeClick },
    { name: 'Test Center', href: '/tests', icon: '🧪', onClick: handleTestCenterClick },
    { name: 'Blog', href: '/blog', icon: '📝' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
  ];



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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <img 
              src="/assets/logo.png" 
              alt="SelfAtlas Logo" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">SelfAtlas</span>
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

          {/* Desktop action buttons */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* 右侧操作按钮区域 - 目前为空 */}
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
            
            {/* Mobile action buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              {/* 移动端操作按钮区域 - 目前为空 */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
