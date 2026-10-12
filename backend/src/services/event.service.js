import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';

const upcomingAndActive = () => ({
  isActive: true,
  startsAt: { gt: new Date() },
});

const toEvent = (event) => ({ ...event, price: Number(event.price) });

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

export const listEvents = async ({ category, city, search, page, limit }) => {
  const where = {
    ...upcomingAndActive(),
    ...(category && { category }),
    ...(city && { city: { equals: city, mode: 'insensitive' } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [events, total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
      orderBy: { startsAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    events: events.map(toEvent),
    pagination: buildPagination(page, limit, total),
  };
};

export const listFeed = async (userId, { page, limit }) => {
  const favorites = await prisma.favoriteCategory.findMany({
    where: { userId },
    select: { category: true },
  });

  const where = {
    ...upcomingAndActive(),
    category: { in: favorites.map((row) => row.category) },
  };

  const [events, total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
      orderBy: { startsAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    events: events.map(toEvent),
    pagination: buildPagination(page, limit, total),
  };
};

export const listCities = async () => {
  const rows = await prisma.event.findMany({
    where: upcomingAndActive(),
    select: { city: true },
    distinct: ['city'],
    orderBy: { city: 'asc' },
  });

  return rows.map((row) => row.city);
};

export const getActiveEvent = async (id) => {
  const event = await prisma.event.findFirst({ where: { id, isActive: true } });

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  return toEvent(event);
};

export const listAllEvents = async ({ page, limit }) => {
  const [events, total] = await prisma.$transaction([
    prisma.event.findMany({
      orderBy: { startsAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count(),
  ]);

  return {
    events: events.map(toEvent),
    pagination: buildPagination(page, limit, total),
  };
};

export const createEvent = async (data) => {
  const event = await prisma.event.create({ data });
  return toEvent(event);
};

export const setEventStatus = async (id, isActive) => {
  const existing = await prisma.event.findUnique({ where: { id } });

  if (!existing) {
    throw new ApiError(404, 'Event not found');
  }

  const event = await prisma.event.update({ where: { id }, data: { isActive } });
  return toEvent(event);
};
