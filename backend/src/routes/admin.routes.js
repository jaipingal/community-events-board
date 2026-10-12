import { Router } from 'express';
import {
  createEvent,
  getAllEvents,
  updateEventStatus,
} from '../controllers/event.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares/validate.middleware.js';
import {
  adminListQuerySchema,
  createEventSchema,
  idParamSchema,
  statusSchema,
} from '../validators/event.validator.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/events', validateQuery(adminListQuerySchema), getAllEvents);
router.post('/events', validateBody(createEventSchema), createEvent);
router.patch(
  '/events/:id/status',
  validateParams(idParamSchema),
  validateBody(statusSchema),
  updateEventStatus,
);

export default router;
