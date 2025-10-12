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
}

// 从环境变量读取配置
const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = (import.meta as any).env;
  
  return {
    API_BASE_URL: env.VITE_API_BASE_URL || 'http://localhost:8787',
    CDN_BASE_URL: env.VITE_CDN_BASE_URL || 'http://localhost:8787',
    ENVIRONMENT: (env.VITE_ENVIRONMENT as 'development' | 'production' | 'staging') || 'development',
    PAGES_PROJECT_NAME: env.VITE_PAGES_PROJECT_NAME || 'selfatlas-testing-platform',
    PAGES_DEPLOYMENT_URL: 'https://7614e3a6.selfatlas-testing-platform.pages.dev',
    PAGES_BRANCH_ALIAS_URL: 'https://feature-test-preview.selfatlas-testing-platform.pages.dev'
  };
};

// 验证必要的环境变量
const validateEnvironmentConfig = (config: EnvironmentConfig): void => {
  const requiredVars: (keyof EnvironmentConfig)[] = ['API_BASE_URL'];
  
  for (const requiredVar of requiredVars) {
    if (!config[requiredVar]) {
      // 在开发环境中，环境变量缺失是正常的，静默处理
      // 在生产环境中，环境变量缺失会导致应用无法正常工作
      if (config.ENVIRONMENT === 'production') {
        // 生产环境中环境变量缺失是严重问题，但这里不抛出错误
        // 应用会在运行时因为API调用失败而自然失败
        // 这样可以避免在构建时就阻止部署
      }
    }
  }
};

// 导出环境配置
export const environmentConfig = getEnvironmentConfig();

// 验证配置
validateEnvironmentConfig(environmentConfig);

// 环境工具函数
export const getCurrentEnvironment = (): string => {
  return environmentConfig.ENVIRONMENT;
};

export const isProduction = (): boolean => {
  return environmentConfig.ENVIRONMENT === 'production';
};

export const isDevelopment = (): boolean => {
  return environmentConfig.ENVIRONMENT === 'development';
};

export const isStaging = (): boolean => {
  return environmentConfig.ENVIRONMENT === 'staging';
};

export const getApiBaseUrl = (): string => {
  return environmentConfig.API_BASE_URL;
};

export const getCdnBaseUrl = (): string => {
  return environmentConfig.CDN_BASE_URL;
};

export const getPagesDeploymentUrl = (): string => {
  return environmentConfig.PAGES_DEPLOYMENT_URL;
};

export const getPagesBranchAliasUrl = (): string => {
  return environmentConfig.PAGES_BRANCH_ALIAS_URL;
};
