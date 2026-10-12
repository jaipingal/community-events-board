import { z } from 'zod';

export const THEMES = ['sunset', 'ocean', 'forest'];
export const STICKERS = ['star', 'heart', 'fire', 'music', 'party'];
export const MAX_STICKERS = 3;

export const cardDesignSchema = z.object({
  theme: z.enum(THEMES, 'Choose a valid theme'),
  stickers: z
    .array(z.enum(STICKERS, 'Choose a valid sticker'), 'stickers must be a list')
    .max(MAX_STICKERS, `You can add at most ${MAX_STICKERS} stickers`),
});
