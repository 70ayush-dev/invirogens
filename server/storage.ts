import {
  type Product,
  type InsertProduct,
  type NewsArticle,
  type InsertNews,
  type ContactMessage,
  type InsertContact,
} from "@shared/schema";
import { seedProducts, seedNews } from "./seed";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getNews(): Promise<NewsArticle[]>;
  getNewsBySlug(slug: string): Promise<NewsArticle | undefined>;
  createNews(article: InsertNews): Promise<NewsArticle>;
  createContactMessage(msg: InsertContact): Promise<ContactMessage>;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

class MemoryStorage implements IStorage {
  private products: Product[];
  private news: NewsArticle[];
  private contacts: ContactMessage[];
  private productId: number;
  private newsId: number;
  private contactId: number;

  constructor() {
    this.products = seedProducts.map((p, idx) => ({
      id: idx + 1,
      ...clone(p),
      featured: Boolean(p.featured),
      catalogNumber: p.catalogNumber ?? null,
      components: p.components ?? null,
      procedure: p.procedure ?? null,
      specifications: p.specifications ?? null,
      troubleshooting: p.troubleshooting ?? null,
    }));

    this.news = seedNews.map((n, idx) => ({
      id: idx + 1,
      ...clone(n),
      publishedAt: n.publishedAt ? new Date(n.publishedAt) : null,
    }));

    this.contacts = [];
    this.productId = this.products.length + 1;
    this.newsId = this.news.length + 1;
    this.contactId = 1;
  }

  async getProducts(): Promise<Product[]> {
    return clone(this.products);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return clone(this.products.find((p) => p.slug === slug));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: this.productId++,
      name: product.name,
      slug: product.slug,
      catalogNumber: product.catalogNumber ?? null,
      category: product.category,
      shortDescription: product.shortDescription,
      description: product.description,
      components: product.components ?? null,
      procedure: product.procedure ?? null,
      specifications: product.specifications ?? null,
      troubleshooting: product.troubleshooting ?? null,
      image: product.image,
      featured: Boolean(product.featured),
    };
    this.products.push(newProduct);
    return clone(newProduct);
  }

  async getNews(): Promise<NewsArticle[]> {
    const sorted = [...this.news].sort((a, b) => {
      const aTs = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTs = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return aTs - bTs;
    });
    return clone(sorted);
  }

  async getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
    return clone(this.news.find((n) => n.slug === slug));
  }

  async createNews(article: InsertNews): Promise<NewsArticle> {
    const newArticle: NewsArticle = {
      id: this.newsId++,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
    };
    this.news.push(newArticle);
    return clone(newArticle);
  }

  async createContactMessage(msg: InsertContact): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: this.contactId++,
      name: msg.name,
      email: msg.email,
      company: msg.company ?? null,
      subject: msg.subject,
      message: msg.message,
      createdAt: new Date(),
    };
    this.contacts.push(newMessage);
    return clone(newMessage);
  }
}

export const storage = new MemoryStorage();
