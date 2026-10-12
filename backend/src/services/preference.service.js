import { prisma } from '../lib/prisma.js';

export const getFavoriteCategories = async (userId) => {
  const rows = await prisma.favoriteCategory.findMany({
    where: { userId },
    select: { category: true },
    orderBy: { category: 'asc' },
  });

  return rows.map((row) => row.category);
};

export const replaceFavoriteCategories = async (userId, categories) => {
  const unique = [...new Set(categories)];

  await prisma.$transaction([
    prisma.favoriteCategory.deleteMany({ where: { userId } }),
    prisma.favoriteCategory.createMany({
      data: unique.map((category) => ({ userId, category })),
    }),
  ]);

  return getFavoriteCategories(userId);
};
