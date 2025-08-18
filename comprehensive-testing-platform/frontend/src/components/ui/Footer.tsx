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
          <p>© {year} getyourluck. 保留所有权利.</p>
        </div>
      </footer>
    );
  }

  const footerLinks = {
    tests: {
      title: '测试服务',
      links: [
        { name: '心理测试', href: '/tests/psychology' },
        { name: '星座运势', href: '/tests/astrology' },
        { name: '塔罗占卜', href: '/tests/tarot' },
        { name: '职业规划', href: '/tests/career' },
        { name: '学习能力', href: '/tests/learning' },
        { name: '情感关系', href: '/tests/relationship' },
      ],
    },
    resources: {
      title: '资源中心',
      links: [
        { name: '博客文章', href: '/blog' },
        { name: '测试指南', href: '/guides' },
        { name: '常见问题', href: '/faq' },
        { name: '用户反馈', href: '/feedback' },
        { name: '帮助中心', href: '/help' },
        { name: '联系我们', href: '/contact' },
      ],
    },
    company: {
      title: '关于我们',
      links: [
        { name: '公司介绍', href: '/about' },
        { name: '团队介绍', href: '/team' },
        { name: '发展历程', href: '/history' },
        { name: '媒体报道', href: '/media' },
        { name: '加入我们', href: '/careers' },
        { name: '合作伙伴', href: '/partners' },
      ],
    },
    legal: {
      title: '法律条款',
      links: [
        { name: '用户协议', href: '/terms' },
        { name: '隐私政策', href: '/privacy' },
        { name: 'Cookie政策', href: '/cookies' },
        { name: '免责声明', href: '/disclaimer' },
        { name: '版权信息', href: '/copyright' },
        { name: '投诉建议', href: '/complaints' },
      ],
    },
  };

  const socialMedia = [
    { name: '微信', icon: '💬', href: '#', color: 'hover:text-green-600' },
    { name: '微博', icon: '📱', href: '#', color: 'hover:text-red-600' },
    { name: '知乎', icon: '🧠', href: '#', color: 'hover:text-blue-600' },
    { name: '小红书', icon: '📖', href: '#', color: 'hover:text-pink-600' },
    { name: 'B站', icon: '📺', href: '#', color: 'hover:text-purple-600' },
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
                专业的在线测试平台，提供心理测试、占星分析、塔罗占卜等多种测试服务。
                通过科学的方法帮助您更好地了解自己，发现潜能，规划未来。
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
              © {year} getyourluck. 保留所有权利.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-white transition-colors duration-200">
                服务条款
              </Link>
              <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                隐私政策
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors duration-200">
                Cookie政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
