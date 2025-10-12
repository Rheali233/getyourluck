import React from 'react';
import { LearningGenericTestPage } from './LearningGenericTestPage';

export const CognitiveTestPage: React.FC = () => {
  return (
    <LearningGenericTestPage 
      testType="cognitive"
      title="Cognitive Function Assessment"
      description="Evaluate your cognitive functions including memory, processing speed, and problem-solving abilities."
    />
  );
};
