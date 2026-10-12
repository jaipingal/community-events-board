import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import app from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

export const TEST_PASSWORD = 'secret123';

let server;
let baseUrl;

export const startServer = async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
};

export const stopServer = async () => {
  await new Promise((resolve) => server.close(resolve));
  await prisma.user.deleteMany({ where: { email: { startsWith: 'test-' } } });
  await prisma.event.deleteMany({ where: { title: { startsWith: 'Test Event' } } });
  await prisma.$disconnect();
};

export const api = async (path, { method = 'GET', body, token } = {}) => {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return { status: res.status, body: await res.json().catch(() => null) };
};

export const createUser = async () => {
  const email = `test-${randomUUID()}@example.com`;
  const signup = await api('/auth/signup', {
    method: 'POST',
    body: { name: 'Test User', email, password: TEST_PASSWORD },
  });

  return { email, token: signup.body.token };
};

export const login = async (email, password = TEST_PASSWORD) => {
  const res = await api('/auth/login', { method: 'POST', body: { email, password } });
  return res.body.token;
};

export const adminToken = () => login('admin@example.com', 'Admin@123');

export const futureDate = (days) => new Date(Date.now() + days * 86400000).toISOString();

export const newEventPayload = (overrides = {}) => ({
  title: `Test Event ${randomUUID().slice(0, 8)}`,
  category: 'MUSIC',
  city: 'Testville',
  startsAt: futureDate(5),
  price: 250,
  description: 'An event created by the automated tests.',
  imageUrl: 'https://picsum.photos/seed/test/800/450',
  ...overrides,
});
