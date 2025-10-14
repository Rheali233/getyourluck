/**
 * Learning Ability Test Progress Manager
 * Handles test progress saving and restoration
 */

import type { TestProgress, LearningTestType } from '../types';

export class ProgressManager {
  private storageKey = 'learning_test_progress';

  constructor() {
  }

  /**
   * Save test progress to localStorage
   */
  saveProgress(progress: TestProgress): boolean {
    try {
      const existingProgress = this.getAllProgress();
      existingProgress[progress.sessionId] = progress;
      
      localStorage.setItem(this.storageKey, JSON.stringify(existingProgress));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Load test progress from localStorage
   */
  loadProgress(testType: LearningTestType, sessionId: string): TestProgress | null {
    try {
      const allProgress = this.getAllProgress();
      const progress = allProgress[sessionId];
      
      if (progress && progress.testType === testType) {
        return progress;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all saved progress
   */
  private getAllProgress(): Record<string, TestProgress> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      return {};
    }
  }

  /**
   * Clear specific test progress
   */
  clearProgress(sessionId: string): boolean {
    try {
      const allProgress = this.getAllProgress();
      delete allProgress[sessionId];
      
      localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all progress
   */
  clearAllProgress(): boolean {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get progress for specific test type
   */
  getProgressByTestType(testType: LearningTestType): TestProgress[] {
    try {
      const allProgress = this.getAllProgress();
      return Object.values(allProgress).filter(progress => progress.testType === testType);
    } catch (error) {
      return [];
    }
  }

  /**
   * Check if progress exists for session
   */
  hasProgress(sessionId: string): boolean {
    try {
      const allProgress = this.getAllProgress();
      return sessionId in allProgress;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const progressManager = new ProgressManager();
