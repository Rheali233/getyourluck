/**
 * Learning Ability Module Routes
 * Centralized routing configuration for the learning ability module
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LearningAbilityHomePage } from './components/LearningAbilityHomePage';
import { VARKTestPage } from './components/VARKTestPage';
import { CognitiveTestPage } from './components/CognitiveTestPage';

export const LearningAbilityRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main learning ability page */}
      <Route path="/" element={<LearningAbilityHomePage />} />
      
      {/* Individual test routes */}
      <Route path="/vark" element={<VARKTestPage />} />
      {/* Cognitive removed */}
      
      {/* Redirect invalid routes to main page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Route constants for easy reference
export const LEARNING_ROUTES = {
  HOME: '/learning',
  VARK: '/learning/vark',
  // COGNITIVE: '/learning/cognitive',
} as const;

// Navigation items for the module
export const LEARNING_NAVIGATION_ITEMS = [
  {
    name: 'Overview',
    path: LEARNING_ROUTES.HOME,
    description: 'Learn about different learning ability tests',
    icon: '📚'
  },
  {
    name: 'VARK Test',
    path: LEARNING_ROUTES.VARK,
    description: 'Discover your learning style preferences',
    icon: '🎨'
  },
  {
    name: 'Cognitive Test',
    // removed
    path: '#',
    description: 'Evaluate your cognitive functions (temporarily unavailable)',
    icon: '🧠'
  }
] as const;
