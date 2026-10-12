import { Router } from 'express';
import {
  getFavoriteCategories,
  getFeed,
  getReminders,
  saveFavoriteCategories,
} from '../controllers/me.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateBody, validateQuery } from '../middlewares/validate.middleware.js';
import {
  favoriteCategoriesSchema,
  feedQuerySchema,
} from '../validators/event.validator.js';

const router = Router();

router.use(authenticate);

router.get('/favorite-categories', getFavoriteCategories);
router.put(
  '/favorite-categories',
  validateBody(favoriteCategoriesSchema),
  saveFavoriteCategories,
);
router.get('/reminders', getReminders);
router.get('/feed', validateQuery(feedQuerySchema), getFeed);

export default router;
