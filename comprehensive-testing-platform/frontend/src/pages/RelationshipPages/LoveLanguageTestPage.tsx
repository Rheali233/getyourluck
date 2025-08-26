/**
 * Love Language Test Page
 * Complete test interface for love language assessment
 */

import React from 'react';
import { TestContainer } from '../../modules/relationship/components';
import { TestType } from '../../modules/relationship/types';

export const LoveLanguageTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <TestContainer
        testType={TestType.LOVE_LANGUAGE}
        testId="love-language-test-page"
        className="w-full"
      />
    </div>
  );
};
