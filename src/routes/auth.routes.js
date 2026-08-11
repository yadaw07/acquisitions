import express from 'express';

import { signup, signin, signout } from '#controllers/auth.controller.js';
import { securityMiddleware } from '#middleware/security.middleware.js';

const router = express.Router();

router.use(securityMiddleware);

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/sign-out', signout);

export default router;
