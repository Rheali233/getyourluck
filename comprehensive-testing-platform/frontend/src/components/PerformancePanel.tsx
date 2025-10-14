/**
 * 性能监控面板
 * 开发环境下显示性能指标
 */

import React, { useState } from 'react';
import { usePerformance } from '@/hooks/usePerformance';
import { cn } from '@/utils/classNames';

interface PerformancePanelProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  collapsed?: boolean;
}

export const PerformancePanel: React.FC<PerformancePanelProps> = ({
  className,
  position = 'top-right',
  collapsed = false
}) => {
  const { metrics, score, suggestions } = usePerformance();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  // 只在开发环境显示
  if (process.env['NODE_ENV'] !== 'development') {
    return null;
  }

  const getPerformanceStatus = () => {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  };

  const status = getPerformanceStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMetricColor = (value: number | null, threshold: number) => {
    if (value === null) return 'text-gray-400';
    return value <= threshold ? 'text-green-600' : 'text-red-600';
  };

  // 性能阈值定义
  const thresholds = {
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    fcp: 1800, // 1.8s
    ttfb: 600  // 600ms
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div
      className={cn(
        'fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300',
        positionClasses[position],
        isCollapsed ? 'w-12 h-12' : 'w-80',
        className
      )}
    >
      {/* 折叠/展开按钮 */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold transition-colors',
          isCollapsed ? 'top-2 right-2' : 'top-2 right-2'
        )}
      >
        {isCollapsed ? '📊' : '✕'}
      </button>

      {!isCollapsed && (
        <div className="p-4">
          {/* 标题 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Performance Monitor</h3>
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              getStatusColor(status)
            )}>
              {status.toUpperCase()}
            </div>
          </div>

          {/* 总体评分 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Score</span>
              <span className="text-2xl font-bold text-gray-800">{score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-500',
                  score >= 90 ? 'bg-green-500' :
                  score >= 75 ? 'bg-blue-500' :
                  score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                )}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* 详细指标 */}
          <div className="space-y-3">
            {/* LCP */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">LCP</span>
                <span className="text-xs text-gray-500">(≤{thresholds.lcp}ms)</span>
              </div>
              <span className={cn(
                'text-sm font-mono',
                getMetricColor(metrics.lcp, thresholds.lcp)
              )}>
                {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : '--'}
              </span>
            </div>

            {/* FID */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">FID</span>
                <span className="text-xs text-gray-500">(≤{thresholds.fid}ms)</span>
              </div>
              <span className={cn(
                'text-sm font-mono',
                getMetricColor(metrics.fid, thresholds.fid)
              )}>
                {metrics.fid ? `${metrics.fid.toFixed(0)}ms` : '--'}
              </span>
            </div>

            {/* CLS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">CLS</span>
                <span className="text-xs text-gray-500">(≤{thresholds.cls})</span>
              </div>
              <span className={cn(
                'text-sm font-mono',
                getMetricColor(metrics.cls, thresholds.cls)
              )}>
                {metrics.cls ? metrics.cls.toFixed(3) : '--'}
              </span>
            </div>

            {/* FCP */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">FCP</span>
                <span className="text-xs text-gray-500">(≤{thresholds.fcp}ms)</span>
              </div>
              <span className={cn(
                'text-sm font-mono',
                getMetricColor(metrics.fcp, thresholds.fcp)
              )}>
                {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : '--'}
              </span>
            </div>

            {/* TTFB */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">TTFB</span>
                <span className="text-xs text-gray-500">(≤{thresholds.ttfb}ms)</span>
              </div>
              <span className={cn(
                'text-sm font-mono',
                getMetricColor(metrics.ttfb, thresholds.ttfb)
              )}>
                {metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : '--'}
              </span>
            </div>
          </div>

          {/* 建议 */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
            <div className="text-xs text-gray-600 space-y-1">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div key={index}>• {suggestion}</div>
                ))
              ) : (
                <div>• Performance looks good!</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
