import { z } from 'zod';

export const addPositionSchema = z.object({
  body: z.object({
    symbol:   z.string().min(1).max(20).transform(v => v.toUpperCase()),
    name:     z.string().min(1).max(100),
    quantity: z.number().positive(),
    buyPrice: z.number().positive(),
  }),
});

export type AddPositionInput = z.infer<typeof addPositionSchema>['body'];