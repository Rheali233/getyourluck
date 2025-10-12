/**
 * Test Flow Interface
 * Core interface that all tests must implement
 */

import type { 
  TestType, 
  TestSession, 
  TestAnswer, 
  TestResult, 
  Question,
  TestProgress
} from '../types/TestTypes';
import { TestStatus } from '../types/TestTypes';

/**
 * Core test flow interface
 * All test implementations must implement this interface
 */
export interface ITestFlow<T extends TestType> {
  // Test lifecycle
  startTest(): Promise<void>;
  pauseTest(): void;
  resumeTest(): void;
  endTest(): Promise<TestResult<any>>;
  resetTest(): void;
  
  // Question navigation
  getCurrentQuestion(): Question | null;
  goToQuestion(index: number): void;
  goToNextQuestion(): void;
  goToPreviousQuestion(): void;
  
  // Answer management
  submitAnswer(questionId: string, answer: any): void;
  getAnswer(questionId: string): TestAnswer | undefined;
  getAllAnswers(): TestAnswer[];
  
  // Progress management
  getProgress(): TestProgress;
  saveProgress(): boolean;
  loadProgress(sessionId: string): boolean;
  
  // Session management
  getCurrentSession(): TestSession | null;
  createSession(): TestSession;
  updateSession(updates: Partial<TestSession>): void;
  
  // Result generation
  generateResults(): Promise<TestResult<any>>;
  analyzeResults(): Promise<any>;
  
  // Utility methods
  getTestInfo(): T;
  getQuestionCount(): number;
  getCurrentQuestionIndex(): number;
  isTestComplete(): boolean;
  getTimeSpent(): number;
}

/**
 * Abstract base class for test implementations
 * Provides common functionality and enforces interface implementation
 */
export abstract class BaseTestFlow<T extends TestType> implements ITestFlow<T> {
  protected session: TestSession | null = null;
  protected questions: Question[] = [];
  protected testType: T;
  
  constructor(testType: T) {
    this.testType = testType;
  }
  
  // Abstract methods that must be implemented by subclasses
  abstract startTest(): Promise<void>;
  abstract submitAnswer(questionId: string, answer: any): void;
  abstract generateResults(): Promise<TestResult<any>>;
  abstract analyzeResults(): Promise<any>;
  
  // Default implementations for common functionality
  pauseTest(): void {
    if (this.session) {
      this.session.status = TestStatus.PAUSED;
      this.updateSession(this.session);
    }
  }
  
  resumeTest(): void {
    if (this.session) {
      this.session.status = TestStatus.IN_PROGRESS;
      this.updateSession(this.session);
    }
  }
  
  resetTest(): void {
    this.session = null;
  }
  
  getCurrentQuestion(): Question | null {
    if (!this.session || !this.questions.length) return null;
    const index = this.session.currentQuestionIndex;
    return this.questions[index] || null;
  }
  
  goToQuestion(index: number): void {
    if (this.session && index >= 0 && index < this.questions.length) {
      this.session.currentQuestionIndex = index;
      this.updateSession(this.session);
    }
  }
  
  goToNextQuestion(): void {
    if (this.session && this.session.currentQuestionIndex < this.questions.length - 1) {
      this.session.currentQuestionIndex++;
      this.updateSession(this.session);
    }
  }
  
  goToPreviousQuestion(): void {
    if (this.session && this.session.currentQuestionIndex > 0) {
      this.session.currentQuestionIndex--;
      this.updateSession(this.session);
    }
  }
  
  getAnswer(questionId: string): TestAnswer | undefined {
    if (!this.session) return undefined;
    return this.session.answers.find(answer => answer.questionId === questionId);
  }
  
  getAllAnswers(): TestAnswer[] {
    return this.session?.answers || [];
  }
  
  getProgress(): TestProgress {
    if (!this.session) {
      throw new Error('No active test session');
    }
    
    return {
      testType: this.session.testType,
      sessionId: this.session.id,
      currentQuestionIndex: this.session.currentQuestionIndex,
      answers: this.session.answers,
      startTime: this.session.startTime.toISOString(),
      lastUpdateTime: new Date().toISOString(),
      isCompleted: this.session.status === TestStatus.COMPLETED,
      timeSpent: this.session.timeSpent
    };
  }
  
  saveProgress(): boolean {
    // Default implementation - can be overridden by subclasses
    try {
      const progress = this.getProgress();
      localStorage.setItem(`test_progress_${progress.sessionId}`, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  }
  
  loadProgress(sessionId: string): boolean {
    try {
      const savedProgress = localStorage.getItem(`test_progress_${sessionId}`);
      if (savedProgress) {
        const progress: TestProgress = JSON.parse(savedProgress);
        // Restore session from progress
        this.session = {
          id: progress.sessionId,
          testType: progress.testType,
          status: progress.isCompleted ? TestStatus.COMPLETED : TestStatus.IN_PROGRESS,
          startTime: new Date(progress.startTime),
          currentQuestionIndex: progress.currentQuestionIndex,
          answers: progress.answers,
          totalQuestions: this.questions.length,
          timeSpent: progress.timeSpent
        };
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return false;
    }
  }
  
  getCurrentSession(): TestSession | null {
    return this.session;
  }
  
  createSession(): TestSession {
    const session: TestSession = {
      id: `session_${Date.now()}`,
      testType: this.testType.id,
              status: TestStatus.IN_PROGRESS,
      startTime: new Date(),
      currentQuestionIndex: 0,
      answers: [],
      totalQuestions: this.questions.length,
      timeSpent: 0
    };
    
    this.session = session;
    return session;
  }
  
  updateSession(updates: Partial<TestSession>): void {
    if (this.session) {
      this.session = { ...this.session, ...updates };
    }
  }
  
  endTest(): Promise<TestResult<any>> {
    if (!this.session) {
      throw new Error('No active test session');
    }
    
          this.session.status = TestStatus.COMPLETED;
    this.session.endTime = new Date();
    this.updateSession(this.session);
    
    return this.generateResults();
  }
  
  getTestInfo(): T {
    return this.testType;
  }
  
  getQuestionCount(): number {
    return this.questions.length;
  }
  
  getCurrentQuestionIndex(): number {
    return this.session?.currentQuestionIndex || 0;
  }
  
  isTestComplete(): boolean {
    return this.session?.status === TestStatus.COMPLETED || false;
  }
  
  getTimeSpent(): number {
    if (!this.session) return 0;
    
    const endTime = this.session.endTime || new Date();
    return endTime.getTime() - this.session.startTime.getTime();
  }
  
  // Protected helper methods for subclasses
  protected setQuestions(questions: Question[]): void {
    this.questions = questions;
  }
  
  protected addAnswer(answer: TestAnswer): void {
    if (this.session) {
      // Remove existing answer for the same question if it exists
      this.session.answers = this.session.answers.filter(a => a.questionId !== answer.questionId);
      this.session.answers.push(answer);
      this.updateSession(this.session);
    }
  }
  
  protected updateTimeSpent(): void {
    if (this.session) {
      this.session.timeSpent = this.getTimeSpent();
      this.updateSession(this.session);
    }
  }
}

/**
 * Test flow factory interface
 * Used to create test instances
 */
export interface ITestFlowFactory<T extends TestType> {
  createTest(testType: T): ITestFlow<T>;
}

/**
 * Test flow registry
 * Manages all available test types and their implementations
 */
export class TestFlowRegistry {
  private static instance: TestFlowRegistry;
  private testFlows: Map<string, ITestFlowFactory<any>> = new Map();
  
  private constructor() {}
  
  static getInstance(): TestFlowRegistry {
    if (!TestFlowRegistry.instance) {
      TestFlowRegistry.instance = new TestFlowRegistry();
    }
    return TestFlowRegistry.instance;
  }
  
  registerTestFlow<T extends TestType>(
    testType: string, 
    factory: ITestFlowFactory<T>
  ): void {
    this.testFlows.set(testType, factory);
  }
  
  createTestFlow<T extends TestType>(testType: string): ITestFlow<T> | null {
    const factory = this.testFlows.get(testType);
    if (factory) {
      // This is a simplified version - in practice, you'd need to pass the actual test type
      return factory.createTest({} as T);
    }
    return null;
  }
  
  getAvailableTestTypes(): string[] {
    return Array.from(this.testFlows.keys());
  }
  
  hasTestFlow(testType: string): boolean {
    return this.testFlows.has(testType);
  }
}
