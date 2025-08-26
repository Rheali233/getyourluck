/**
 * 主应用组件
 * 遵循统一开发标准的应用架构
 */

import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Homepage } from '@/modules/homepage/components/Homepage';
import { BlogPage } from '@/pages/BlogPage/BlogPage';
import { TestPages } from '@/pages/TestPages/TestPages';
import { ResultPages } from '@/pages/ResultPages/ResultPages';
import { ComponentShowcase } from '@/pages/ComponentShowcase';
import { PsychologyHomePage } from '@/modules/psychology/components/PsychologyHomePage';
import { TestContainer } from '@/modules/psychology/components/TestContainer';
import { RelationshipHomePage } from '@/modules/relationship/components/RelationshipHomePage';
import { LoveLanguageTestPage } from '@/pages/RelationshipPages/LoveLanguageTestPage';
import { LoveStyleTestPage } from '@/pages/RelationshipPages/LoveStyleTestPage';
import { InterpersonalTestPage } from '@/pages/RelationshipPages/InterpersonalTestPage';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/tests/*" element={<TestPages />} />
        <Route path="/psychology" element={<PsychologyHomePage />} />
        <Route path="/psychology/mbti" element={<TestContainer testType="mbti" />} />
        <Route path="/psychology/phq9" element={<TestContainer testType="phq9" />} />
        <Route path="/psychology/eq" element={<TestContainer testType="eq" />} />
        <Route path="/psychology/happiness" element={<TestContainer testType="happiness" />} />
        
        {/* Other test module routes */}
        <Route path="/astrology" element={<div className="min-h-screen bg-blue-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-gray-900 mb-4">Astrology Analysis Module</h1><p className="text-gray-600">This module is under development...</p></div></div>} />
        <Route path="/tarot" element={<div className="min-h-screen bg-blue-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-gray-900 mb-4">Tarot Reading Module</h1><p className="text-gray-600">This module is under development...</p></div></div>} />
        <Route path="/career" element={<div className="min-h-screen bg-blue-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-gray-900 mb-4">Career Planning Module</h1><p className="text-gray-600">This module is under development...</p></div></div>} />
        <Route path="/learning" element={<div className="min-h-screen bg-blue-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-gray-900 mb-4">Learning Ability Module</h1><p className="text-gray-600">This module is under development...</p></div></div>} />
        <Route path="/relationship" element={<RelationshipHomePage />} />
        <Route path="/relationship/love_language" element={<LoveLanguageTestPage />} />
        <Route path="/relationship/love_style" element={<LoveStyleTestPage />} />
        <Route path="/relationship/interpersonal" element={<InterpersonalTestPage />} />
        
        <Route path="/results/*" element={<ResultPages />} />
        <Route path="/components" element={<ComponentShowcase />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;