import React from 'react';
import { RelationshipGenericTestPage } from './RelationshipGenericTestPage';

export const InterpersonalTestPage: React.FC = () => {
  return (
    <RelationshipGenericTestPage 
      testType="interpersonal"
      title="Interpersonal Skills Test"
      description="Assess your ability to communicate and interact effectively with others."
    />
  );
};
