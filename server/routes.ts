import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { sendContactInquiry } from "./mailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send([
      "User-agent: *",
      "Allow: /",
      "",
      "Sitemap: /sitemap.xml",
    ].join("\n"));
  });

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const news = await storage.getNews();
      const origin = `${req.protocol}://${req.get("host")}`;
      const now = new Date().toISOString();

      const staticPaths = ["/", "/about", "/products", "/news", "/contact", "/order"];
      const urls = [
        ...staticPaths.map((path) => ({ loc: `${origin}${path}`, lastmod: now })),
        ...products.map((product) => ({ loc: `${origin}/products/${product.slug}`, lastmod: now })),
        ...news.map((article) => ({
          loc: `${origin}/news/${article.slug}`,
          lastmod: article.publishedAt ? new Date(article.publishedAt).toISOString() : now,
        })),
      ];

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((url) => [
          "  <url>",
          `    <loc>${escapeXml(url.loc)}</loc>`,
          `    <lastmod>${url.lastmod}</lastmod>`,
          "  </url>",
        ].join("\n")),
        "</urlset>",
      ].join("\n");

      res.type("application/xml").send(xml);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate sitemap" });
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/news", async (_req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:slug", async (req, res) => {
    try {
      const article = await storage.getNewsBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid form data", errors: parsed.error.issues });
      }
      const message = await storage.createContactMessage(parsed.data);
      await sendContactInquiry(parsed.data);
      res.status(201).json(message);
    } catch (error) {
      console.error("Contact submission failed:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  return httpServer;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
