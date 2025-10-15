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
    const hasConsent = localStorage.getItem('cookiesConsent');
    if (!hasConsent) {
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
    localStorage.setItem('cookiesConsent', JSON.stringify(consentData));
    
    // 发送到后端API
    const sessionId = crypto.randomUUID();
    fetch(`${getApiBaseUrl()}/api/cookies/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        ...consentData,
      }),
    }).catch(error => {
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
                🍪 我们使用Cookies来改善您的体验
              </h3>
              <p className="text-sm text-gray-600">
                我们使用必要的Cookies来确保网站正常运行，以及分析Cookies来了解您如何使用我们的服务。
                您可以选择接受所有Cookies或自定义您的偏好设置。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {showSettings && (
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  自定义设置
                </button>
              )}
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                拒绝所有
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
              >
                接受所有
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
                Cookies设置
              </h3>
              
              <div className="space-y-4">
                {/* 必要Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">必要Cookies</h4>
                      <p className="text-sm text-gray-600">
                        这些Cookies对于网站正常运行是必需的，无法禁用。
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
                      <h4 className="font-medium text-gray-900">分析Cookies</h4>
                      <p className="text-sm text-gray-600">
                        帮助我们了解您如何使用网站，以便我们改进服务。
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
                      <h4 className="font-medium text-gray-900">营销Cookies</h4>
                      <p className="text-sm text-gray-600">
                        用于显示个性化内容和广告，改善您的体验。
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
                  取消
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
                >
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
