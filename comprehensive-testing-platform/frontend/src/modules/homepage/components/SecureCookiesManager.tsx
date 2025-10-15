/**
 * Secure Cookies Manager Component
 * 安全的Cookies管理组件
 */

// @ts-nocheck
import React from 'react';
import { getApiBaseUrl } from '@/config/environment';
import type { BaseComponentProps } from '@/types/componentTypes';

interface SecureCookiesManagerProps extends BaseComponentProps {
  sessionId: string;
  onConsentChange?: (consent: any) => void; // eslint-disable-line no-unused-vars
  showAdvancedSettings?: boolean;
}

export const SecureCookiesManager: React.FC<SecureCookiesManagerProps> = ({
  className,
  testId,
  sessionId,
  onConsentChange
}) => {
  const saveConsent = async (consentData: any) => {
    try {
      await fetch(`${getApiBaseUrl()}/api/security/privacy/consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          consent: consentData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      // Failed to save consent to backend
    }
  };

  const handleAcceptAll = () => {
    const consent = { necessary: true, analytics: true, marketing: true };
    saveConsent(consent);
    onConsentChange?.(consent);
  };

  const handleRejectAll = () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    saveConsent(consent);
    onConsentChange?.(consent);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className || ''}`} data-testid={testId}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookie Preferences</h2>
      <p className="text-gray-600 mb-6">
        We use cookies to enhance your experience and analyze our traffic.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleAcceptAll}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Accept All
        </button>
        <button
          onClick={handleRejectAll}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Reject All
        </button>
      </div>
    </div>
  );
};