import * as eventService from '../services/event.service.js';
import * as preferenceService from '../services/preference.service.js';
import * as reminderService from '../services/reminder.service.js';

export const getFavoriteCategories = async (req, res) => {
  const categories = await preferenceService.getFavoriteCategories(req.user.id);
  res.json({ categories });
};

export const saveFavoriteCategories = async (req, res) => {
  const categories = await preferenceService.replaceFavoriteCategories(
    req.user.id,
    req.body.categories,
  );
  res.json({ categories });
};

export const getReminders = async (req, res) => {
  const eventIds = await reminderService.listReminderEventIds(req.user.id);
  res.json({ eventIds });
};

export const getFeed = async (req, res) => {
  res.json(await eventService.listFeed(req.user.id, res.locals.query));
};
