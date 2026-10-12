import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';

const ensureEventExists = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true },
  });

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }
};

export const hasReminder = async (userId, eventId) => {
  await ensureEventExists(eventId);

  const reminder = await prisma.eventReminder.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  return Boolean(reminder);
};

export const enableReminder = async (userId, eventId) => {
  await ensureEventExists(eventId);

  await prisma.eventReminder.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: {},
    create: { userId, eventId },
  });
};

export const disableReminder = async (userId, eventId) => {
  await ensureEventExists(eventId);

  await prisma.eventReminder.deleteMany({ where: { userId, eventId } });
};
