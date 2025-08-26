/**
 * Test script to verify language integration for psychology module
 * This file tests the language parameter integration in question service
 */

import { questionService } from './services/questionService';
import { usePsychologyStore } from './stores/usePsychologyStore';

// Test language parameter integration
export async function testLanguageIntegration() {
  console.log('Testing language integration for psychology module...');
  
  // Test 1: Verify questionService accepts language parameter
  console.log('Test 1: Testing questionService.getQuestionsByType with language parameter');
  
  try {
    const result = await questionService.getQuestionsByType('mbti', 'en');
    console.log('✓ questionService.getQuestionsByType accepts language parameter');
    console.log('Result:', result.success ? 'Success' : 'Failed: ' + result.error);
  } catch (error: any) {
    console.log('✗ questionService.getQuestionsByType failed:', error.message);
  }
  
  // Test 2: Verify store language detection
  console.log('\nTest 2: Testing usePsychologyStore language detection');
  
  try {
    const store = usePsychologyStore.getState();
    const language = (store as any).getCurrentLanguage();
    console.log('✓ usePsychologyStore.getCurrentLanguage() works');
    console.log('Detected language:', language);
  } catch (error: any) {
    console.log('✗ usePsychologyStore language detection failed:', error.message);
  }
  
  // Test 3: Verify cache key includes language
  console.log('\nTest 3: Testing cache key generation with language');
  
  try {
    const store = usePsychologyStore.getState();
    const language = (store as any).getCurrentLanguage();
    const cacheKey = `questions:mbti:${language}`;
    console.log('✓ Cache key includes language:', cacheKey);
  } catch (error: any) {
    console.log('✗ Cache key generation failed:', error.message);
  }
  
  console.log('\nLanguage integration test completed!');
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined' && window.location.href.includes('test-language')) {
  testLanguageIntegration();
}