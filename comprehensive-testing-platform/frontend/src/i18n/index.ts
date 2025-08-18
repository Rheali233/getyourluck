/**
 * 多语言国际化配置
 * 配置react-i18next框架和语言包管理
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 中文语言包
import zhCN from './locales/zh-CN.json';
import zhCNHomepage from './locales/zh-CN/homepage.json';
import zhCNCommon from './locales/zh-CN/common.json';
import zhCNNavigation from './locales/zh-CN/navigation.json';
import zhCNFooter from './locales/zh-CN/footer.json';

// 英文语言包
import enUS from './locales/en-US.json';
import enUSHomepage from './locales/en-US/homepage.json';
import enUSCommon from './locales/en-US/common.json';
import enUSNavigation from './locales/en-US/navigation.json';
import enUSFooter from './locales/en-US/footer.json';

// 语言资源
const resources = {
  'zh-CN': {
    translation: {
      ...zhCN,
      homepage: zhCNHomepage,
      common: zhCNCommon,
      navigation: zhCNNavigation,
      footer: zhCNFooter,
    },
  },
  'en-US': {
    translation: {
      ...enUS,
      homepage: enUSHomepage,
      common: enUSCommon,
      navigation: enUSNavigation,
      footer: enUSFooter,
    },
  },
};

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
];

// 默认语言
export const defaultLanguage = 'zh-CN';

// 语言检测配置
const languageDetectorOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  cookieExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  cookieSecure: true,
};

// 初始化i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    debug: process.env['NODE_ENV'] === 'development',
    
    // 语言检测配置
    detection: languageDetectorOptions,
    
    // 插值配置
    interpolation: {
      escapeValue: false,
    },
    
    // 命名空间配置
    ns: ['translation', 'homepage', 'common', 'navigation', 'footer'],
    defaultNS: 'translation',
    
    // 加载配置
    load: 'languageOnly',
    
    // 缓存配置
    cache: {
      enabled: true,
      expirationTime: 7 * 24 * 60 * 60 * 1000, // 7天
    },
    
    // 后端配置（如果需要从API加载语言包）
    backend: {
      loadPath: '/api/i18n/{{lng}}/{{ns}}',
      addPath: '/api/i18n/add/{{lng}}/{{ns}}',
      crossDomain: true,
      withCredentials: true,
    },
  });

// 语言切换函数
export const changeLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
    
    // 更新HTML lang属性
    document.documentElement.lang = language;
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    
    return true;
  } catch (error) {
    console.error('语言切换失败:', error);
    return false;
  }
};

// 获取当前语言
export const getCurrentLanguage = (): string => {
  return i18n.language || defaultLanguage;
};

// 获取语言显示名称
export const getLanguageDisplayName = (languageCode: string): string => {
  const language = supportedLanguages.find(lang => lang.code === languageCode);
  return language ? language.name : languageCode;
};

// 获取语言国旗图标
export const getLanguageFlag = (languageCode: string): string => {
  const language = supportedLanguages.find(lang => lang.code === languageCode);
  return language ? language.flag : '🌐';
};

// 检查语言是否支持
export const isLanguageSupported = (languageCode: string): boolean => {
  return supportedLanguages.some(lang => lang.code === languageCode);
};

// 获取用户首选语言
export const getUserPreferredLanguage = (): string => {
  // 从localStorage获取
  const storedLanguage = localStorage.getItem('i18nextLng');
  if (storedLanguage && isLanguageSupported(storedLanguage)) {
    return storedLanguage;
  }
  
  // 从navigator获取
  const navigatorLanguage = navigator.language;
  if (navigatorLanguage && isLanguageSupported(navigatorLanguage)) {
    return navigatorLanguage;
  }
  
  // 从navigator.languages获取
  for (const lang of navigator.languages) {
    const languageCode = lang.split('-')[0] === 'zh' ? 'zh-CN' : 'en-US';
    if (isLanguageSupported(languageCode)) {
      return languageCode;
    }
  }
  
  return defaultLanguage;
};

// 初始化用户语言
export const initializeUserLanguage = (): void => {
  const preferredLanguage = getUserPreferredLanguage();
  if (preferredLanguage !== getCurrentLanguage()) {
    changeLanguage(preferredLanguage);
  }
};

// 导出i18n实例
export default i18n;
