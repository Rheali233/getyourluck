/**
 * 页脚组件
 * 遵循统一开发标准的页脚组件
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { BaseComponentProps } from '../../types/componentTypes';
import { cn } from '../../utils/classNames';
import { scrollToTopImmediate } from '@/hooks/useScrollToTop';

export interface FooterProps extends BaseComponentProps {
  variant?: 'default' | 'simple';
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
  showSocialMedia = true,
  ...props
}) => {
  const year = new Date().getFullYear();
  const [showEmail, setShowEmail] = React.useState(false);

  // 处理Footer链接点击，确保滚动到顶部
  const handleLinkClick = () => {
    // 稍微延迟确保路由切换完成
    setTimeout(() => {
      scrollToTopImmediate('smooth');
    }, 100);
  };
  
  if (variant === 'simple') {
    return (
      <footer 
        className={cn("border-t py-6 bg-gray-50", className)}
        data-testid={testId}
        {...props}
      >
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {year} SelfAtlas. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  const footerLinks = {
    tests: {
      title: 'Test Services',
      links: [
        { name: 'Psychology Tests', href: '/tests/psychology' },
        { name: 'Astrology Fortune', href: '/tests/astrology' },
        { name: 'Tarot Reading', href: '/tests/tarot' },
        { name: 'Career Planning', href: '/tests/career' },
        { name: 'Learning Ability', href: '/tests/learning' },
        { name: 'Relationships', href: '/tests/relationship' },
      ],
    },
    resources: {
      title: 'Resources',
      links: [
        { name: 'Blog Articles', href: '/blog' },
        { name: 'Test Center', href: '/tests' },
      ],
    },
    company: {
      title: 'About Us',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Contact Us', href: 'contact_toggle' },
      ],
    },
  };

  const socialMedia = [
    { name: 'Email', icon: '📧', href: 'mailto:support@selfatlas.net', color: 'hover:text-blue-600' },
  ];
  
  return (
    <footer 
      className={cn("footer bg-gray-900 text-white", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主要内容区域 */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* 品牌信息 - 加宽 */}
            <div className="lg:col-span-3">
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/assets/logo.png" 
                  alt="SelfAtlas Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold">SelfAtlas</span>
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
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4">{footerLinks.tests.title}</h4>
              <ul className="space-y-2">
                {footerLinks.tests.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={handleLinkClick}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          {/* 资源中心（仅保留当前已实现的内容） */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4">{footerLinks.resources.title}</h4>
              <ul className="space-y-2">
                {footerLinks.resources.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={handleLinkClick}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 关于我们 */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4">{footerLinks.company.title}</h4>
              <ul className="space-y-2">
                {footerLinks.company.links.map((link) => (
                  <li key={link.name}>
                    {link.name === 'Contact Us' ? (
                      <button
                        type="button"
                        onClick={() => setShowEmail(!showEmail)}
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={handleLinkClick}
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              {showEmail && (
                <div className="mt-3 text-sm text-gray-300">
                  Email: <a className="underline hover:text-white" href="mailto:support@selfatlas.net">support@selfatlas.net</a>
                </div>
              )}
            </div>

            {/* 保留占位（未来可扩展 Legal） */}
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {year} SelfAtlas. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
