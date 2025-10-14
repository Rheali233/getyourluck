/**
 * Progress Recovery Prompt Component
 * Displays recovery prompt when user has unfinished tests
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { progressManager } from '../services/progressManager';
// 暂时注释掉未使用的导入
// import { usePsychologyStore } from '../stores/usePsychologyStore';
import type { BaseComponentProps } from '@/types/componentTypes';
import { PsychologyTestType, PsychologyTestTypes } from '../types';
import type { TestProgress } from '../services/progressManager';

interface ProgressRecoveryPromptProps extends BaseComponentProps {
  testType: PsychologyTestType;
  onRecover?: () => void;
  onDismiss?: () => void;
}

export const ProgressRecoveryPrompt: React.FC<ProgressRecoveryPromptProps> = ({ 
  className, 
  testId = 'progress-recovery-prompt',
  testType,
  onRecover,
  onDismiss,
  ...props 
}) => {
  const [hasProgress, setHasProgress] = useState(false);
  const [progress, setProgress] = useState<TestProgress | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // 暂时注释掉不存在的属性
  // const { restoreProgress } = usePsychologyStore();

  useEffect(() => {
    checkProgress();
  }, [testType]);

  const checkProgress = () => {
    try {
      // Find unfinished progress for this test type
      const allProgress = progressManager.getAllProgress();
      const testProgress = allProgress.find(p => 
        p.testType === testType && !p.isCompleted
      );
      
      if (testProgress) {
        setProgress(testProgress);
        setHasProgress(true);
        setIsVisible(true);
      } else {
        setHasProgress(false);
        setIsVisible(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      }
  };

  const handleRecover = () => {
    if (progress) {
      // 暂时注释掉不存在的函数调用
      // const success = restoreProgress(testType, progress.sessionId);
      // if (success) {
        setIsVisible(false);
        onRecover?.();
      // }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleDelete = () => {
    if (progress) {
      progressManager.deleteProgress(testType, progress.sessionId);
      setIsVisible(false);
      onDismiss?.();
    }
  };

  if (!isVisible || !hasProgress || !progress) {
    return null;
  }

  const getTestTypeName = (type: PsychologyTestType): string => {
    const names = {
      [PsychologyTestTypes.MBTI]: 'MBTI Personality Test',
      [PsychologyTestTypes.PHQ9]: 'PHQ-9 Depression Screening',
      [PsychologyTestTypes.EQ]: 'Emotional Intelligence Test',
      [PsychologyTestTypes.HAPPINESS]: 'Happiness Index Assessment'
    };
    return names[type as keyof typeof names] || type;
  };

  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <Card className={`p-4 bg-blue-50 border-blue-200 ${className}`} data-testid={testId} {...props}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">📝</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-blue-800 mb-1">
            Unfinished Test Progress Found
          </h3>
          
          <div className="text-xs text-blue-700 space-y-1 mb-3">
            <div>Test Type: {getTestTypeName(testType)}</div>
            <div>Questions Answered: {progress.answers.length}</div>
            <div>Current Progress: {progress.currentQuestionIndex + 1} / {progress.currentQuestionIndex + progress.answers.length + 1}</div>
            <div>Start Time: {formatTime(progress.startTime)}</div>
            <div>Last Updated: {formatTime(progress.lastUpdateTime)}</div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleRecover}
              className="px-3 py-1 text-xs bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white"
            >
              Restore Progress
            </Button>
            
            <Button
              onClick={handleDelete}
              className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Progress
            </Button>
            
            <Button
              onClick={handleDismiss}
              className="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
