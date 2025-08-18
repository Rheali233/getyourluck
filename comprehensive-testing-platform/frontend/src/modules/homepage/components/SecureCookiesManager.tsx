import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, EyeOff, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import type { BaseComponentProps } from '@/types/componentTypes';

// 扩展 Window 接口以包含 gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface SecureCookiesManagerProps extends BaseComponentProps {
  sessionId: string;
  onConsentChange?: (consent: CookieConsent) => void;
  showAdvancedSettings?: boolean;
}

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  thirdParty: boolean;
  timestamp: string;
}

interface CookieCategory {
  id: keyof CookieConsent;
  name: string;
  description: string;
  required: boolean;
  icon: React.ReactNode;
}

export const SecureCookiesManager: React.FC<SecureCookiesManagerProps> = ({
  className,
  testId,
  sessionId,
  onConsentChange,
  showAdvancedSettings = false
}) => {
  const { t } = useTranslation('homepage');
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // 必要的cookies总是启用
    analytics: false,
    marketing: false,
    thirdParty: false,
    timestamp: new Date().toISOString()
  });
  const [showSettings, setShowSettings] = useState(showAdvancedSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cookie类别定义
  const cookieCategories: CookieCategory[] = [
    {
      id: 'necessary',
      name: t('cookies.categories.necessary.name'),
      description: t('cookies.categories.necessary.description'),
      required: true,
      icon: <Shield className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'analytics',
      name: t('cookies.categories.analytics.name'),
      description: t('cookies.categories.analytics.description'),
      required: false,
      icon: <Eye className="w-5 h-5 text-green-600" />
    },
    {
      id: 'marketing',
      name: t('cookies.categories.marketing.name'),
      description: t('cookies.categories.marketing.description'),
      required: false,
      icon: <Settings className="w-5 h-5 text-purple-600" />
    },
    {
      id: 'thirdParty',
      name: t('cookies.categories.thirdParty.name'),
      description: t('cookies.categories.thirdParty.description'),
      required: false,
      icon: <Lock className="w-5 h-5 text-orange-600" />
    }
  ];

  // 加载用户同意状态
  useEffect(() => {
    loadUserConsent();
  }, [sessionId]);

  const loadUserConsent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 从本地存储加载
      const savedConsent = localStorage.getItem(`cookie_consent_${sessionId}`);
      if (savedConsent) {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
      }

      // 从服务器加载
      const response = await fetch(`/api/security/privacy/consent/${sessionId}/necessary`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConsent(prev => ({
            ...prev,
            necessary: data.data.hasConsent
          }));
        }
      }
    } catch (err) {
      console.error('加载用户同意状态失败:', err);
      setError(t('cookies.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, t]);

  // 保存用户同意
  const saveConsent = useCallback(async (newConsent: CookieConsent) => {
    try {
      setIsLoading(true);
      setError(null);

      // 保存到本地存储
      localStorage.setItem(`cookie_consent_${sessionId}`, JSON.stringify(newConsent));

      // 保存到服务器
      for (const [consentType, granted] of Object.entries(newConsent)) {
        if (consentType !== 'timestamp') {
          await fetch('/api/security/privacy/consent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              sessionId,
              consentType,
              granted,
              timestamp: new Date().toISOString()
            })
          });
        }
      }

      setConsent(newConsent);
      onConsentChange?.(newConsent);

      // 应用cookies设置
      applyCookieSettings(newConsent);
    } catch (err) {
      console.error('保存用户同意失败:', err);
      setError(t('cookies.errors.saveFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, onConsentChange, t]);

  // 应用cookies设置
  const applyCookieSettings = useCallback((consent: CookieConsent) => {
    // 必要的cookies总是启用
    if (consent.necessary) {
      // 设置会话cookies
      document.cookie = `session_id=${sessionId}; path=/; secure; samesite=strict`;
    }

    // 分析cookies
    if (consent.analytics) {
      // 启用Google Analytics等分析工具
      window.gtag = window.gtag || function() {};
      document.cookie = `analytics_enabled=true; path=/; max-age=31536000; secure; samesite=strict`;
    } else {
      // 禁用分析cookies
      document.cookie = `analytics_enabled=false; path=/; max-age=31536000; secure; samesite=strict`;
    }

    // 营销cookies
    if (consent.marketing) {
      document.cookie = `marketing_enabled=true; path=/; max-age=31536000; secure; samesite=strict`;
    } else {
      document.cookie = `marketing_enabled=false; path=/; max-age=31536000; secure; samesite=strict`;
    }

    // 第三方cookies
    if (consent.thirdParty) {
      document.cookie = `third_party_enabled=true; path=/; max-age=31536000; secure; samesite=strict`;
    } else {
      document.cookie = `third_party_enabled=false; path=/; max-age=31536000; secure; samesite=strict`;
    }
  }, [sessionId]);

  // 处理同意变更
  const handleConsentChange = useCallback((consentType: keyof CookieConsent, value: boolean) => {
    if (consentType === 'necessary') return; // 必要的cookies不能禁用

    const newConsent = {
      ...consent,
      [consentType]: value,
      timestamp: new Date().toISOString()
    };

    saveConsent(newConsent);
  }, [consent, saveConsent]);

  // 接受所有cookies
  const acceptAll = useCallback(() => {
    const newConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      thirdParty: true,
      timestamp: new Date().toISOString()
    };
    saveConsent(newConsent);
  }, [saveConsent]);

  // 拒绝非必要cookies
  const rejectNonEssential = useCallback(() => {
    const newConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      thirdParty: false,
      timestamp: new Date().toISOString()
    };
    saveConsent(newConsent);
  }, [saveConsent]);

  // 重置同意
  const resetConsent = useCallback(() => {
    const newConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      thirdParty: false,
      timestamp: new Date().toISOString()
    };
    saveConsent(newConsent);
  }, [saveConsent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`} data-testid={testId}>
      {/* 头部 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('cookies.title')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('cookies.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showSettings ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* 快速操作 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-3">
          <button
            onClick={acceptAll}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {t('cookies.actions.acceptAll')}
          </button>
          <button
            onClick={rejectNonEssential}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            {t('cookies.actions.rejectNonEssential')}
          </button>
          <button
            onClick={resetConsent}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            {t('cookies.actions.reset')}
          </button>
        </div>
      </div>

      {/* 详细设置 */}
      {showSettings && (
        <div className="px-6 py-4">
          <div className="space-y-4">
            {cookieCategories.map((category) => (
              <div key={category.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {category.name}
                        {category.required && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({t('cookies.required')})
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {category.required ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium ml-1">
                            {t('cookies.alwaysEnabled')}
                          </span>
                        </div>
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(consent[category.id as keyof CookieConsent])}
                            onChange={(e) => handleConsentChange(category.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 保存按钮 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => saveConsent(consent)}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? t('cookies.saving') : t('cookies.saveSettings')}
            </button>
          </div>
        </div>
      )}

      {/* 底部信息 */}
      <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
        <p className="text-xs text-gray-500 text-center">
          {t('cookies.footer')}
          <a
            href="/privacy-policy"
            className="text-blue-600 hover:text-blue-800 underline ml-1"
          >
            {t('cookies.privacyPolicy')}
          </a>
        </p>
      </div>
    </div>
  );
};
