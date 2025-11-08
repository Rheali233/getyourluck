/**
 * AI Service Proxy Routes
 * Centralized AI service endpoints for all test modules
 * Provides secure proxy to external AI services
 */

import { Hono } from 'hono';
import { psychologyAIRoutes } from './psychology';
import { relationshipAIRoutes } from './relationship';
import { careerAIRoutes } from './career';
import { learningAIRoutes } from './learning';
import { astrologyAIRoutes } from './astrology';
import { tarotAIRoutes } from './tarot';
import type { AppContext } from '../../types/env';

const aiRoutes = new Hono<AppContext>();

// Mount AI service routes
aiRoutes.route('/psychology', psychologyAIRoutes);
aiRoutes.route('/relationship', relationshipAIRoutes);
aiRoutes.route('/career', careerAIRoutes);
aiRoutes.route('/learning', learningAIRoutes);
aiRoutes.route('/astrology', astrologyAIRoutes);
aiRoutes.route('/tarot', tarotAIRoutes);

// AI service health check
aiRoutes.get('/health', async (c) => {
  return c.json({
    success: true,
    data: {
      status: 'healthy',
      services: ['psychology', 'relationship', 'career', 'learning', 'astrology', 'tarot'],
      timestamp: new Date().toISOString()
    }
  });
});

export { aiRoutes };
