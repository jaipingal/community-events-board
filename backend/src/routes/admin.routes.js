import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate, requireAdmin);

export default router;
