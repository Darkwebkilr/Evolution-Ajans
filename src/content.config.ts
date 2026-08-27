import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z
      .string()
      .max(160, "SEO için açıklama 160 karakterden uzun olmamalıdır!"),
    pubDate: z.coerce.date(),
    author: z.string().default("Astro Geliştiricisi"),
    image: z.string().optional(),
    isDraft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
