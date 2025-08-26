/**
 * Interpersonal Skills Test Page
 * Complete test interface for interpersonal skills assessment
 */

import React from 'react';
import { TestContainer } from '../../modules/relationship/components';
import { TestType } from '../../modules/relationship/types';

export const InterpersonalTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TestContainer
        testType={TestType.INTERPERSONAL}
        testId="interpersonal-test-page"
        className="w-full"
      />
    </div>
  );
};
