/**
 * Cookies横幅弹窗组件
 * 遵循统一开发标准的GDPR合规Cookies管理
 */

import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/config/environment';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface CookiesBannerProps extends BaseComponentProps {
  onConsentChange?: (consent: CookiesConsent) => void;
  showSettings?: boolean;
}

export interface CookiesConsent {
  cookiesConsent: boolean;
  analyticsConsent: boolean;
  marketingConsent: boolean;
}

export const CookiesBanner: React.FC<CookiesBannerProps> = ({
  className,
  testId = 'cookies-banner',
  onConsentChange,
  showSettings = true,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [consent, setConsent] = useState<CookiesConsent>({
    cookiesConsent: false,
    analyticsConsent: false,
    marketingConsent: false,
  });

  useEffect(() => {
    // 检查是否已经设置过Cookies同意
    const consentData = localStorage.getItem('cookiesConsent');
    if (!consentData) {
      setIsVisible(true);
      return;
    }

    try {
      const consent = JSON.parse(consentData);
      const consentTime = consent.timestamp;
      const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000); // 6个月前的时间戳
      
      // 如果同意时间超过6个月，重新显示弹窗
      if (!consentTime || consentTime < sixMonthsAgo) {
        localStorage.removeItem('cookiesConsent');
        setIsVisible(true);
      } else {
        // 设置当前同意状态
        setConsent({
          cookiesConsent: consent.cookiesConsent || false,
          analyticsConsent: consent.analyticsConsent || false,
          marketingConsent: consent.marketingConsent || false,
        });
      }
    } catch (error) {
      // 如果解析失败，清除无效数据并显示弹窗
      localStorage.removeItem('cookiesConsent');
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent = {
      cookiesConsent: true,
      analyticsConsent: true,
      marketingConsent: true,
    };
    setConsent(newConsent);
    saveConsent(newConsent);
    setIsVisible(false);
    onConsentChange?.(newConsent);
  };

  const handleRejectAll = () => {
    const newConsent = {
      cookiesConsent: false,
      analyticsConsent: false,
      marketingConsent: false,
    };
    setConsent(newConsent);
    saveConsent(newConsent);
    setIsVisible(false);
    onConsentChange?.(newConsent);
  };

  const handleSaveSettings = () => {
    saveConsent(consent);
    setIsVisible(false);
    setShowSettingsModal(false);
    onConsentChange?.(consent);
  };

  const saveConsent = (consentData: CookiesConsent) => {
    // 添加时间戳到同意数据中
    const consentWithTimestamp = {
      ...consentData,
      timestamp: Date.now(),
    };
    
    localStorage.setItem('cookiesConsent', JSON.stringify(consentWithTimestamp));
    
    // 发送到后端API
    const sessionId = crypto.randomUUID();
    fetch(`${getApiBaseUrl()}/api/cookies/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        ...consentWithTimestamp,
      }),
    }).catch(error => {
      // 静默处理API错误，不影响用户体验
    });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Cookies横幅 */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 p-4",
          className
        )}
        data-testid={testId}
        {...props}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🍪 We Use Cookies to Improve Your Experience
              </h3>
              <p className="text-sm text-gray-600">
                We use essential cookies to ensure our website functions properly, and analytics cookies to understand how you use our services.
                You can choose to accept all cookies or customize your preferences.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {showSettings && (
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Customize Settings
                </button>
              )}
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 设置弹窗 */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cookie Settings
              </h3>
              
              <div className="space-y-4">
                {/* 必要Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">Essential Cookies</h4>
                      <p className="text-sm text-gray-600">
                        These cookies are necessary for the website to function properly and cannot be disabled.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* 分析Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Help us understand how you use our website so we can improve our services.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={consent.analyticsConsent}
                        onChange={(e) => setConsent(prev => ({ ...prev, analyticsConsent: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* 营销Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600">
                        Used to display personalized content and advertisements to improve your experience.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={consent.marketingConsent}
                        onChange={(e) => setConsent(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
