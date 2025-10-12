/**
 * 环境配置管理
 * 支持不同环境的配置和错误处理策略
 */

export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test'
}

export interface EnvironmentConfig {
  environment: Environment;
  debug: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  errorHandling: {
    showStackTraces: boolean;
    logToConsole: boolean;
    sendToMonitoring: boolean;
    sendToLogging: boolean;
    rateLimitErrors: boolean;
  };
  security: {
    enableCORS: boolean;
    enableRateLimiting: boolean;
    enableInputValidation: boolean;
    enableOutputSanitization: boolean;
    maxRequestSize: number;
    allowedOrigins: string[];
  };
  performance: {
    enableCaching: boolean;
    enableCompression: boolean;
    enableLazyLoading: boolean;
    cacheTTL: number;
    maxCacheSize: number;
  };
  monitoring: {
    enableMetrics: boolean;
    enableTracing: boolean;
    enableHealthChecks: boolean;
    metricsInterval: number;
  };
}

// 默认配置
const defaultConfig: EnvironmentConfig = {
  environment: Environment.DEVELOPMENT,
  debug: true,
  logLevel: 'debug',
  errorHandling: {
    showStackTraces: true,
    logToConsole: true,
    sendToMonitoring: false,
    sendToLogging: false,
    rateLimitErrors: false,
  },
  security: {
    enableCORS: true,
    enableRateLimiting: false,
    enableInputValidation: true,
    enableOutputSanitization: true,
    maxRequestSize: 1024 * 1024, // 1MB
    allowedOrigins: ['*'],
  },
  performance: {
    enableCaching: true,
    enableCompression: false,
    enableLazyLoading: true,
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    maxCacheSize: 100,
  },
  monitoring: {
    enableMetrics: false,
    enableTracing: false,
    enableHealthChecks: true,
    metricsInterval: 60000, // 1 minute
  },
};

// 环境特定配置
const environmentConfigs: Record<Environment, Partial<EnvironmentConfig>> = {
  [Environment.DEVELOPMENT]: {
    environment: Environment.DEVELOPMENT,
    debug: true,
    logLevel: 'debug',
    errorHandling: {
      showStackTraces: true,
      logToConsole: true,
      sendToMonitoring: false,
      sendToLogging: false,
      rateLimitErrors: false,
    },
    security: {
      enableCORS: true,
      enableRateLimiting: false,
      enableInputValidation: true,
      enableOutputSanitization: false,
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      allowedOrigins: ['*'],
    },
    performance: {
      enableCaching: false,
      enableCompression: false,
      enableLazyLoading: false,
      cacheTTL: 0,
      maxCacheSize: 0,
    },
    monitoring: {
      enableMetrics: false,
      enableTracing: true,
      enableHealthChecks: true,
      metricsInterval: 30000, // 30 seconds
    },
  },
  [Environment.STAGING]: {
    environment: Environment.STAGING,
    debug: false,
    logLevel: 'info',
    errorHandling: {
      showStackTraces: false,
      logToConsole: true,
      sendToMonitoring: true,
      sendToLogging: true,
      rateLimitErrors: true,
    },
    security: {
      enableCORS: true,
      enableRateLimiting: true,
      enableInputValidation: true,
      enableOutputSanitization: true,
      maxRequestSize: 5 * 1024 * 1024, // 5MB
      allowedOrigins: ['https://staging.example.com'],
    },
    performance: {
      enableCaching: true,
      enableCompression: true,
      enableLazyLoading: true,
      cacheTTL: 10 * 60 * 1000, // 10 minutes
      maxCacheSize: 500,
    },
    monitoring: {
      enableMetrics: true,
      enableTracing: true,
      enableHealthChecks: true,
      metricsInterval: 60000, // 1 minute
    },
  },
  [Environment.PRODUCTION]: {
    environment: Environment.PRODUCTION,
    debug: false,
    logLevel: 'warn',
    errorHandling: {
      showStackTraces: false,
      logToConsole: false,
      sendToMonitoring: true,
      sendToLogging: true,
      rateLimitErrors: true,
    },
    security: {
      enableCORS: true,
      enableRateLimiting: true,
      enableInputValidation: true,
      enableOutputSanitization: true,
      maxRequestSize: 2 * 1024 * 1024, // 2MB
      allowedOrigins: ['https://example.com', 'https://www.example.com'],
    },
    performance: {
      enableCaching: true,
      enableCompression: true,
      enableLazyLoading: true,
      cacheTTL: 30 * 60 * 1000, // 30 minutes
      maxCacheSize: 1000,
    },
    monitoring: {
      enableMetrics: true,
      enableTracing: true,
      enableHealthChecks: true,
      metricsInterval: 300000, // 5 minutes
    },
  },
  [Environment.TEST]: {
    environment: Environment.TEST,
    debug: true,
    logLevel: 'error',
    errorHandling: {
      showStackTraces: false,
      logToConsole: false,
      sendToMonitoring: false,
      sendToLogging: false,
      rateLimitErrors: false,
    },
    security: {
      enableCORS: false,
      enableRateLimiting: false,
      enableInputValidation: false,
      enableOutputSanitization: false,
      maxRequestSize: 1024 * 1024, // 1MB
      allowedOrigins: [],
    },
    performance: {
      enableCaching: false,
      enableCompression: false,
      enableLazyLoading: false,
      cacheTTL: 0,
      maxCacheSize: 0,
    },
    monitoring: {
      enableMetrics: false,
      enableTracing: false,
      enableHealthChecks: false,
      metricsInterval: 0,
    },
  },
};

// 环境检测
export function detectEnvironment(): Environment {
  const env = (process.env as any)['NODE_ENV'] || (process.env as any)['ENVIRONMENT'] || 'development';
  
  switch (env.toLowerCase()) {
    case 'production':
      return Environment.PRODUCTION;
    case 'staging':
      return Environment.STAGING;
    case 'test':
      return Environment.TEST;
    case 'development':
    default:
      return Environment.DEVELOPMENT;
  }
}

// 获取环境配置
export function getEnvironmentConfig(): EnvironmentConfig {
  const currentEnv = detectEnvironment();
  const envConfig = environmentConfigs[currentEnv];
  
  return {
    ...defaultConfig,
    ...envConfig,
  };
}

// 配置验证
export function validateEnvironmentConfig(config: EnvironmentConfig): string[] {
  const errors: string[] = [];
  
  if (!Object.values(Environment).includes(config.environment)) {
    errors.push(`Invalid environment: ${config.environment}`);
  }
  
  if (config.security.maxRequestSize <= 0) {
    errors.push('maxRequestSize must be greater than 0');
  }
  
  if (config.performance.cacheTTL < 0) {
    errors.push('cacheTTL must be non-negative');
  }
  
  if (config.performance.maxCacheSize <= 0) {
    errors.push('maxCacheSize must be greater than 0');
  }
  
  if (config.monitoring.metricsInterval < 0) {
    errors.push('metricsInterval must be non-negative');
  }
  
  return errors;
}

// 环境检查工具
export const isDevelopment = () => detectEnvironment() === Environment.DEVELOPMENT;
export const isStaging = () => detectEnvironment() === Environment.STAGING;
export const isProduction = () => detectEnvironment() === Environment.PRODUCTION;
export const isTest = () => detectEnvironment() === Environment.TEST;

// 配置实例
export const config = getEnvironmentConfig();

// 验证配置
const configErrors = validateEnvironmentConfig(config);
if (configErrors.length > 0) {
  console.error('Environment configuration errors:', configErrors);
  throw new Error(`Invalid environment configuration: ${configErrors.join(', ')}`);
}
