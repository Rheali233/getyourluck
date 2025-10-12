import React from 'react';
import { LearningGenericTestPage } from './LearningGenericTestPage';

export const VARKTestPage: React.FC = () => {
  return (
    <LearningGenericTestPage 
      testType="vark"
      title="VARK Learning Style Test"
      description="Discover your preferred learning style and optimize your study methods for better academic performance."
    />
  );
};
