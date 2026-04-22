import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    heroCtaText: z.string().optional(),
    heroImage: z.string().optional(),
    advantages: z.array(z.object({
      title: z.string(),
      desc: z.string(),
      icon: z.string()
    })).optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    image: z.string().optional(),
    category: z.enum(['News', 'Whitepaper', 'Research', 'Podcast']),
    audioFile: z.string().optional(),
  }),
});

export const collections = { pages, news };
