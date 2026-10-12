import * as eventService from '../services/event.service.js';
import * as preferenceService from '../services/preference.service.js';

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

export const getFeed = async (req, res) => {
  res.json(await eventService.listFeed(req.user.id, res.locals.query));
};
