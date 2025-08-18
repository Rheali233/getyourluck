/**
 * 页脚组件
 * 包含导航链接、联系信息、社交媒体等
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface FooterProps extends BaseComponentProps {
  showNewsletter?: boolean;
  showSocialMedia?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  className,
  testId = 'footer',
  showNewsletter = true,
  showSocialMedia = true,
  ...props
}) => {
  const currentYear = new Date().getFullYear();

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
              
              {/* 联系信息 */}
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>contact@testplatform.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>400-123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>北京市朝阳区科技园区</span>
                </div>
              </div>
            </div>

            {/* 测试服务、了解更多、联系我们 - 靠右分组 */}
            <div className="lg:col-span-4 flex flex-col lg:flex-row lg:justify-end lg:space-x-12">
              {/* 测试服务链接 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{footerLinks.tests.title}</h3>
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

              {/* 关于我们链接 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{footerLinks.company.title}</h3>
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

              {/* 联系我们 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">联系我们</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      客服支持
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/feedback"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      意见反馈
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/help"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      帮助中心
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* 法律条款链接 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{footerLinks.legal.title}</h3>
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

        {/* 订阅区域 */}
        {showNewsletter && (
          <div className="py-8 border-t border-gray-800">
            <div className="max-w-md mx-auto text-center">
              <h3 className="text-lg font-semibold mb-2">订阅我们的最新资讯</h3>
              <p className="text-gray-300 text-sm mb-4">
                获取最新的测试资讯、心理学知识和平台动态
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="输入您的邮箱地址"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                  订阅
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 社交媒体 */}
        {showSocialMedia && (
          <div className="py-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <span className="text-gray-300 text-sm">关注我们：</span>
                <div className="flex space-x-4">
                  {socialMedia.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className={cn(
                        "text-gray-400 hover:text-white transition-colors duration-200",
                        social.color
                      )}
                      title={social.name}
                    >
                      <span className="text-lg">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>© {currentYear} getyourluck. 保留所有权利.</span>
                <span>ICP备案号：京ICP备12345678号</span>
              </div>
            </div>
          </div>
        )}

        {/* 底部版权信息 */}
        <div className="py-4 border-t border-gray-800 text-center">
          <div className="text-sm text-gray-400">
            <p>
              本平台提供的测试结果仅供参考，不构成专业建议。如有心理健康问题，请咨询专业心理咨询师。
            </p>
            <p className="mt-2">
              测试平台致力于为用户提供科学、专业、安全的在线测试服务。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
