/**
 * API状态指示器
 * 显示API连接状态和错误信息
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/classNames';
import { getApiBaseUrl } from '@/config/environment';

interface ApiStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  className,
  showDetails = false
}) => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      console.log('API Status Check - Base URL:', apiBaseUrl);
      console.log('API Status Check - Full URL:', `${apiBaseUrl}/health`);
      const response = await fetch(`${apiBaseUrl}/health`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch (error) {
      setApiStatus('offline');
    }
    
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkApiStatus();
    
    // 每30秒检查一次
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!showDetails && apiStatus === 'online') {
    return null; // 只在有问题时显示
  }

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'checking': return 'text-yellow-600 bg-yellow-50';
      case 'online': return 'text-green-600 bg-green-50';
      case 'offline': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'checking': return 'Checking API...';
      case 'online': return 'API Online';
      case 'offline': return 'API Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-300",
      getStatusColor(),
      className
    )}>
      <div className="flex items-center space-x-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          apiStatus === 'online' ? 'bg-green-500' : 
          apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
        )} />
        <span>{getStatusText()}</span>
        {showDetails && lastCheck && (
          <span className="text-xs opacity-75">
            ({lastCheck.toLocaleTimeString()})
          </span>
        )}
      </div>
      
      {apiStatus === 'offline' && (
        <div className="mt-1 text-xs opacity-75">
          Some features may be unavailable
        </div>
      )}
    </div>
  );
};
