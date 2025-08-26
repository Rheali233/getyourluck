/**
 * Performance Monitoring Component
 * Displays cache statistics, progress statistics and other performance-related information
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { frontendCacheService } from '../services/frontendCacheService';
import { progressManager } from '../services/progressManager';
import type { BaseComponentProps } from '@/types/componentTypes';

interface PerformanceMonitorProps extends BaseComponentProps {
  showDetails?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  className, 
  testId = 'performance-monitor',
  showDetails = false,
  ...props 
}) => {
  const [cacheStats, setCacheStats] = useState({ totalKeys: 0, totalSize: 0 });
  const [progressStats, setProgressStats] = useState({
    totalTests: 0,
    completedTests: 0,
    inProgressTests: 0,
    averageCompletionTime: 0
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showDetailsState, setShowDetailsState] = useState(showDetails);

  useEffect(() => {
    updateStats();
    
    // Update statistics every 30 seconds
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStats = () => {
    try {
      // Update cache statistics
      const cache = frontendCacheService.getStats();
      setCacheStats(cache);

      // Update progress statistics
      const progress = progressManager.getProgressStats();
      setProgressStats(progress);

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to update performance statistics:', error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number): string => {
    if (ms === 0) return '0 minutes';
    const minutes = Math.floor(ms / (1000 * 60));
    return `${minutes} minutes`;
  };

  const handleClearCache = () => {
    try {
      // Clear all cache
      frontendCacheService.clearNamespace('questions');
      frontendCacheService.clearNamespace('test-progress');
      updateStats();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const handleCleanupProgress = () => {
    try {
      progressManager.cleanupExpiredProgress();
      // Cleaned up expired progress records
      updateStats();
    } catch (error) {
      console.error('Failed to clean up progress records:', error);
    }
  };

  if (!showDetailsState) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDetailsState(!showDetailsState)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          title="Performance Monitoring"
        >
          📊
        </button>
      </div>
    );
  }

  return (
    <Card className={`p-4 bg-white shadow-lg ${className}`} data-testid={testId} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Performance Monitoring</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleClearCache}
            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
            title="Clear Cache"
          >
            Clear Cache
          </button>
          <button
            onClick={handleCleanupProgress}
            className="px-3 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded"
            title="Clean Up Progress"
          >
            Clean Up Progress
          </button>
                      <button
              onClick={() => setShowDetailsState(false)}
              className="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded"
              title="Close"
            >
              ✕
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Cache Statistics */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Cache Statistics</h4>
          <div className="space-y-1 text-xs text-blue-700">
            <div>Total Keys: {cacheStats.totalKeys}</div>
            <div>Total Size: {formatBytes(cacheStats.totalSize)}</div>
          </div>
        </div>

        {/* Progress Statistics */}
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">Progress Statistics</h4>
          <div className="space-y-1 text-xs text-green-700">
            <div>Total Tests: {progressStats.totalTests}</div>
            <div>Completed: {progressStats.completedTests}</div>
            <div>In Progress: {progressStats.inProgressTests}</div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="space-y-3">
        <div className="text-xs text-gray-600">
          <div>Average Completion Time: {formatTime(progressStats.averageCompletionTime)}</div>
          <div>Last Updated: {lastUpdate.toLocaleTimeString()}</div>
        </div>

        {/* Performance Suggestions */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Performance Suggestions</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            {cacheStats.totalSize > 1024 * 1024 && (
              <div>• Large cache size, recommend regular cleanup</div>
            )}
            {progressStats.inProgressTests > 5 && (
              <div>• Many tests in progress, recommend completing or cleaning up</div>
            )}
            {cacheStats.totalKeys > 100 && (
              <div>• Many cache keys, recommend optimizing storage strategy</div>
            )}
            {cacheStats.totalKeys === 0 && (
              <div>• No cache data yet, initial loading may be slow</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
