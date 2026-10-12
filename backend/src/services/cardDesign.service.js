import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';

const toDesign = (design) => ({
  theme: design.theme,
  stickers: design.stickers.map((sticker) => sticker.stickerKey),
});

const ensureEventExists = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true },
  });

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }
};

export const getDesign = async (userId, eventId) => {
  await ensureEventExists(eventId);

  const design = await prisma.eventCardDesign.findUnique({
    where: { userId_eventId: { userId, eventId } },
    include: { stickers: { orderBy: { position: 'asc' } } },
  });

  return design ? toDesign(design) : null;
};

export const saveDesign = async (userId, eventId, { theme, stickers }) => {
  await ensureEventExists(eventId);

  const design = await prisma.$transaction(async (tx) => {
    const saved = await tx.eventCardDesign.upsert({
      where: { userId_eventId: { userId, eventId } },
      update: { theme },
      create: { userId, eventId, theme },
    });

    await tx.eventCardSticker.deleteMany({ where: { designId: saved.id } });
    await tx.eventCardSticker.createMany({
      data: stickers.map((stickerKey, position) => ({
        designId: saved.id,
        stickerKey,
        position,
      })),
    });

    return tx.eventCardDesign.findUnique({
      where: { id: saved.id },
      include: { stickers: { orderBy: { position: 'asc' } } },
    });
  });

  return toDesign(design);
};
