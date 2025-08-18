import { Context, Next } from 'hono';
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
export declare const securityMiddleware: (config?: Partial<SecurityConfig>) => (c: Context, next: Next) => Promise<void>;
export declare const inputValidationMiddleware: () => (c: Context, next: Next) => Promise<void>;
export declare const authMiddleware: () => (c: Context, next: Next) => Promise<void>;
export {};
//# sourceMappingURL=security.d.ts.map