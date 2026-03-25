import { z } from 'zod';

export const createConversionSchema = z.object({
  body: z.object({
    fileName: z.string().min(1, 'Le nom du fichier est requis'),
    xmlContent: z.string().min(1, 'Le contenu XML est requis'),
  }),
});