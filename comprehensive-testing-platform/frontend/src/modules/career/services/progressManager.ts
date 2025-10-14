/**
 * Career Test Progress Management Service
 * Manages user's career test progress, answer records, supports local storage and recovery
 */

import { frontendCacheService } from './frontendCacheService';
import type { CareerTestType, UserAnswer } from '../types';

export interface TestProgress {
  testType: CareerTestType;
  sessionId: string;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: string;
  lastUpdateTime: string;
  isCompleted: boolean;
}

export interface ProgressOptions {
  autoSave?: boolean; // Whether to auto-save
  saveInterval?: number; // Save interval (milliseconds)
}

export class CareerProgressManager {
  private autoSave: boolean;
  private saveInterval: number;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(options: ProgressOptions = {}) {
    this.autoSave = options.autoSave ?? true;
    this.saveInterval = options.saveInterval ?? 30000; // Default save every 30 seconds
  }

  /**
   * Generate progress storage key
   */
  private generateProgressKey(testType: CareerTestType, sessionId: string): string {
    return `progress:${testType}:${sessionId}`;
  }

  /**
   * Save answer progress
   */
  saveProgress(progress: TestProgress): boolean {
    try {
      const key = this.generateProgressKey(progress.testType, progress.sessionId);
      const updatedProgress = {
        ...progress,
        lastUpdateTime: new Date().toISOString()
      };
      
      return frontendCacheService.set(key, updatedProgress, {
        namespace: 'career-test-progress',
        ttl: 24 * 60 * 60 * 1000 // 24 hours expiration
      });
    } catch (error) {
      console.error('Failed to save career test progress:', error);
      return false;
    }
  }

  /**
   * Load answer progress
   */
  loadProgress(testType: CareerTestType, sessionId: string): TestProgress | null {
    try {
      const key = this.generateProgressKey(testType, sessionId);
      return frontendCacheService.get<TestProgress>(key, 'career-test-progress');
    } catch (error) {
      console.error('Failed to load career test progress:', error);
      return null;
    }
  }

  /**
   * Delete answer progress
   */
  deleteProgress(testType: CareerTestType, sessionId: string): boolean {
    try {
      const key = this.generateProgressKey(testType, sessionId);
      return frontendCacheService.delete(key, 'career-test-progress');
    } catch (error) {
      console.error('Failed to delete career test progress:', error);
      return false;
    }
  }

  /**
   * Update answer progress
   */
  updateProgress(
    testType: CareerTestType, 
    sessionId: string, 
    updates: Partial<TestProgress>
  ): boolean {
    try {
      const existingProgress = this.loadProgress(testType, sessionId);
      if (!existingProgress) {
        return false;
      }

      const updatedProgress: TestProgress = {
        ...existingProgress,
        ...updates,
        lastUpdateTime: new Date().toISOString()
      };

      return this.saveProgress(updatedProgress);
    } catch (error) {
      console.error('Failed to update career test progress:', error);
      return false;
    }
  }

  /**
   * Add answer
   */
  addAnswer(
    testType: CareerTestType,
    sessionId: string,
    answer: UserAnswer
  ): boolean {
    try {
      const existingProgress = this.loadProgress(testType, sessionId);
      if (!existingProgress) {
        return false;
      }

      const updatedProgress: TestProgress = {
        ...existingProgress,
        answers: [...existingProgress.answers, answer],
        currentQuestionIndex: existingProgress.currentQuestionIndex + 1,
        lastUpdateTime: new Date().toISOString()
      };

      return this.saveProgress(updatedProgress);
    } catch (error) {
      console.error('Failed to add career test answer:', error);
      return false;
    }
  }

  /**
   * Get all test progress for user
   */
  getAllProgress(): TestProgress[] {
    try {
      const progressList: TestProgress[] = [];
      
      // Iterate localStorage to find all career test progress data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('career:career-test-progress:progress:')) {
          const progress = frontendCacheService.get<TestProgress>(key, 'career-test-progress');
          if (progress) {
            progressList.push(progress);
          }
        }
      }
      
      return progressList.sort((a, b) => 
        new Date(b.lastUpdateTime).getTime() - new Date(a.lastUpdateTime).getTime()
      );
    } catch (error) {
      console.error('Failed to get all career test progress:', error);
      return [];
    }
  }

  /**
   * Clean up expired progress data
   */
  cleanupExpiredProgress(): number {
    try {
      let cleanedCount = 0;
      const progressList = this.getAllProgress();
      const now = new Date();
      
      progressList.forEach(progress => {
        const lastUpdate = new Date(progress.lastUpdateTime);
        const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
        
        // Delete progress data older than 7 days
        if (daysSinceUpdate > 7) {
          this.deleteProgress(progress.testType, progress.sessionId);
          cleanedCount++;
        }
      });
      
      return cleanedCount;
    } catch (error) {
      console.error('Failed to cleanup expired career test progress:', error);
      return 0;
    }
  }

  /**
   * Start auto-save
   */
  startAutoSave(): void {
    if (this.autoSave && !this.saveTimer) {
      this.saveTimer = setInterval(() => {
        // Auto-save logic can be added here
      }, this.saveInterval);
    }
  }

  /**
   * Stop auto-save
   */
  stopAutoSave(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = null;
    }
  }

  /**
   * Get progress statistics
   */
  getProgressStats(): {
    totalTests: number;
    completedTests: number;
    inProgressTests: number;
    averageCompletionTime: number;
  } {
    try {
      const progressList = this.getAllProgress();
      const completedTests = progressList.filter(p => p.isCompleted);
      const inProgressTests = progressList.filter(p => !p.isCompleted);
      
      let totalCompletionTime = 0;
      completedTests.forEach(test => {
        const startTime = new Date(test.startTime);
        const lastUpdateTime = new Date(test.lastUpdateTime);
        totalCompletionTime += lastUpdateTime.getTime() - startTime.getTime();
      });
      
      const averageCompletionTime = completedTests.length > 0 
        ? totalCompletionTime / completedTests.length 
        : 0;
      
      return {
        totalTests: progressList.length,
        completedTests: completedTests.length,
        inProgressTests: inProgressTests.length,
        averageCompletionTime
      };
    } catch (error) {
      console.error('Failed to get career test progress stats:', error);
      return {
        totalTests: 0,
        completedTests: 0,
        inProgressTests: 0,
        averageCompletionTime: 0
      };
    }
  }
}

// Create default instance
export const progressManager = new CareerProgressManager();
