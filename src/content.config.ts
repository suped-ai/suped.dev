import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SECTION_KEYS } from './nav';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    section: z.enum(SECTION_KEYS),
    order: z.number().default(99),
  }),
});

export const collections = { docs };
