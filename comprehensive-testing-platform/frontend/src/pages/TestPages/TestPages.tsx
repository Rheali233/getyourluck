/**
 * 测试页面路由组件
 * 遵循统一开发标准的页面组件规范
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { Card } from '@/components/ui';
import { PsychologyHomePage } from '@/modules/psychology/components/PsychologyHomePage';
import { RelationshipHomePage } from '@/modules/relationship/components/RelationshipHomePage';

interface TestPagesProps extends BaseComponentProps {}

export const TestPages: React.FC<TestPagesProps> = ({
  className,
  testId = 'test-pages',
  ...props
}) => {
  return (
    <div 
      className={className}
      data-testid={testId}
      {...props}
    >
      <Routes>
        <Route path="/" element={<TestCenter />} />
        <Route path="/psychology/*" element={<PsychologyHomePage />} />
        <Route path="/astrology/*" element={<div>Astrology Analysis Module</div>} />
        <Route path="/tarot/*" element={<div>Tarot Reading Module</div>} />
        <Route path="/career/*" element={<div>Career Development Module</div>} />
        <Route path="/learning/*" element={<div>Learning Ability Module</div>} />
        <Route path="/relationship/*" element={<RelationshipHomePage />} />
        <Route path="/numerology/*" element={<div>Numerology Analysis Module</div>} />
      </Routes>
    </div>
  );
};

const TestCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Center</h1>
          <p className="text-xl text-gray-600">Choose the test type you're interested in</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Psychology Test Module */}
          <Card title="Psychology Tests" description="Personality Analysis & Psychological Assessment">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">🧠</span>
              </div>
              <h3 className="font-semibold mb-2">Psychology Tests</h3>
              <p className="text-sm text-gray-600">Personality Analysis & Psychological Assessment</p>
            </div>
          </Card>
          
          {/* Other test modules will be implemented in future tasks */}
        </div>
      </div>
    </div>
  );
};