/**
 * Career Module Test Route
 * Simple test route to diagnose issues
 */

import { Hono } from 'hono';
import type { AppContext } from '../../types/env';

const testRouter = new Hono<AppContext>();

// Simple test endpoint
testRouter.get('/', async (c) => {
  try {
    console.log('🧪 Career test route accessed');
    
    return c.json({
      success: true,
      data: {
        message: 'Career test route is working',
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID')
      }
    });
  } catch (error) {
    console.error('Career test route error:', error);
    return c.json({
      success: false,
      error: 'Test route failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

export default testRouter;
