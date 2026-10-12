import * as reminderService from '../services/reminder.service.js';

export const getReminder = async (req, res) => {
  const enabled = await reminderService.hasReminder(req.user.id, res.locals.params.id);
  res.json({ reminder: enabled });
};

export const enableReminder = async (req, res) => {
  await reminderService.enableReminder(req.user.id, res.locals.params.id);
  res.json({ reminder: true });
};

export const disableReminder = async (req, res) => {
  await reminderService.disableReminder(req.user.id, res.locals.params.id);
  res.json({ reminder: false });
};
