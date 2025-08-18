import { Hono } from 'hono';
import { PrivacyService } from '../services/PrivacyService';
import { securityMiddleware, inputValidationMiddleware } from '../middleware/security';
const securityRoutes = new Hono();
// 应用安全中间件
securityRoutes.use('*', securityMiddleware());
securityRoutes.use('*', inputValidationMiddleware());
// 隐私保护相关路由
securityRoutes.post('/privacy/consent', async (c) => {
    try {
        const { sessionId, consentType, granted, ipAddress, userAgent } = await c.req.json();
        if (!sessionId || !consentType || typeof granted !== 'boolean') {
            return c.json({
                success: false,
                error: '缺少必要参数'
            }, 400);
        }
        if (!c.env) {
            return c.json({
                success: false,
                error: '环境配置不可用'
            }, 500);
        }
        const privacyService = new PrivacyService(c.env['DB']);
        await privacyService.recordUserConsent({
            sessionId,
            consentType: consentType,
            granted,
            timestamp: new Date().toISOString(),
            ipAddress,
            userAgent
        });
        return c.json({
            success: true,
            message: '用户同意已记录'
        });
    }
    catch (error) {
        console.error('记录用户同意失败:', error);
        return c.json({
            success: false,
            error: '记录用户同意失败'
        }, 500);
    }
});
// 获取用户同意状态
securityRoutes.get('/privacy/consent/:sessionId/:consentType', async (c) => {
    try {
        const { sessionId, consentType } = c.req.param();
        if (!sessionId || !consentType) {
            return c.json({
                success: false,
                error: '缺少必要参数'
            }, 400);
        }
        if (!c.env) {
            return c.json({
                success: false,
                error: '环境配置不可用'
            }, 500);
        }
        const privacyService = new PrivacyService(c.env['DB']);
        const hasConsent = await privacyService.getUserConsent(sessionId, consentType);
        return c.json({
            success: true,
            data: { hasConsent }
        });
    }
    catch (error) {
        console.error('获取用户同意状态失败:', error);
        return c.json({
            success: false,
            error: '获取用户同意状态失败'
        }, 500);
    }
});
// 检查GDPR合规性
securityRoutes.get('/privacy/gdpr-compliance/:sessionId', async (c) => {
    try {
        const { sessionId } = c.req.param();
        if (!sessionId) {
            return c.json({
                success: false,
                error: '缺少sessionId参数'
            }, 400);
        }
        if (!c.env) {
            return c.json({
                success: false,
                error: '环境配置不可用'
            }, 500);
        }
        const privacyService = new PrivacyService(c.env['DB']);
        const compliance = await privacyService.checkGdprCompliance(sessionId);
        return c.json({
            success: true,
            data: compliance
        });
    }
    catch (error) {
        console.error('检查GDPR合规性失败:', error);
        return c.json({
            success: false,
            error: '检查GDPR合规性失败'
        }, 500);
    }
});
// 获取隐私报告
securityRoutes.get('/privacy/report/:sessionId', async (c) => {
    try {
        const { sessionId } = c.req.param();
        if (!sessionId) {
            return c.json({
                success: false,
                error: '缺少sessionId参数'
            }, 400);
        }
        if (!c.env) {
            return c.json({
                success: false,
                error: '环境配置不可用'
            }, 500);
        }
        const privacyService = new PrivacyService(c.env['DB']);
        const report = await privacyService.getPrivacyReport(sessionId);
        return c.json({
            success: true,
            data: report
        });
    }
    catch (error) {
        console.error('获取隐私报告失败:', error);
        return c.json({
            success: false,
            error: '获取隐私报告失败'
        }, 500);
    }
});
// 导出用户数据（数据可携带性）
securityRoutes.get('/privacy/export/:sessionId', async (c) => {
    try {
        const { sessionId } = c.req.param();
        if (!sessionId) {
            return c.json({
                success: false,
                error: '缺少sessionId参数'
            }, 400);
        }
        if (!c.env) {
            return c.json({
                success: false,
                error: '环境配置不可用'
            }, 500);
        }
        const privacyService = new PrivacyService(c.env['DB']);
        const userData = await privacyService.exportUserData(sessionId);
        return c.json({
            success: true,
            data: userData
        });
    }
    catch (error) {
        console.error('导出用户数据失败:', error);
        return c.json({
            success: false,
            error: '导出用户数据失败'
        }, 500);
    }
});
// 实现被遗忘权
securityRoutes.delete('/privacy/forget/:sessionId', async (c) => {
    try {
        const { sessionId } = c.req.param();
        if (!sessionId) {
            return c.json({
                success: false,
                error: '缺少sessionId参数'
            }, 400);
        }
        if (!c.env) {
            return c.json({
                success: false,
                error: '环境配置不可用'
            }, 500);
        }
        const privacyService = new PrivacyService(c.env['DB']);
        await privacyService.implementRightToBeForgotten(sessionId);
        return c.json({
            success: true,
            message: '用户数据已删除'
        });
    }
    catch (error) {
        console.error('实现被遗忘权失败:', error);
        return c.json({
            success: false,
            error: '删除用户数据失败'
        }, 500);
    }
});
// 匿名化用户数据
securityRoutes.post('/privacy/anonymize/:sessionId', async (c) => {
    try {
        const { sessionId } = c.req.param();
        const options = await c.req.json();
        if (!sessionId) {
            return c.json({
                success: false,
                error: '缺少sessionId参数'
            }, 400);
        }
        if (!c.env) {
            return c.json({
                success: false,
                error: '环境配置不可用'
            }, 500);
        }
        const privacyService = new PrivacyService(c.env['DB']);
        await privacyService.anonymizeUserData(sessionId, options);
        return c.json({
            success: true,
            message: '用户数据已匿名化'
        });
    }
    catch (error) {
        console.error('匿名化用户数据失败:', error);
        return c.json({
            success: false,
            error: '匿名化用户数据失败'
        }, 500);
    }
});
// 清理过期数据
securityRoutes.post('/privacy/cleanup', async (c) => {
    try {
        if (!c.env) {
            return c.json({
                success: false,
                error: '环境配置不可用'
            }, 500);
        }
        const privacyService = new PrivacyService(c.env['DB']);
        const result = await privacyService.cleanupExpiredData();
        return c.json({
            success: true,
            data: result,
            message: '过期数据清理完成'
        });
    }
    catch (error) {
        console.error('清理过期数据失败:', error);
        return c.json({
            success: false,
            error: '清理过期数据失败'
        }, 500);
    }
});
// 安全状态检查
securityRoutes.get('/security/status', async (c) => {
    try {
        const securityStatus = {
            timestamp: new Date().toISOString(),
            securityHeaders: {
                xssProtection: true,
                csrfProtection: true,
                hsts: true,
                contentSecurityPolicy: true,
                frameOptions: true
            },
            rateLimit: {
                enabled: true,
                window: '1分钟',
                maxRequests: 100
            },
            cors: {
                enabled: true,
                allowedOrigins: ['https://getyourluck.com', 'https://www.getyourluck.com']
            },
            inputValidation: {
                enabled: true,
                sqlInjectionProtection: true,
                xssProtection: true
            }
        };
        return c.json({
            success: true,
            data: securityStatus
        });
    }
    catch (error) {
        console.error('获取安全状态失败:', error);
        return c.json({
            success: false,
            error: '获取安全状态失败'
        }, 500);
    }
});
// 安全测试端点
securityRoutes.post('/security/test', async (c) => {
    try {
        const testData = await c.req.json();
        // 测试输入验证
        if (testData.testType === 'sql_injection') {
            const sqlPattern = /(\b(select|insert|update|delete|drop|create|alter|exec|execute|union)\b)/i;
            if (sqlPattern.test(JSON.stringify(testData.data))) {
                return c.json({
                    success: false,
                    error: '检测到SQL注入攻击'
                }, 400);
            }
        }
        if (testData.testType === 'xss') {
            const xssPattern = /<script|javascript:|vbscript:|onload|onerror|onclick/i;
            if (xssPattern.test(JSON.stringify(testData.data))) {
                return c.json({
                    success: false,
                    error: '检测到XSS攻击'
                }, 400);
            }
        }
        return c.json({
            success: true,
            message: '安全测试通过'
        });
    }
    catch (error) {
        console.error('安全测试失败:', error);
        return c.json({
            success: false,
            error: '安全测试失败'
        }, 500);
    }
});
export default securityRoutes;
//# sourceMappingURL=security.js.map