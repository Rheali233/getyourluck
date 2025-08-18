import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

// 安全配置接口
interface SecurityConfig {
  enableCors: boolean;
  enableRateLimit: boolean;
  enableXssProtection: boolean;
  enableCsrfProtection: boolean;
  enableHsts: boolean;
  enableContentSecurityPolicy: boolean;
  maxRequestSize: number;
  allowedOrigins: string[];
  rateLimitWindow: number;
  rateLimitMax: number;
}

// 默认安全配置
const defaultSecurityConfig: SecurityConfig = {
  enableCors: true,
  enableRateLimit: true,
  enableXssProtection: true,
  enableCsrfProtection: true,
  enableHsts: true,
  enableContentSecurityPolicy: true,
  maxRequestSize: 1024 * 1024, // 1MB
  allowedOrigins: ['https://getyourluck.com', 'https://www.getyourluck.com'],
  rateLimitWindow: 60 * 1000, // 1分钟
  rateLimitMax: 100 // 每分钟最多100个请求
};

// 速率限制存储
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// 安全中间件
export const securityMiddleware = (config: Partial<SecurityConfig> = {}) => {
  const finalConfig = { ...defaultSecurityConfig, ...config };

  return async (c: Context, next: Next) => {
    try {
      // 1. 请求大小限制
      if (finalConfig.maxRequestSize > 0) {
        const contentLength = parseInt(c.req.header('content-length') || '0');
        if (contentLength > finalConfig.maxRequestSize) {
          throw new HTTPException(413, { message: '请求体过大' });
        }
      }

      // 2. 速率限制
      if (finalConfig.enableRateLimit) {
        const clientIp = c.req.header('cf-connecting-ip') || 
                        c.req.header('x-forwarded-for') || 
                        'unknown';
        
        const now = Date.now();
        const key = `rate_limit:${clientIp}`;
        const current = rateLimitStore.get(key);

        if (current && now < current.resetTime) {
          if (current.count >= finalConfig.rateLimitMax) {
            throw new HTTPException(429, { message: '请求过于频繁，请稍后再试' });
          }
          current.count++;
        } else {
          rateLimitStore.set(key, {
            count: 1,
            resetTime: now + finalConfig.rateLimitWindow
          });
        }
      }

      // 3. XSS防护
      if (finalConfig.enableXssProtection) {
        c.header('X-XSS-Protection', '1; mode=block');
        c.header('X-Content-Type-Options', 'nosniff');
      }

      // 4. CSRF防护
      if (finalConfig.enableCsrfProtection) {
        const method = c.req.method;
        if (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
          const origin = c.req.header('origin');
          const referer = c.req.header('referer');
          
          if (origin && !finalConfig.allowedOrigins.includes(origin)) {
            throw new HTTPException(403, { message: 'CSRF保护：来源不被允许' });
          }
          
          if (referer && !finalConfig.allowedOrigins.some(origin => referer.startsWith(origin))) {
            throw new HTTPException(403, { message: 'CSRF保护：引用来源不被允许' });
          }
        }
      }

      // 5. HSTS
      if (finalConfig.enableHsts) {
        c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      }

      // 6. 内容安全策略
      if (finalConfig.enableContentSecurityPolicy) {
        const csp = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
          "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
          "img-src 'self' data: https:",
          "font-src 'self' https://cdn.jsdelivr.net",
          "connect-src 'self' https://api.getyourluck.com",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'"
        ].join('; ');
        
        c.header('Content-Security-Policy', csp);
      }

      // 7. CORS配置
      if (finalConfig.enableCors) {
        const origin = c.req.header('origin');
        if (origin && finalConfig.allowedOrigins.includes(origin)) {
          c.header('Access-Control-Allow-Origin', origin);
        }
        c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        c.header('Access-Control-Allow-Credentials', 'true');
        c.header('Access-Control-Max-Age', '86400');
      }

      // 8. 其他安全头
      c.header('X-Frame-Options', 'DENY');
      c.header('X-Download-Options', 'noopen');
      c.header('X-Permitted-Cross-Domain-Policies', 'none');
      c.header('Referrer-Policy', 'strict-origin-when-cross-origin');

      await next();
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, { message: '安全中间件错误' });
    }
  };
};

// 输入验证中间件
export const inputValidationMiddleware = () => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json().catch(() => null);
      
      if (body) {
        // 检查SQL注入
        const sqlInjectionPattern = /(\b(select|insert|update|delete|drop|create|alter|exec|execute|union|script|javascript|vbscript|onload|onerror|onclick)\b)/i;
        const bodyStr = JSON.stringify(body);
        
        if (sqlInjectionPattern.test(bodyStr)) {
          throw new HTTPException(400, { message: '检测到潜在的安全威胁' });
        }

        // 检查XSS攻击
        const xssPattern = /<script|javascript:|vbscript:|onload|onerror|onclick/i;
        if (xssPattern.test(bodyStr)) {
          throw new HTTPException(400, { message: '检测到潜在的XSS攻击' });
        }
      }

      await next();
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(400, { message: '输入验证失败' });
    }
  };
};

// 认证中间件
export const authMiddleware = () => {
  return async (c: Context, next: Next) => {
    try {
      const authHeader = c.req.header('authorization');
      
      if (!authHeader) {
        throw new HTTPException(401, { message: '缺少认证信息' });
      }

      // 验证JWT token格式
      if (!authHeader.startsWith('Bearer ')) {
        throw new HTTPException(401, { message: '认证格式错误' });
      }

      const token = authHeader.substring(7);
      
      // 这里应该验证JWT token的有效性
      // 暂时只做格式验证
      if (token.length < 10) {
        throw new HTTPException(401, { message: 'Token无效' });
      }

      await next();
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(401, { message: '认证失败' });
    }
  };
};

// 清理速率限制存储
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // 每分钟清理一次
