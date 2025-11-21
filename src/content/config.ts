import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const projectCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(2),
      cover: image(),
      summary: z.string().max(160),
      description: z.string().min(20),
      services: z.array(z.string().min(2)),
      techs: z.array(z.string().min(2)),
      link: z.string().url(),
      repository: z.optional(z.string().url()),
      date: z.date(),
      images: z.array(image()),
      video: z.optional(z.string().url()),
      featured: z.optional(z.boolean()),
    }),
});

const postCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.date(),
      cover: image(),
      tag: z.enum([
        "frontend",
        "backend",
        "fullstack",
        "devops",
        "design",
        "performance",
        "i18n",
        "accessibility",
        "seo",
        "project",
        "other",
      ]),
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = {
  projects: projectCollection,
  posts: postCollection,
};
