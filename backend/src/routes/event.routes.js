import { Router } from 'express';
import { getEvents, getCities, getEvent } from '../controllers/event.controller.js';
import { validateParams, validateQuery } from '../middlewares/validate.middleware.js';
import { idParamSchema, listEventsQuerySchema } from '../validators/event.validator.js';

const router = Router();

router.get('/', validateQuery(listEventsQuerySchema), getEvents);
router.get('/cities', getCities);
router.get('/:id', validateParams(idParamSchema), getEvent);

export default router;
