/**
 * Love Style Test Page
 * Complete test interface for love style assessment
 */

import React from 'react';
import { TestContainer } from '../../modules/relationship/components';
import { TestType } from '../../modules/relationship/types';

export const LoveStyleTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <TestContainer
        testType={TestType.LOVE_STYLE}
        testId="love-style-test-page"
        className="w-full"
      />
    </div>
  );
};
