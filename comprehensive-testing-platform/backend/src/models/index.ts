/**
 * 数据模型统一导出
 * 遵循统一开发标准的模块导出规范
 */

// 基础模型
export { BaseModel } from "./BaseModel";

// 核心系统模型
export { TestTypeModel } from "./TestTypeModel";
export { TestSessionModel } from "./TestSessionModel";
export { BlogArticleModel } from "./BlogArticleModel";
export { UserFeedbackModel } from "./UserFeedbackModel";
export { AnalyticsEventModel } from "./AnalyticsEventModel";

// 模块专用会话模型
export { PsychologySessionModel } from "./PsychologySessionModel";
export { PsychologyQuestionBankModel } from "./PsychologyQuestionBankModel";
export { AstrologySessionModel } from "./AstrologySessionModel";
export { TarotSessionModel } from "./TarotSessionModel";
export { CareerSessionModel } from "./CareerSessionModel";
export { LearningSessionModel } from "./LearningSessionModel";
export { RelationshipSessionModel } from "./RelationshipSessionModel";
export { NumerologySessionModel } from "./NumerologySessionModel";

// 首页模块模型
export { HomepageModuleModel } from "./HomepageModuleModel";
export { HomepageConfigModel } from "./HomepageConfigModel";

// 搜索功能模型
export { SearchIndexModel } from "./SearchIndexModel";

// 用户偏好设置模型
export { UserPreferencesModel } from "./UserPreferencesModel";

// 类型导出
export type { TestType, CreateTestTypeData } from "./TestTypeModel";
export type { TestSession, CreateTestSessionData } from "./TestSessionModel";
export type { BlogArticle, CreateBlogArticleData } from "./BlogArticleModel";
export type { UserFeedback, CreateUserFeedbackData } from "./UserFeedbackModel";
export type { AnalyticsEvent, CreateAnalyticsEventData } from "./AnalyticsEventModel";

export type { PsychologySessionData, CreatePsychologySessionData } from "./PsychologySessionModel";
export type { 
  PsychologyQuestionCategoryData, 
  PsychologyQuestionData, 
  PsychologyQuestionOptionData, 
  PsychologyQuestionConfigData, 
  PsychologyQuestionVersionData,
  CreatePsychologyQuestionCategoryData,
  CreatePsychologyQuestionData,
  CreatePsychologyQuestionOptionData,
  CreatePsychologyQuestionConfigData,
  CreatePsychologyQuestionVersionData
} from "./PsychologyQuestionBankModel";
export type { AstrologySessionData, CreateAstrologySessionData } from "./AstrologySessionModel";
export type { TarotSessionData, CreateTarotSessionData, TarotCard } from "./TarotSessionModel";
export type { CareerSessionData, CreateCareerSessionData } from "./CareerSessionModel";
export type { LearningSessionData, CreateLearningSessionData } from "./LearningSessionModel";
export type { RelationshipSessionData, CreateRelationshipSessionData } from "./RelationshipSessionModel";
export type { NumerologySessionData, CreateNumerologySessionData, NumerologyChart } from "./NumerologySessionModel";

// 首页模块类型导出
export type { HomepageConfigData } from "./HomepageConfigModel";

// 搜索功能类型导出
export type { SearchIndexData, SearchResult } from "./SearchIndexModel";

// 用户偏好设置类型导出
export type { UserPreferencesData, CookiesConsentData } from "./UserPreferencesModel";