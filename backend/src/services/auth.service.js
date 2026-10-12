import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';

const SALT_ROUNDS = 10;

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const createUser = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  return publicUser(user);
};

export const checkCredentials = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(401, 'No account found with this email');
  }

  const matches = await bcrypt.compare(password, user.passwordHash);

  if (!matches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return publicUser(user);
};
