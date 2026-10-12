import { z } from 'zod';

export const CATEGORIES = ['MUSIC', 'WORKSHOP', 'FOOD', 'SPORTS', 'KIDS'];

const category = z
  .string()
  .trim()
  .toUpperCase()
  .pipe(z.enum(CATEGORIES, 'Choose a valid category'));

export const createEventSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  category,
  city: z.string().trim().min(2, 'City is required').max(60),
  startsAt: z.iso
    .datetime({ offset: true, error: 'Enter a valid date and time' })
    .transform((value) => new Date(value))
    .refine((date) => date > new Date(), 'Start time must be in the future'),
  price: z.coerce
    .number('Price must be a number')
    .min(0, 'Price cannot be negative')
    .max(10000000, 'Price is too high'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000),
  imageUrl: z.url({ protocol: /^https?$/, error: 'Enter a valid image URL (http or https)' }),
});

export const statusSchema = z.object({
  isActive: z.boolean('isActive must be true or false'),
});

const page = z.coerce.number().int().min(1).default(1);

export const listEventsQuerySchema = z.object({
  category: category.optional(),
  city: z.string().trim().min(1).max(60).optional(),
  search: z.string().trim().min(1).max(100).optional(),
  page,
  limit: z.coerce.number().int().min(1).max(50).default(9),
});

export const feedQuerySchema = z.object({
  page,
  limit: z.coerce.number().int().min(1).max(50).default(9),
});

export const favoriteCategoriesSchema = z.object({
  categories: z
    .array(category, 'categories must be a list')
    .max(CATEGORIES.length, 'Too many categories'),
});

export const adminListQuerySchema = z.object({
  page,
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
