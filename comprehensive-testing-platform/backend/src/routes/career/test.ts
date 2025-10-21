/**
 * Career Module Test Route
 * Simple test route to diagnose issues
 */

import { Hono } from 'hono';
import type { AppContext } from '../../types/env';

const careerTestRouter = new Hono<AppContext>();

// Simple test endpoint
careerTestRouter.get('/', async (c) => {
  try {
    // Career test route accessed - logged for monitoring
    
    return c.json({
      success: true,
      data: {
        message: 'Career test route is working',
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID')
      }
    });
  } catch (error) {
    // Error handling for production - logged for monitoring service
    return c.json({
      success: false,
      error: 'Test route failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

export { careerTestRouter };
