import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSEO } from "@/hooks/use-seo";
import { Newspaper, ArrowRight } from "lucide-react";
import type { NewsArticle } from "@shared/schema";

export default function News() {
  useSEO({
    title: "News",
    description: "The INVIROGENS provide related news.",
  });

  const { data: articles, isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="min-h-screen pt-20">
      <section className="py-12 lg:py-16 bg-card border-b" data-testid="section-news-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-3">
            <Newspaper className="w-3 h-3 mr-1.5" />
            News
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-news-title">
            News
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            We provide products at very competitive prices.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16" data-testid="section-news-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-52 rounded-t-md rounded-b-none" />
                    <div className="p-5 space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !articles || articles.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No news articles yet</h3>
              <p className="text-muted-foreground">
                Please check back soon for updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <Card className="group overflow-visible h-full hover-elevate cursor-pointer" data-testid={`card-news-${article.id}`}>
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-md">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-muted-foreground mb-2">
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </p>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center text-primary text-sm font-medium">
                          Read More
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
