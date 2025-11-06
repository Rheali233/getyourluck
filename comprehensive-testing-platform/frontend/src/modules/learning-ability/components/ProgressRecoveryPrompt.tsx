/**
 * Progress Recovery Prompt Component for Learning Ability Module
 * Displays recovery prompt when user has unfinished learning tests
 * Uses sky/cyan theme to match Learning Ability module styling
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { BaseComponentProps } from '@/types/componentTypes';
import { LearningTestTypes, LearningTestType } from '../types';

// Placeholder type - will be replaced when progressManager is implemented
interface TestProgress {
  testType: LearningTestType;
  sessionId: string;
  isCompleted: boolean;
  answers: any[];
  currentQuestionIndex: number;
  startTime: string;
  lastUpdateTime: string;
}

// Note: progressManager would be implemented similar to career/psychology modules
// For now, using a placeholder that will be implemented later
const progressManager = {
  getAllProgress: () => [] as TestProgress[],
  deleteProgress: (_testType: LearningTestType, _sessionId: string) => {}
};

interface ProgressRecoveryPromptProps extends BaseComponentProps {
  testType: LearningTestType;
  onRecover?: () => void;
  onDismiss?: () => void;
}

export const ProgressRecoveryPrompt: React.FC<ProgressRecoveryPromptProps> = ({ 
  className, 
  testId = 'learning-progress-recovery-prompt',
  testType,
  onRecover,
  onDismiss,
  ...props 
}) => {
  const [hasProgress, setHasProgress] = useState(false);
  const [progress, setProgress] = useState<TestProgress | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      // Error handling would be implemented here
    }
  };

  const handleRecover = () => {
    if (progress) {
      // Restore progress functionality would be implemented here
      setIsVisible(false);
      onRecover?.();
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

  const getTestTypeName = (type: LearningTestType): string => {
    const names = {
      [LearningTestTypes.VARK]: 'VARK Learning Style Test'
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
    <Card className={`p-4 bg-sky-50 border-sky-200 ${className}`} data-testid={testId} {...props}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-sky-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🎓</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-sky-800 mb-1">
            Unfinished Learning Test Progress Found
          </h3>
          
          <div className="text-xs text-sky-700 space-y-1 mb-3">
            <div>Test Type: {getTestTypeName(testType)}</div>
            <div>Questions Answered: {progress.answers.length}</div>
            <div>Current Progress: {progress.currentQuestionIndex + 1} / {progress.currentQuestionIndex + progress.answers.length + 1}</div>
            <div>Start Time: {formatTime(progress.startTime)}</div>
            <div>Last Updated: {formatTime(progress.lastUpdateTime)}</div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleRecover}
              className="px-3 py-1 text-xs bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-700 hover:to-sky-600 text-white"
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

