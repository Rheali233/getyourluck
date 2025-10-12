import React from 'react';
import { RelationshipGenericTestPage } from './RelationshipGenericTestPage';

export const LoveLanguageTestPage: React.FC = () => {
  return (
    <RelationshipGenericTestPage 
      testType="love_language"
      title="Love Language Test"
      description="Discover how you prefer to give and receive love in relationships."
    />
  );
};
