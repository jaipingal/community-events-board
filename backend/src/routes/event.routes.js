import { Router } from 'express';
import { getEvents, getCities, getEvent } from '../controllers/event.controller.js';
import { getCardDesign, saveCardDesign } from '../controllers/cardDesign.controller.js';
import {
  disableReminder,
  enableReminder,
  getReminder,
} from '../controllers/reminder.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares/validate.middleware.js';
import { cardDesignSchema } from '../validators/cardDesign.validator.js';
import { idParamSchema, listEventsQuerySchema } from '../validators/event.validator.js';

const router = Router();

router.get('/', validateQuery(listEventsQuerySchema), getEvents);
router.get('/cities', getCities);
router.get('/:id', validateParams(idParamSchema), getEvent);

router.get('/:id/reminder', authenticate, validateParams(idParamSchema), getReminder);
router.put('/:id/reminder', authenticate, validateParams(idParamSchema), enableReminder);
router.delete('/:id/reminder', authenticate, validateParams(idParamSchema), disableReminder);

router.get('/:id/card-design', authenticate, validateParams(idParamSchema), getCardDesign);
router.put(
  '/:id/card-design',
  authenticate,
  validateParams(idParamSchema),
  validateBody(cardDesignSchema),
  saveCardDesign,
);

export default router;
