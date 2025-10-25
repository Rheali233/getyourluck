/**
 * 环境配置管理
 * 管理不同环境的API端点、CDN地址等配置
 */

export interface EnvironmentConfig {
  API_BASE_URL: string;
  CDN_BASE_URL: string;
  ENVIRONMENT: 'development' | 'production' | 'staging';
  PAGES_PROJECT_NAME: string;
  PAGES_DEPLOYMENT_URL: string;
  PAGES_BRANCH_ALIAS_URL: string;
  GOOGLE_ANALYTICS_ID?: string;
}

// 运行时动态判断环境配置
const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = (import.meta as any).env;
  
  // 运行时根据域名判断环境（优先级最高）
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // 调试信息
    console.log('Environment detection - hostname:', hostname);
    console.log('Environment detection - window.location.hostname:', window.location.hostname);
    
    if (hostname === 'selfatlas.net' || hostname === 'www.selfatlas.net') {
      console.log('Detected production environment for selfatlas.net');
      return {
        API_BASE_URL: 'https://selfatlas-backend-prod.cyberlina.workers.dev',
        CDN_BASE_URL: 'https://cdn.selfatlas.net',
        ENVIRONMENT: 'production',
        PAGES_PROJECT_NAME: 'getyourluck-testing-platform',
        PAGES_DEPLOYMENT_URL: 'https://4b4482a3.getyourluck-testing-platform.pages.dev',
        PAGES_BRANCH_ALIAS_URL: 'https://feature-test-preview.getyourluck-testing-platform.pages.dev',
        GOOGLE_ANALYTICS_ID: env.VITE_GOOGLE_ANALYTICS_ID
      };
    }
    
    if (hostname.includes('pages.dev')) {
      return {
        API_BASE_URL: 'https://selfatlas-backend-staging.cyberlina.workers.dev',
        CDN_BASE_URL: 'https://selfatlas-backend-staging.cyberlina.workers.dev',
        ENVIRONMENT: 'staging',
        PAGES_PROJECT_NAME: 'getyourluck-testing-platform',
        PAGES_DEPLOYMENT_URL: 'https://4b4482a3.getyourluck-testing-platform.pages.dev',
        PAGES_BRANCH_ALIAS_URL: 'https://feature-test-preview.getyourluck-testing-platform.pages.dev',
        GOOGLE_ANALYTICS_ID: env.VITE_GOOGLE_ANALYTICS_ID
      };
    }
    
    if (hostname.includes('localhost')) {
      return {
        API_BASE_URL: 'http://localhost:8787',
        CDN_BASE_URL: 'http://localhost:8787',
        ENVIRONMENT: 'development',
        PAGES_PROJECT_NAME: 'getyourluck-testing-platform',
        PAGES_DEPLOYMENT_URL: 'https://4b4482a3.getyourluck-testing-platform.pages.dev',
        PAGES_BRANCH_ALIAS_URL: 'https://feature-test-preview.getyourluck-testing-platform.pages.dev',
        GOOGLE_ANALYTICS_ID: env.VITE_GOOGLE_ANALYTICS_ID
      };
    }
  }
  
  // 回退到环境变量（构建时设置）
  if (env.VITE_API_BASE_URL) {
    return {
      API_BASE_URL: env.VITE_API_BASE_URL,
      CDN_BASE_URL: env.VITE_CDN_BASE_URL || env.VITE_API_BASE_URL,
      ENVIRONMENT: (env.VITE_ENVIRONMENT as 'development' | 'production' | 'staging') || 'staging',
      PAGES_PROJECT_NAME: env.VITE_PAGES_PROJECT_NAME || 'getyourluck-testing-platform',
      PAGES_DEPLOYMENT_URL: 'https://4b4482a3.getyourluck-testing-platform.pages.dev',
      PAGES_BRANCH_ALIAS_URL: 'https://feature-test-preview.getyourluck-testing-platform.pages.dev',
      GOOGLE_ANALYTICS_ID: env.VITE_GOOGLE_ANALYTICS_ID
    };
  }
  
  // 默认返回staging环境
  return {
    API_BASE_URL: 'https://selfatlas-backend-staging.cyberlina.workers.dev',
    CDN_BASE_URL: 'https://selfatlas-backend-staging.cyberlina.workers.dev',
    ENVIRONMENT: 'staging',
    PAGES_PROJECT_NAME: 'getyourluck-testing-platform',
    PAGES_DEPLOYMENT_URL: 'https://4b4482a3.getyourluck-testing-platform.pages.dev',
    PAGES_BRANCH_ALIAS_URL: 'https://feature-test-preview.getyourluck-testing-platform.pages.dev',
    GOOGLE_ANALYTICS_ID: env.VITE_GOOGLE_ANALYTICS_ID
  };
};

// 调试信息 - 在开发环境和staging环境中启用
if (typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname.includes('pages.dev'))) {
  // Debug info removed for production
}

// 环境工具函数
export const getCurrentEnvironment = (): string => {
  const config = getEnvironmentConfig();
  return config.ENVIRONMENT;
};

export const isProduction = (): boolean => {
  const config = getEnvironmentConfig();
  return config.ENVIRONMENT === 'production';
};

export const isDevelopment = (): boolean => {
  const config = getEnvironmentConfig();
  return config.ENVIRONMENT === 'development';
};

export const isStaging = (): boolean => {
  const config = getEnvironmentConfig();
  return config.ENVIRONMENT === 'staging';
};

export const getApiBaseUrl = (): string => {
  // 每次调用都重新判断环境，确保运行时动态判断
  const config = getEnvironmentConfig();
  return config.API_BASE_URL;
};

export const getCdnBaseUrl = (): string => {
  const config = getEnvironmentConfig();
  return config.CDN_BASE_URL;
};

export const getPagesDeploymentUrl = (): string => {
  const config = getEnvironmentConfig();
  return config.PAGES_DEPLOYMENT_URL;
};

export const getPagesBranchAliasUrl = (): string => {
  const config = getEnvironmentConfig();
  return config.PAGES_BRANCH_ALIAS_URL;
};

export const getGoogleAnalyticsId = (): string | undefined => {
  const config = getEnvironmentConfig();
  return config.GOOGLE_ANALYTICS_ID;
};
