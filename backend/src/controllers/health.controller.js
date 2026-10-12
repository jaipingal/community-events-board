import { prisma } from '../lib/prisma.js';

export const getHealth = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'up' });
  } catch (err) {
    console.error('Health check: database unreachable', err.message);
    res.status(503).json({ status: 'degraded', database: 'down' });
  }
};
