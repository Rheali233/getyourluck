/**
 * Numerology Module Index
 * 命理分析模块导出文件
 */

// 组件导出
export { NumerologyTestContainer } from './components/NumerologyTestContainer';
export { NumerologyInputForm } from './components/NumerologyInputForm';
export { NumerologyResultDisplay } from './components/NumerologyResultDisplay';
export { NumerologyHomePage } from './components/NumerologyHomePage';
export { NumerologyAnalysisPage } from './components/NumerologyAnalysisPage';
export { BaZiAnalysisPage } from './components/BaZiAnalysisPage';
export { BaZiResultPage } from './components/BaZiResultPage';
export { ZodiacAnalysisPage } from './components/ZodiacAnalysisPage';
export { ZodiacResultPage } from './components/ZodiacResultPage';
export { NameAnalysisPage } from './components/NameAnalysisPage';
export { NameResultPage } from './components/NameResultPage';
export { ZiWeiAnalysisPage } from './components/ZiWeiAnalysisPage';
export { ZiWeiResultPage } from './components/ZiWeiResultPage';

// 状态管理导出
export { useNumerologyStore } from './stores/useNumerologyStore';

// 服务导出
export { numerologyService } from './services/numerologyService';

// 类型导出
export type {
  NumerologyBasicInfo,
  NumerologyAnalysis,
  NumerologyAnalysisType,
  NumerologySession,
  NumerologyTestState,
  NumerologyTestActions,
  NumerologyStore,
  BaZiInfo,
  FiveElementsAnalysis,
  ZodiacInfo,
  ZodiacFortune,
  NameAnalysis,
  ZiWeiChart,
  NumerologyAnalysisRequest,
  NumerologyAnalysisResponse,
  NumerologyAnalysisStep,
  NumerologyAnalysisConfig
} from './types';

// 常量导出
export {
  NUMEROLOGY_ANALYSIS_TYPES,
  NUMEROLOGY_ANALYSIS_STEPS,
  ZODIAC_ANIMALS,
  FIVE_ELEMENTS,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
} from './types';
