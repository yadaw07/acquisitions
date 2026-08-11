import logger from '#config/logger.js';

import { cookies } from '#utils/cookies.js';
import { jwttoken } from '#utils/jwt.js';

export const authenticate = (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwttoken.verify(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (e) {
    logger.warn('Authentication failed', { error: e.message, path: req.path });
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// admin-only outright
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};
