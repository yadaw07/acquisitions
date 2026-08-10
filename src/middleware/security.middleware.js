import aj from '#config/arcjet.js';

import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const LIMITS = {
  admin: 20,
  user: 10,
  guest: 5,
};

export const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    const limit = LIMITS[role] ?? LIMITS.guest;
    const message = `Request limit exceeded (${limit} per minute) for role: ${role}. Slow down.`;

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        logger.warn('Bot request blocked', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
        });
        return res.status(403).json({ error: 'Bot traffic denied' });
      }

      if (decision.reason.isRateLimit()) {
        logger.warn('Rate limit exceeded', {
          ip: req.ip,
          role,
          path: req.path,
        });
        return res.status(429).json({ error: 'Too many requests', message });
      }

      if (decision.reason.isShield()) {
        logger.warn('Request blocked by security policy', {
          ip: req.ip,
          role,
          path: req.path,
        });
        return res
          .status(429)
          .json({ error: 'Shield blocked request', message });
      }

      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  } catch (e) {
    logger.error('Arcjet middleware error: ', e);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong with security middleware',
    });
  }
};
