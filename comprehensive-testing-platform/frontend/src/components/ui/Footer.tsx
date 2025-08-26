/**
 * 页脚组件
 * 遵循统一开发标准的页脚组件
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { BaseComponentProps } from '../../types/componentTypes';
import { cn } from '../../utils/classNames';

export interface FooterProps extends BaseComponentProps {
  variant?: 'default' | 'simple';
  showNewsletter?: boolean;
  showSocialMedia?: boolean;
}

/**
 * 页脚组件
 * 用于显示网站页脚信息、链接和版权信息
 */
export const Footer: React.FC<FooterProps> = ({
  className,
  testId = 'footer',
  variant = 'default',
  showNewsletter = true,
  showSocialMedia = true,
  ...props
}) => {
  const year = new Date().getFullYear();
  
  if (variant === 'simple') {
    return (
      <footer 
        className={cn("border-t py-6 bg-gray-50", className)}
        data-testid={testId}
        {...props}
      >
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {year} getyourluck. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  const footerLinks = {
    tests: {
      title: 'Test Services',
      links: [
        { name: 'Psychology Tests', href: '/psychology' },
        { name: 'Astrology Fortune', href: '/astrology' },
        { name: 'Tarot Reading', href: '/tarot' },
        { name: 'Career Planning', href: '/career' },
        { name: 'Learning Ability', href: '/learning' },
        { name: 'Relationships', href: '/relationship' },
      ],
    },
    resources: {
      title: 'Resources',
      links: [
        { name: 'Blog Articles', href: '/blog' },
        { name: 'Test Guides', href: '/guides' },
        { name: 'FAQ', href: '/faq' },
        { name: 'User Feedback', href: '/feedback' },
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
      ],
    },
    company: {
      title: 'About Us',
      links: [
        { name: 'Company Info', href: '/about' },
        { name: 'Our Team', href: '/team' },
        { name: 'History', href: '/history' },
        { name: 'Media Coverage', href: '/media' },
        { name: 'Join Us', href: '/careers' },
        { name: 'Partners', href: '/partners' },
      ],
    },
    legal: {
      title: 'Legal Terms',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Disclaimer', href: '/disclaimer' },
        { name: 'Copyright Info', href: '/copyright' },
        { name: 'Complaints & Suggestions', href: '/complaints' },
      ],
    },
  };

  const socialMedia = [
    { name: 'WeChat', icon: '💬', href: '#', color: 'hover:text-green-600' },
    { name: 'Twitter', icon: '🐦', href: '#', color: 'hover:text-blue-600' },
    { name: 'Facebook', icon: '📘', href: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: '📷', href: '#', color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: '📺', href: '#', color: 'hover:text-red-600' },
  ];
  
  return (
    <footer 
      className={cn("footer bg-gray-900 text-white", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主要内容区域 */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* 品牌信息 */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🌟</span>
                <span className="text-xl font-bold">getyourluck</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Professional online testing platform providing psychological tests, astrological analysis, tarot reading and various testing services.
                Help you better understand yourself, discover potential, and plan for the future through scientific methods.
              </p>
              
              {showSocialMedia && (
                <div className="flex space-x-4">
                  {socialMedia.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className={cn(
                        "text-gray-400 hover:text-white transition-colors duration-200",
                        social.color
                      )}
                      aria-label={social.name}
                    >
                      <span className="text-xl">{social.icon}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* 测试服务 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{footerLinks.tests.title}</h4>
              <ul className="space-y-2">
                {footerLinks.tests.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 资源中心 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{footerLinks.resources.title}</h4>
              <ul className="space-y-2">
                {footerLinks.resources.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 关于我们 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{footerLinks.company.title}</h4>
              <ul className="space-y-2">
                {footerLinks.company.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 法律条款 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{footerLinks.legal.title}</h4>
              <ul className="space-y-2">
                {footerLinks.legal.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {year} getyourluck. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
