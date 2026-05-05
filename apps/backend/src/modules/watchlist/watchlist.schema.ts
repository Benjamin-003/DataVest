import { z } from 'zod';

export const addItemSchema = z.object({
  body: z.object({
    symbol: z.string().min(1).max(20).transform(v => v.toUpperCase()),
    name:   z.string().min(1).max(100),
    type:   z.enum(['STOCK', 'CRYPTO', 'COMMODITY', 'INDEX', 'FOREX']),
  }),
});

export type AddItemInput = z.infer<typeof addItemSchema>['body'];