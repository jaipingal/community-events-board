import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { verifyToken } from '../utils/token.js';

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return next(new ApiError(401, 'Invalid or expired token'));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return next(new ApiError(401, 'Invalid or expired token'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};
