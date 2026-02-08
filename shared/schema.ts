import { z } from "zod";

export const insertProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  catalogNumber: z.string().nullable().optional(),
  category: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  components: z.string().nullable().optional(),
  procedure: z.string().nullable().optional(),
  specifications: z.string().nullable().optional(),
  troubleshooting: z.string().nullable().optional(),
  image: z.string().min(1),
  featured: z.boolean().nullable().optional(),
});

export const insertNewsSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  image: z.string().min(1),
  publishedAt: z.date().nullable().optional(),
});

export const insertContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().nullable().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export type Product = {
  id: number;
  name: string;
  slug: string;
  catalogNumber: string | null;
  category: string;
  shortDescription: string;
  description: string;
  components: string | null;
  procedure: string | null;
  specifications: string | null;
  troubleshooting: string | null;
  image: string;
  featured: boolean | null;
};

export type InsertProduct = z.infer<typeof insertProductSchema>;

export type NewsArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: Date | null;
};

export type InsertNews = z.infer<typeof insertNewsSchema>;

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  createdAt: Date | null;
};

export type InsertContact = z.infer<typeof insertContactSchema>;
